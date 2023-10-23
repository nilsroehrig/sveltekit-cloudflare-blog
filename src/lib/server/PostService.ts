import { dev } from '$app/environment';
import type { KVNamespace } from '@miniflare/kv';
import { Post, ProspectivePost } from '../domain/Post';
import { PostNotFoundError } from './errors/PostNotFoundError';

const API_URL = 'http://localhost:3000/posts';
export interface PostService {
	create(prospectivePost: ProspectivePost): Promise<Post>;
	remove(id: string): Promise<void>;
	update(id: string, updates: Partial<ProspectivePost>): Promise<Post>;
	get(id: string): Promise<Post>;
	list(): Promise<Post[]>;
}

class ProductionPostService implements PostService {
	#kv: KVNamespace;

	constructor(kv: KVNamespace) {
		this.#kv = kv;
	}
	async get(id: string): Promise<Post> {
		const post = await this.#kv.get(id, { type: 'json' });

		if (post == null) {
			throw new PostNotFoundError(id);
		}

		return Post.parse({ post });
	}

	async create(prospectivePost: ProspectivePost): Promise<Post> {
		const id = crypto.randomUUID();
		const post = Post.parse({
			...prospectivePost,
			excerpt: prospectivePost.content.substring(0, 100),
			id
		});

		await this.#kv.put(id, JSON.stringify(post));

		return post;
	}

	remove(id: string): Promise<void> {
		return this.#kv.delete(id);
	}

	async update(id: string, updates: Partial<ProspectivePost>): Promise<Post> {
		const originalPost = await this.#kv.get<Post>(id, { type: 'json' });

		if (originalPost == null) {
			throw new PostNotFoundError(id);
		}

		const updatedPost = {
			...originalPost,
			...updates,
			id
		};

		await this.#kv.put(id, JSON.stringify(updatedPost));

		return updatedPost;
	}

	async list(): Promise<Post[]> {
		const keysList = await this.#kv.list();

		const allPosts = await Promise.all(
			keysList.keys.map((key) => this.#kv.get<Partial<Post>>(key.name, { type: 'json' }))
		);

		return allPosts
			.reduce((acc, post) => {
				const parseResult = Post.safeParse(post);

				if (parseResult.success) {
					acc.push(parseResult.data);
				} else {
					console.error(parseResult.error);
				}

				return acc;
			}, new Array<Post>())
			.sort(byPublishedDesc);
	}
}

class DevelopmentPostService implements PostService {
	async get(id: string): Promise<Post> {
		const response = await fetch(`${API_URL}/${id}`);

		if (response.status === 404) {
			throw new PostNotFoundError(id);
		}

		const post = await response.json();
		return Post.parse(post);
	}

	async create(prospectivePost: ProspectivePost): Promise<Post> {
		const post = {
			...prospectivePost,
			excerpt: prospectivePost.content.substring(0, 100),
			id: crypto.randomUUID()
		};

		const response = await fetch(`${API_URL}`, {
			method: 'post',
			body: JSON.stringify(post),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const result = await response.json();
		console.log({ result });

		return result;
	}

	async remove(id: string): Promise<void> {
		const response = await fetch(`${API_URL}/${id}`, {
			method: 'delete'
		});

		if (response.status === 404) {
			throw new PostNotFoundError(id);
		}
	}

	async update(id: string, updates: Partial<ProspectivePost>): Promise<Post> {
		const post = await this.get(id);

		const response = await fetch(`${API_URL}/${id}`, {
			method: 'put',
			body: JSON.stringify({ ...post, ...updates }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return response.json();
	}

	async list(): Promise<Post[]> {
		const response = await fetch(`${API_URL}`);
		const posts = await response.json();
		return posts.map(Post.parse).sort(byPublishedDesc);
	}
}

function byPublishedDesc(a: Post, b: Post) {
	return b.published.valueOf() - a.published.valueOf();
}

export function createPostService(platform?: App.Platform): PostService {
	if (dev) {
		return new DevelopmentPostService();
	}

	return new ProductionPostService(platform?.env.BLOG_POSTS as KVNamespace);
}

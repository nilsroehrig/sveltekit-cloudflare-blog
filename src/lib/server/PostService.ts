import { dev } from '$app/environment';
import type { KVNamespace } from '@miniflare/kv';
import { Post, ProspectivePost } from '../domain/Post';
import { PostNotFoundError } from './errors/PostNotFoundError';

let postsDb = new Array<Post>();

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
	get(id: string): Promise<Post> {
		const maybeFoundPost = postsDb.find((post) => post.id === id);
		if (maybeFoundPost == null) {
			throw new PostNotFoundError(id);
		}
		return Promise.resolve(maybeFoundPost);
	}
	create(prospectivePost: ProspectivePost): Promise<Post> {
		const post = {
			...prospectivePost,
			excerpt: prospectivePost.content.substring(0, 100),
			id: crypto.randomUUID()
		};
		postsDb.push(post);
		return Promise.resolve(post);
	}
	remove(id: string): Promise<void> {
		postsDb = postsDb.filter((post) => post.id !== id);
		return Promise.resolve();
	}
	async update(id: string, updates: Partial<ProspectivePost>): Promise<Post> {
		const maybeFoundPost = await this.get(id);
		Object.assign(maybeFoundPost, updates);
		return maybeFoundPost;
	}
	list(): Promise<Post[]> {
		return Promise.resolve(postsDb.sort(byPublishedDesc));
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

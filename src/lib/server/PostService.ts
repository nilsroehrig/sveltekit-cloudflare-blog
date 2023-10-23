import type { KVNamespace } from '@miniflare/kv';
import { PostNotFoundError } from './errors/PostNotFoundError';
import { ProspectivePost, Post } from '../domain/ProspectivePost';
import postsDb from './dev/posts.db';

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
		const post = {
			...prospectivePost,
			excerpt: prospectivePost.content.substring(0, 100)
		};

		await this.#kv.put(id, JSON.stringify(post));

		return Post.parse({
			...post,
			id
		});
	}
	remove(id: string): Promise<void> {
		return this.#kv.delete(id);
	}
	async update(id: string, updates: Partial<ProspectivePost>): Promise<Post> {
		const originalPost = await this.#kv.get<Post>(id, { type: 'json' });
		const updatedPost = {
			...originalPost,
			...updates
		};
		await this.#kv.put(id, JSON.stringify(updatedPost));
		return Post.parse({ ...updatedPost, id: id });
	}
	async list(): Promise<Post[]> {
		const list = await this.#kv.list();
		const allPosts = await Promise.all(
			list.keys.map((key) => this.#kv.get<Partial<Post>>(key.name, { type: 'json' }))
		);

		return allPosts.reduce((acc, post) => {
			const parseResult = Post.safeParse(post);
			if (parseResult.success) {
				acc.push(parseResult.data);
			}
			return acc;
		}, new Array<Post>());
	}
}

class DevelopmentPostService implements PostService {
	#posts: Post[];
	constructor(posts: Post[] = postsDb) {
		this.#posts = posts;
	}
	get(id: string): Promise<Post> {
		const maybeFoundPost = this.#posts.find((post) => post.id === id);
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
		this.#posts.push(post);
		return Promise.resolve(post);
	}
	remove(id: string): Promise<void> {
		this.#posts = this.#posts.filter((post) => post.id !== id);
		return Promise.resolve();
	}
	async update(id: string, updates: Partial<ProspectivePost>): Promise<Post> {
		const maybeFoundPost = await this.get(id)
		Object.assign(maybeFoundPost, updates);
		return maybeFoundPost;
	}
	list(): Promise<Post[]> {
		return Promise.resolve(this.#posts);
	}
}

export function createPostService(platform?: App.Platform): PostService {
	if (platform?.env.BLOG_POSTS) {
		return new ProductionPostService(platform?.env.BLOG_POSTS);
	} else {
		return new DevelopmentPostService();
	}
}

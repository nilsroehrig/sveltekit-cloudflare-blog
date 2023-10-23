// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface Platform {
			env: {
				BLOG_POSTS?: KVNamespace;
				AUTH_SECRET: string,
				GITHUB_SECRET: string,
				GITHUB_ID: string,
				ALLOWED_USERS: string
			};
		}
	}
}

export {};

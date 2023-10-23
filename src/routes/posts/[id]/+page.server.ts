import { createPostService } from '$lib/server/PostService.js';
import { PostNotFoundError } from '$lib/server/errors/PostNotFoundError.js';
import { error } from '@sveltejs/kit';

export function load({ params, platform }) {
	const service = createPostService(platform);

	try {
		const post = service.get(params.id);
		return {
			post
		};
	} catch (e) {
		if (e instanceof PostNotFoundError) {
			throw error(404);
		}

		throw e;
	}
}

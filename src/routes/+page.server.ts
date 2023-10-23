import { createPostService } from '$lib/server/PostService.js';

export function load({platform}) {
    const service = createPostService(platform);

    return {
        posts: service.list()
    }
}
import { ProspectivePost } from '$lib/domain/ProspectivePost.js';
import { createPostService } from '$lib/server/PostService.js';
import { fail, redirect } from '@sveltejs/kit';

export function load({ platform, params }) {
	const service = createPostService(platform);
	return {
		post: service.get(params.id)
	};
}

export const actions = {
	async update({ platform, request }) {
		const formData = await request.formData();

		const id = formData.get('id');
		const title = formData.get('title');
		const published = formData.get('published');
		const content = formData.get('content');

        if(typeof id !== "string") {
            return fail(400);
        }

		const parseResult = ProspectivePost.partial().safeParse({
			title,
			published,
			content
		});

        if(!parseResult.success) {
            return fail(400);
        }

		const service = createPostService(platform);

		await service.update(id, parseResult.data);
        
        throw redirect(302, "/admin");
	},
    async delete({ platform, request }) {
		const formData = await request.formData();

		const id = formData.get('id');

        if(typeof id !== "string") {
            return fail(400);
        }

        const service = await createPostService(platform);
        await service.remove(id);
        throw redirect(302, "/admin");
    }
}

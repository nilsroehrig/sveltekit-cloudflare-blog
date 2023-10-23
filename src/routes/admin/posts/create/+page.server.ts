import { ProspectivePost } from '$lib/domain/Post.js';
import { createPostService } from '$lib/server/PostService.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	async default({ request, platform }) {
		const formData = await request.formData();
		const title = formData.get('title');
		const published = formData.get('published');
		const content = formData.get('content');
        const author = "NR";

        const prospectivePostParseResult = ProspectivePost.safeParse({
            title,
            published,
            content,
            author
        });

        if(!prospectivePostParseResult.success) {
            return fail(400);
        }

        const service = createPostService(platform);

        await service.create(prospectivePostParseResult.data);

        throw redirect(302, "/admin");
	}
};

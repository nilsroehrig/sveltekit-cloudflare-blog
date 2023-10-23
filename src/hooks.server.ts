/* import GitHub from '@auth/core/providers/github';
import { SvelteKitAuth } from '@auth/sveltekit';
import { error, redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authorization: Handle = async ({ event, resolve }) => {
	// Protect any routes under /authenticated
	if (event.url.pathname.startsWith('/admin')) {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/login');
		}
		if (!event.platform?.env.ALLOWED_USERS.split(',').includes(String(session.user?.email))) {
			throw error(403);
		}
	}

	// If the request is still here, just proceed as normally
	return resolve(event);
};

export const handle: Handle = sequence(
	SvelteKitAuth(async (event) => {
		const authOptions = {
			providers: [
				GitHub({
					clientId: event.platform?.env.GITHUB_ID,
					clientSecret: event.platform?.env.GITHUB_SECRET
				})
			],
			secret: event.platform?.env.AUTH_SECRET,
			trustHost: true
		};
		return authOptions;
	}),
	authorization
); */

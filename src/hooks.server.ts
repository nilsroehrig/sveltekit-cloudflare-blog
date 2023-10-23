import { ALLOWED_USERS, AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
import GitHub from '@auth/core/providers/github';
import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authorization: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/admin')) {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/login');
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(
	SvelteKitAuth(async (event) => {
		const authOptions: SvelteKitAuthConfig = {
			providers: [
				GitHub({
					clientId: GITHUB_ID,
					clientSecret: GITHUB_SECRET
				})
			],
			secret: AUTH_SECRET,
			trustHost: true,
			callbacks: {
				signIn({ profile }) {
					if (!profile?.email) {
						return Promise.resolve(false);
					}

					return Promise.resolve(ALLOWED_USERS.includes(String(profile?.email)));
				}
			}
		};
		return authOptions;
	}),
	authorization
);

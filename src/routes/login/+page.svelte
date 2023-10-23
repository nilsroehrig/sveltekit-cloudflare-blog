<script>
	import { signIn } from '@auth/sveltekit/client';
</script>

<article>
	<header><strong>Login</strong></header>
	<button on:click={() => signIn('github', { callbackUrl: '/' })}>Sign in with GitHub</button>
</article>

<script>
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
	import '@picocss/pico';
</script>

<header class="container">
	<nav>
		<ul><li><strong>SvelteKit-Cloudflare-Blog</strong></li></ul>
		<ul>
			<li><a href="/" class="secondary">Home</a></li>

			<li><a href="/admin" class="secondary">Admin</a></li>
			<li>
				{#if $page.data.session?.user}
					<button on:click={() => signOut({ callbackUrl: '/' })} class="action logout secondary"
						>Logout</button
					>
				{/if}
			</li>
		</ul>
	</nav>
</header>
<main class="container"><slot /></main>

<style>
	.logout {
		padding: var(--nav-link-spacing-vertical) var(--nav-link-spacing-horizontal);
		margin: calc(var(--nav-link-spacing-vertical) * -1) 0;
		min-width: fit-content;
	}
</style>

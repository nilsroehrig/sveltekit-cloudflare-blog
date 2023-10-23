<script>
	import { page } from '$app/stores';
	import '@picocss/pico';

	$: isAdminPage = $page.url.pathname.startsWith('/admin');
</script>

<header class="container">
	<nav>
		<ul><li><strong>SvelteKit-Cloudflare-Blog</strong></li></ul>
		<ul>
			<li><a href="/" class="secondary">Home</a></li>
			
				<li>
					{#if isAdminPage}
						<a href="/admin/logout" role="button" class="secondary">Logout</a>
					{:else}
						<a href="/admin" role="button" class="secondary">Admin</a>
					{/if}
				</li>
			
		</ul>
	</nav>
</header>
<main class="container"><slot /></main>

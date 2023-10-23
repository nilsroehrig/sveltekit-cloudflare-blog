<script>
	export let data;
	$: posts = data.posts;
</script>

<article>
	<header>
        <strong>Admin Dashboard</strong> 
        <a href="/admin/posts/create" role="button">Create Post</a>
    </header>

	<ol>
		{#each posts as post (post.id)}
			<li><a href="/admin/posts/{post.id}">{post.title}</a></li>
		{:else}
			<li class="unstyled">No posts yet.</li>
		{/each}
	</ol>
</article>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }

    ol {
        padding: 0;
    }

    .unstyled {
        list-style: none;
        padding: 0;
    }
</style>

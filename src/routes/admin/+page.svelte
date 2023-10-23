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
			<li><a href="/admin/posts/{post.id}">{post.title}</a> <small>– published at {post.published.toLocaleString("en-UK")}</small></li>
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

    header a {
        font-size: 85%;
        --form-element-spacing-vertical: .5rem;
        --form-element-spacing-horizontal: .75rem;
    }

    ol {
        padding: 0;
    }

    li {
        padding: 0;
        list-style: none;
    }
</style>

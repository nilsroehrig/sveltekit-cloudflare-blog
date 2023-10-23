<script>
    export let data;
</script>

{#each data.posts as post (post.id)}
    <article>
        <header>
            <strong>{post.title}</strong>
            <small><date>{post.published.toLocaleString("en-UK")}</date></small>
        </header>
        <p>{post.excerpt}</p>
    </article>
{:else}
    <article>
        <p>No posts yet.</p>
    </article>
{/each}

<style>
    article > :last-child {
        margin-bottom: 0;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }
</style>
<script>
	export let data;
</script>

{#if data.posts.length}
	<div class="articles">
		{#each data.posts as post (post.id)}
			<a href="/posts/{post.id}" class="article-card">
				<article>
					<strong>{post.title}</strong>
					<span
						>Published on <date>{post.published.toLocaleString('en-UK')}</date> by {post.author}</span
					>
				</article>
			</a>
		{/each}
	</div>
{:else}
	<article>
		<p>No posts yet.</p>
	</article>
{/if}

<style>
	article > :last-child {
		margin-bottom: 0;
	}

    .articles {
        display: grid;
        grid-template-columns: 1fr;
        align-items: stretch;
        gap: 1rem;
        margin-top: 2rem;
    }

	@media screen and (min-width: 768px) {
		.articles {
			grid-template-columns: 1fr 1fr;
		}
	}

	.article-card {
		color: inherit;
        
	}

    .article-card article {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin: 0;
        height: 100%;
    }

	.article-card strong {
		font-size: 2rem;
		display: block;
	}

	.article-card span {
		display: block;
		margin-top: 1rem;
	}
</style>

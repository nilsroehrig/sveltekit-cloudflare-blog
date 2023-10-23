<script>
	import { marked } from 'marked';

	export let data;
</script>

<article>
	<h1>{data.post.title}</h1>
	{@html marked.parse(data.post.content)}
    <p class="meta">Published on <date>{data.post.published.toLocaleString('en-UK')}</date> by {data.post.author}</p>
</article>

<style>
    .meta {
        margin-top: 1rem;
        margin-bottom: 0;
        border-top: dotted thin gray;
        padding-top: 1rem;
    }
</style>

<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Post } from '$lib/domain/Post';
	import { markdown } from '@codemirror/lang-markdown';
	import CodeMirror from 'svelte-codemirror-editor';

	export let post: Post | undefined = undefined;

	let draft = post
		? { ...post, published: post.published.toISOString().split('.')[0] }
		: { title: '', content: '', published: '' };

	$: hasPost = post != undefined;
	$: defaultAction = hasPost ? '?/update' : undefined;
</script>

<form method="post" use:enhance>
	{#if hasPost}
		<input type="hidden" name="id" value={post?.id} />
	{/if}
	<article>
		<header>
			<strong>Create Post</strong>
		</header>
		<div class="grid">
			<label>
				Title:
				<input
					type="text"
					name="title"
					placeholder="Enter post title..."
					bind:value={draft.title}
				/>
			</label>
			<label>
				<!-- TODO: fix timezone mismatch -->
				Publish at:
				<input
					type="datetime-local"
					name="published"
					placeholder="YYYY-MM-DD HH:MM"
					value={draft.published}
				/>
			</label>
		</div>
		<label>
			Content:
			<textarea name="content" bind:value={draft.content} style:display="none" />

			<CodeMirror
				bind:value={draft.content}
				lang={markdown()}
				lineWrapping
				styles={{
					'&': {
						width: '100%',
						height: '15rem',
						border: 'thin solid var(--form-element-border-color)',
						borderRadius: 'var(--border-radius)',
						overflow: 'hidden'
					}
				}}
			/>
		</label>
		<footer>
			<div class="actions-right">
				<a href="/admin" role="button" class="secondary">Cancel</a>
				<button type="submit" formaction={defaultAction}
					>{#if hasPost}Update{:else}Create{/if}</button
				>
			</div>
			{#if hasPost}
				<div class="actions-left">
					<button type="submit" class="outline contrast" formaction="?/delete">Delete</button>
				</div>
			{/if}
		</footer>
	</article>
</form>

<style>
	form {
		display: contents;
	}

	label:last-child,
	textarea {
		margin-bottom: 0;
	}

	footer {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
	}

	footer button {
		width: auto;
		margin-bottom: 0;
	}

	.actions-left {
		order: 0;
		display: flex;
		justify-content: flex-start;
		gap: 1rem;
		margin-right: auto;
	}

	.actions-right {
		order: 1;
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-left: auto;
	}
</style>

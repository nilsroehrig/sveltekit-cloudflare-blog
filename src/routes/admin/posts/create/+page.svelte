<form method="post">
	<article>
		<header>
			<strong>Create Post</strong>
		</header>
		<div class="grid">
			<label>
				Title:
				<input type="text" name="title" placeholder="Enter post title..." />
			</label>
			<label>
				Publish at:
				<input type="datetime-local" name="published" placeholder="YYYY-MM-DD HH:MM" />
			</label>
		</div>
		<label>
			Content:
			<textarea name="content" placeholder="Enter post content..." rows="8" />
		</label>
		<footer>
			<a href="/admin" role="button">Cancel</a>
			<button type="submit">Create</button>
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
		justify-content: flex-end;
		align-items: baseline;
		gap: 1rem;
	}

	footer > button {
		width: auto;
		margin-bottom: 0;
	}
</style>

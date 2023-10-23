<script lang="ts">
	import PostForm from "$lib/components/PostForm.svelte";

    export let data;
</script>

<PostForm post={data.post} />
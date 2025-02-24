<script lang="ts">
  import GeneratorForm from '$lib/components/GeneratorForm.svelte';
  
  export let data;
</script>

<div class="container mx-auto px-4 py-8">
  <GeneratorForm user={data.user} />
</div>

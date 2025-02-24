<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Swiftie App Generator</title>
</svelte:head>

<div class="min-h-screen">
  <main>
    <slot />
  </main>

  {#if $page.error}
    <div class="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>{$page.error.message}</p>
    </div>
  {/if}
</div>

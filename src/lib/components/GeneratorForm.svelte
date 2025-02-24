<script lang="ts">
  import { enhance } from '$app/forms';
  import type { GitHubUser, DeploymentStatus } from '$lib/types';
  import { validateRepoName, validateArtifactFile } from '$lib/utils/validation';
  import ProgressIndicator from './ProgressIndicator.svelte';
  import { fade, slide } from 'svelte/transition';
  
  export let user: GitHubUser | null = null;
  export let result: string | null = null;
  export let error: string | null = null;
  
  let fileInput: HTMLInputElement;
  let isSubmitting = false;
  let nameError: string | null = null;
  let fileError: string | null = null;
  let deploymentStatus: DeploymentStatus | null = null;
  
  $: isLoggedIn = !!user;

  function validateForm(formData: FormData): boolean {
    const name = formData.get('name') as string;
    const file = formData.get('specs') as File;
    
    nameError = validateRepoName(name);
    fileError = validateArtifactFile(file);
    
    return !nameError && !fileError;
  }
</script>

<div class="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
  <h1 class="text-2xl mb-6">
    {#if isLoggedIn}
      Hi {user.login}! 👋
    {:else}
      You're not logged in! 👋
      <p class="text-sm text-gray-600 mt-2">
        Please log into GitHub in your Chrome browser to continue.
      </p>
    {/if}
  </h1>

  {#if isLoggedIn}
    <form
      method="POST"
      enctype="multipart/form-data"
      use:enhance={() => {
        isSubmitting = true;
        error = null;
        result = null;
        
        return async ({ formData, update }) => {
          if (!validateForm(formData)) {
            isSubmitting = false;
            return;
          }
          
          const response = await update();
          const data = response.data;
          
          if (data?.status) {
            deploymentStatus = data.status;
          }
          
          isSubmitting = false;
        };
      }}
    >
      <h2 class="text-xl font-medium mb-4">Let's make another one!</h2>
      <div class="border-t border-gray-200 pt-4">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-swift-purple focus:ring-swift-purple sm:text-sm"
              required
              on:input={(e) => nameError = validateRepoName(e.currentTarget.value)}
            />
            {#if nameError}
              <p class="mt-1 text-sm text-red-600" transition:slide>{nameError}</p>
            {/if}
          </div>
          
          <div>
            <label for="specs" class="block text-sm font-medium text-gray-700">Specs:</label>
            <input
              type="file"
              id="specs"
              name="specs"
              accept=".txt"
              bind:this={fileInput}
              class="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-swift-purple file:text-white
                hover:file:bg-swift-purple/90"
              required
              on:change={(e) => fileError = validateArtifactFile(e.currentTarget.files?.[0])}
            />
            {#if fileError}
              <p class="mt-1 text-sm text-red-600" transition:slide>{fileError}</p>
            {/if}
            <p class="mt-1 text-sm text-gray-500">
              Only .txt files are supported. Max size: 5MB
            </p>
          </div>
        </div>
        
        <button
          type="submit"
          class="mt-6 w-full bg-swift-purple text-white py-2 px-4 rounded-md hover:bg-swift-purple/90 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Amaze me'}
        </button>
      </div>
    </form>

    {#if deploymentStatus}
      <div class="mt-6 border-t border-gray-200 pt-4">
        <ProgressIndicator status={deploymentStatus} />
      </div>
    {/if}

    {#if result || error}
      <div class="mt-6 border-t border-gray-200 pt-4">
        <h3 class="font-medium mb-2">Result:</h3>
        {#if result}
          <p transition:fade>
            Here you go! <a href={result} class="text-swift-purple hover:underline" target="_blank">{result}</a>
          </p>
        {:else if error}
          <p class="text-red-600" transition:fade>{error}</p>
        {/if}
      </div>
    {/if}
  {/if}
</div>

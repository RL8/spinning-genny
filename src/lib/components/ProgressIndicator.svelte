<script lang="ts">
  import type { DeploymentStatus } from '$lib/types';
  import { CheckCircle, Circle, AlertCircle } from 'lucide-svelte';
  
  export let status: DeploymentStatus;
  
  const steps = [
    { id: 'init', label: 'Initializing' },
    { id: 'create-repo', label: 'Creating Repository' },
    { id: 'upload-files', label: 'Uploading Files' },
    { id: 'enable-pages', label: 'Setting up GitHub Pages' },
    { id: 'deploy', label: 'Deploying Site' }
  ];
  
  function getStepStatus(stepId: string) {
    if (status.error && status.step === stepId) return 'error';
    if (status.step === stepId) return 'active';
    if (steps.findIndex(s => s.id === stepId) < steps.findIndex(s => s.id === status.step)) return 'completed';
    return 'pending';
  }
</script>

<div class="space-y-3">
  {#each steps as step}
    {@const stepStatus = getStepStatus(step.id)}
    <div class="progress-step {stepStatus}">
      {#if stepStatus === 'completed'}
        <CheckCircle class="w-5 h-5 mr-2" />
      {:else if stepStatus === 'error'}
        <AlertCircle class="w-5 h-5 mr-2" />
      {:else}
        <Circle class="w-5 h-5 mr-2" />
      {/if}
      {step.label}
    </div>
  {/each}
</div>

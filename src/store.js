import { writable, derived } from 'svelte/store';

export const count = writable({});

export const projects = derived(apiData, ($apiData) => {
    if ($apiData.projects){
      return $apiData.projects.map(projects => projects);
    }
    return [];
  });
<script>
	// export let name;
	import Project from './components/Project.svelte'
	import { TabContent, TabPane } from 'sveltestrap';
	import { Col, Container } from 'sveltestrap';
	import { onMount } from 'svelte';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast'
	import { Button, Modal } from 'sveltestrap';
	let open = false;
	const toggle = () => (open = !open);

	let projects = [];
	let new_project_name;

	onMount(async() => {
		await fetch(`http://localhost:8000/dashboard`)
		.then(r => r.json())
		.then(data => {
			projects = data.projects;
		})
	})

	function createProject() {
		toggle()
		fetch('http://localhost:8000/projects', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				name: new_project_name
			})
		}).then((response) => response.json())
		.then((project) => {
			projects = [...projects, project]
			toast.push('New project ' + new_project_name + ' successfully created!', {
				theme: {
					'--toastBackground': '#48BB78',
    				'--toastBarBackground': '#2F855A'
				}
			})
		})
	
	}

</script>

<style>

</style>

<Container>
	<SvelteToast />
	{#if projects}
		<div class="row">
			<div class="col"><h2>Projects</h2></div>
			<div class="col">
				<!-- <a href="#" class="btn btn-success text-white">Create New Project</a> -->
				<button class="btn btn-success" on:click={toggle}>Create Project</button>
			</div>
		
		</div>
		{#if projects.length !== 0}
			<Col>
			<TabContent vertical pills>
				{#each projects as project, i}
					<TabPane tabId="{project.id}" tab="{project.name}" active={i == 0} class="w-100">
						<Project {...project}/>
					</TabPane>
				{/each}
			</TabContent>
			</Col>
		{:else}
			<p class="text-info">No projects yet</p>
		{/if}
		
	{:else}
		<p class="text-info">Loading Projects...</p>
	{/if}


	<Modal body header="Create New Project" isOpen={open} {toggle}>
		<form action="">
			<input type="text" bind:value={new_project_name}>
			<button  class="btn btn-primary" type="submit" on:click|preventDefault={createProject}>Create Project</button>
		</form>
	  </Modal>
	

</Container>
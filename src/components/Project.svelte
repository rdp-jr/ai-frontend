<script>
    import Dataset from './Dataset.svelte'
    import Model from './Model.svelte'
    
    export let id;
    export let name;
    export let models;
    export let real_datasets;
    import { TabContent, TabPane } from 'sveltestrap';
    import { Accordion, AccordionItem } from 'sveltestrap';
    let modal_model_open = false;
	const modal_model_toggle = () => (modal_model_open = !modal_model_open);


    let modal_real_dataset_open = false;
	const modal_real_dataset_toggle = () => (modal_real_dataset_open = !modal_real_dataset_open);

    import { SvelteToast, toast } from '@zerodevx/svelte-toast'
	import { Button, Modal } from 'sveltestrap';



    let new_model_name;
    let new_model_batch_size;
    let new_model_training_cycles;

    let new_real_dataset_file;


    function createModel() {
		modal_model_toggle()
		fetch(`http://localhost:8000/projects/${id}/models`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				name: new_model_name,
                parameters: {
                    batch_size: new_model_batch_size,
                    training_cycles: new_model_training_cycles
                }
			})
		})
        .then((response) => { 
            if (response.status === 201) {
                return response.json()
            } else {
                if (response.status === 409)
                    toast.push('Name already taken', {
                    theme: {
                        '--toastBackground': '#F56565',
                        '--toastBarBackground': '#C53030'
                    }
                })
                throw new Error('something went wrong')
            }
            
        })
		.then((model) => {
			models = [...models, model]
			toast.push('New model ' + new_model_name + ' successfully created!', {
				theme: {
					'--toastBackground': '#48BB78',
    				'--toastBarBackground': '#2F855A'
				}
			})
		}).catch((error) => {
            // console.log('uyy error')
            // console.log(error.json())
        })
	
	}

    function createRealDataset() {
		modal_real_dataset_toggle()
        console.log(new_real_dataset_file[0])

        const formData = new FormData()
        // var f = new File([""], new_real_dataset_file[0].name, {type: 'text/html'})
        var blob = new Blob([""], {type: 'text/html'})
        // formData.append("file", new_real_dataset_file[0])
        formData.append("file", f)


		fetch(`http://localhost:8000/projects/${id}/real_datasets`, {
			headers: {
				'Content-Type': 'multipart/form-data'
			},
           
			method: 'POST',
			body: formData
		})
        .then((response) => { 
            if (response.status === 201) {
                return response.json()
            } else {
                
                toast.push('Error occurred', {
                    theme: {
                        '--toastBackground': '#F56565',
                        '--toastBarBackground': '#C53030'
                    }
                })
                throw new Error('something went wrong')
            }
            
        })
		.then((real_dataset) => {
			real_datasets = [...real_datasets, real_dataset]
			toast.push('New real dataset successfully created!', {
				theme: {
					'--toastBackground': '#48BB78',
    				'--toastBarBackground': '#2F855A'
				}
			})
		}).catch((error) => {
            // console.log('uyy error')
            // console.log(error.json())
        })
	
	}

</script>

<style>
</style>

<div>
    
    <h4>{name}</h4>

    <TabContent class="ms-5">
        <TabPane tabId="models" tab="Model" active>
            <div class="row mb-5 mt-3">
                <div class="col-6"><h3 class="fw-bold">Models</h3></div>
                <button class="btn btn-success  w-25" on:click={modal_model_toggle}>Create Model</button>
            </div>
            
            <Accordion flush>       
                {#if models.length !== 0}
                    {#each models as model, i}
                        <div class="row">
                            <div class="col-6">
                            <AccordionItem header={model.name} active={i == 0}>
                            <Model 
                                project_id={id}
                                id={model.id} 
                                name={model.name} 
                                parameters={model.parameters} 
                                synthetic_datasets={model.synthetic_datasets}
                            />
                            </AccordionItem>
                            </div>
                            <div class="col-6">
                                
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <a href="javascript:void(0)" class="btn btn-danger text-white">Delete Model</a>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <a href="javascript:void(0)" class="btn btn-primary text-white">Update Name</a>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <p class="text-info">No models yet</p>
                {/if}
                
            </Accordion>
           
        </TabPane>
        <TabPane tabId="real_datasets" tab="Real Datasets">
            <div class="row mb-5 mt-3">
                <div class="col-6"><h3 class="fw-bold">Real Datasets</h3></div>
                <button class="btn btn-success  w-25" on:click={modal_real_dataset_toggle}>Create Dataset</button>
            </div>
            {#if real_datasets.length !== 0}
                {#each real_datasets as dataset}
                    <div class="row mb-5 mt-3">
                        <div class="col-6">
                            <Dataset 
                                project_id={id}
                                id={dataset.id} 
                                name={dataset.name} 
                                url={dataset.url}/>
                        </div>
                        <div class="col-6">    
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a href="javascript:void(0)" class="btn btn-danger text-white">Delete Data</a>
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a href="javascript:void(0)" class="btn btn-primary text-white">Update Name</a>
                        </div>
                    </div>
                {/each}
            {:else}
                <p class="text-info">No real datasets yet</p>
            {/if}
            
           
        </TabPane>
       
    </TabContent>



<Modal body header="Create New Model" isOpen={modal_model_open} {modal_model_toggle}>
    <form action="">
        <label for="name">Name</label>
        <input id="name" type="text" bind:value={new_model_name} required>
        <label for="batch_size">Batch Size</label>
        <input id="batch_size" type="number" bind:value={new_model_batch_size} required>
        <label for="training_cycles">Training Cycles</label>
        <input id="training_cycles" type="number" bind:value={new_model_training_cycles} required>
        <button class="btn btn-primary" type="submit" on:click|preventDefault={createModel}>Create Model</button>
    </form>
</Modal>


<Modal body header="Create New Dataset" isOpen={modal_real_dataset_open} {modal_real_dataset_toggle}>
    <form action="">
        <label for="file">File</label>
        <input id="file" type="file" bind:files={new_real_dataset_file} required>
        
        <button class="btn btn-primary" type="submit" on:click|preventDefault={createRealDataset}>Create Dataset</button>
    </form>
</Modal>

</div>
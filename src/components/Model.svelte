<script>
    import Dataset from './Dataset.svelte'
    export let project_id;
    export let id;
    export let name;
    export let parameters;
    export let synthetic_datasets;
</script>

<style>

</style>

<div class="ms-3">
    <p>Parameters</p>
    <div class="ms-3">
        <p>Batch Size: {parameters.batch_size}</p>
        <p>Training Cycles: {parameters.training_cycles}</p>
    </div>
</div>

<div class="ms-3">
    <div class="row">
        <div class="col-6">
            <p>Synthetic Data</p>
        </div>
        <div class="col-6">
            <a href="#" class="btn btn-success text-white">Create synthetic data</a>
        </div>
    </div>
    {#if synthetic_datasets.length !== 0}
        {#each synthetic_datasets as dataset}
        <div class="row">
            <div class="col-6">
                <Dataset id={dataset.id} name={dataset.name} url={dataset.url}/>
            </div>
            <div class="col-6">
                <a href="#" class="btn btn-danger text-white">Delete synthetic data</a>
            </div>
        </div>
        {/each}
    {:else}
        <p class="text-info">No synthetic datasets yet</p>
    {/if}

</div>
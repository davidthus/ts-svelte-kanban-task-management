<script lang="ts">
	import { BUTTONTYPES } from '../../constants/buttonTypes';
	import { boards, deleteTask } from '../../stores/boardStore';
	import { closeModal, type IDetails } from '../../stores/modalStore';
	import Button from '../button.svelte';
	export let modalDetails: IDetails;
	$: ({ boardIndex, columnIndex, taskIndex } = modalDetails);

	function handleDelete() {
		if (typeof columnIndex === 'number' && typeof taskIndex === 'number') {
			deleteTask(boardIndex, columnIndex, taskIndex);
		}
		closeModal();
	}

	function handleCancel() {
		closeModal();
	}
	$: taskName =
		typeof columnIndex === 'number' && typeof taskIndex === 'number'
			? $boards[boardIndex].columns[columnIndex].tasks[taskIndex].title
			: '';
</script>

<h2 class="text-red text-left headingl">Delete this task?</h2>
<p class="bodyl text-grey text-left">
	Are you sure you want to delete the ‘{taskName}’ task and its subtasks? This action cannot be
	reversed.
</p>
<div class="flex gap-4 w-full">
	<Button config={{ buttonType: BUTTONTYPES.DESTRUCTIVE }} on:click={handleDelete}>Delete</Button>
	<Button config={{ buttonType: BUTTONTYPES.SECONDARY }} on:click={handleCancel}>Cancel</Button>
</div>

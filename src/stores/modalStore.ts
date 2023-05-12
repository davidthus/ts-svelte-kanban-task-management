import { writable } from 'svelte/store';
import { modalTypes } from '../constants/modalTypes';

interface IDetails {
	taskIndex: number | null;
	columnIndex: number | null;
	boardIndex: number | null;
}

export const modalInfo = writable<{ isModalOpen: boolean; modalType: number; details: IDetails }>({
	isModalOpen: false,
	modalType: modalTypes.VIEWTASK,
	details: {
		taskIndex: null,
		columnIndex: null,
		boardIndex: null
	}
});

export function openModal({ modalType, details }: { modalType: number; details: IDetails }) {
	modalInfo.set({
		isModalOpen: true,
		modalType,
		details
	});
}

export function closeModal() {
	modalInfo.set({
		isModalOpen: false,
		modalType: modalTypes.VIEWTASK,
		details: {
			taskIndex: null,
			columnIndex: null,
			boardIndex: null
		}
	});
}

export function changeModalDetails(details: IDetails) {
	modalInfo.update((prev) => ({
		...prev,
		details
	}));
}

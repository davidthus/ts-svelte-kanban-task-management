/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { writable } from 'svelte/store';
import { themeTypes } from '../constants/themeTypes';
import Data from '../data/data.json';

const initialState = {
	sidebarOpen: true,
	theme: themeTypes.DARKTHEME
};

export const data = writable<{
	sidebarOpen: boolean;
	theme: number;
	activeBoard?: string | null;
}>(initialState);

export const loadData = () => {
	const loadedData =
		localStorage.getItem('data') !== null
			? JSON.parse(localStorage.getItem('data')!)
			: initialState;
	const activeBoard =
		localStorage.getItem('boards') !== null
			? JSON.parse(localStorage.getItem('boards')!)[0].name
			: Data.boards[0].name;

	if (loadedData?.activeBoard) {
		data.set(loadedData);
	} else {
		data.set({ ...loadedData, activeBoard });
	}
};
loadData();

data.subscribe((value) => {
	localStorage.setItem('data', JSON.stringify(value));
});

export function toggleSidebar() {
	data.update((prev) => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
}

export function toggleTheme() {
	data.update((prev) => ({
		...prev,
		theme: prev.theme === 1 ? themeTypes.DARKTHEME : themeTypes.LIGHTTHEME
	}));
}

export function toggleActiveBoard(newActiveBoard: string | null) {
	data.update((prev) => ({ ...prev, activeBoard: newActiveBoard }));
}

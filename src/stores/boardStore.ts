/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { writable } from 'svelte/store';
import data from '../data/data.json';
import type { IBoard, IColumn, ISubtask, ITask } from '../types/board';

export const boards = writable<IBoard[]>([]);

export const loadBoards = () => {
	const loadedBoards =
		localStorage.getItem('boards') !== null
			? JSON.parse(localStorage.getItem('boards')!)
			: data.boards;
	boards.set(loadedBoards);
};
loadBoards();

boards.subscribe((value) => {
	localStorage.setItem('boards', JSON.stringify(value));
});

export function addBoard(boardName: string) {
	boards.update((prev) => [...prev, { name: boardName, columns: [] }]);
}

export function addColumn(columnName: string, boardIndex: number) {
	boards.update((prev) =>
		prev.map((board, currentBoardIndex) => {
			if (currentBoardIndex === boardIndex) {
				board.columns = [...board.columns, { name: columnName, tasks: [] }];
			}
			return board;
		})
	);
}

export function addTask(newTask: ITask, boardIndex: number, columnIndex: number) {
	boards.update((prev) =>
		prev.map((board, currentBoardIndex) => {
			if (currentBoardIndex === boardIndex) {
				board.columns = board.columns.map((column, currentColumnIndex) => {
					if (currentColumnIndex === columnIndex) {
						column.tasks = [...column.tasks, newTask];
					}
					return column;
				});
			}
			return board;
		})
	);
}

export function updateBoard(updatedBoard: IBoard, index: number) {
	boards.update((prev) =>
		prev.map((board, currentBoardIndex) => {
			if (currentBoardIndex === index) {
				return updatedBoard;
			}
			return board;
		})
	);
}

// columns dont get updated, boards can either delete or add them, or tasks can be added to them or deleted

export function updateTask(
	updatedTask: ITask,
	boardIndex: number,
	columnIndex: number,
	oldColumnIndex: number,
	taskIndex: number
) {
	boards.update((prev) =>
		prev.map((board, currentBoardIndex) => {
			let taskStatusChanged = false;

			if (currentBoardIndex === boardIndex) {
				board.columns = board.columns.map((column, currentColumnIndex) => {
					if (currentColumnIndex === oldColumnIndex && currentColumnIndex === columnIndex) {
						column.tasks[taskIndex] = updatedTask;
					} else if (currentColumnIndex === columnIndex) {
						column.tasks = [...column.tasks, updatedTask];
						taskStatusChanged = true;
					}

					return column;
				});
			}

			if (taskStatusChanged) {
				board.columns[oldColumnIndex].tasks.splice(taskIndex, 1);
			}

			return board;
		})
	);
}

export function deleteBoard(index: number) {
	boards.update((prev) => prev.filter((_, currentBoardIndex) => currentBoardIndex !== index));
}

export function deleteTask(boardIndex: number, columnIndex: number, taskIndex: ITask) {
	boards.update((prev) =>
		prev.map((board, currentBoardIndex) => {
			if (currentBoardIndex === boardIndex) {
				board.columns = board.columns.map((column: IColumn, currentColumnIndex: number) => {
					if (currentColumnIndex === columnIndex) {
						column.tasks = column.tasks.filter(
							(task, currentTaskIndex) => currentTaskIndex !== taskIndex
						);
					}
					return column;
				});
			}
			return board;
		})
	);
}

export function changeTaskStatus(
	task: ITask,
	boardIndex: number,
	columnIndex: number,
	oldColumnIndex: number,
	taskIndex: number
) {
	boards.update((prev) =>
		prev.map((board: IBoard, currentBoardIndex: number) => {
			let taskStatusChanged = false;
			let newColumns;
			if (currentBoardIndex === boardIndex) {
				newColumns = board.columns.map((column, currentColumnIndex) => {
					// START OF CODE BLOCK
					const taskStatusChangedToCurrentColumn =
						columnIndex !== oldColumnIndex && columnIndex === currentColumnIndex;

					if (taskStatusChangedToCurrentColumn) {
						taskStatusChanged = true;
						return { ...column, tasks: [...column.tasks, { ...task, status: column.name }] };
					}

					return column;
					// END OF CODE BLOCK
				});
			}

			if (taskStatusChanged) {
				return {
					name: board.name,
					columns: newColumns.map((newColumn, currentNewColumn) => {
						// removes the old task from old column if tasks did indeed change
						if (currentNewColumn === oldColumnIndex) {
							return {
								...newColumn,
								tasks: newColumn.tasks.filter(
									(task, currentTaskIndex) => currentTaskIndex !== taskIndex
								)
							};
						}
						return newColumn;
					})
				};
			}

			return board;
		})
	);
}

export function toggleSubtask(
	subtaskIndex: number,
	taskIndex: number,
	boardIndex: number,
	columnIndex: number,
	currentSubtaskState: boolean
) {
	boards.update((prev) =>
		prev.map((board, currentBoardIndex) => {
			if (currentBoardIndex === boardIndex) {
				board.columns = board.columns.map((column: IColumn, currentColumnIndex: number) => {
					if (currentColumnIndex === columnIndex) {
						column.tasks = column.tasks.map((task: ITask, currentTaskIndex: number) => {
							if (currentTaskIndex === taskIndex) {
								task.subtasks = task.subtasks.map(
									(subtask: ISubtask, currentSubtaskIndex: number) => {
										if (currentSubtaskIndex === subtaskIndex) {
											subtask.isCompleted = !currentSubtaskState;
										}
										return subtask;
									}
								);
							}

							return task;
						});
					}

					return column;
				});
			}

			return board;
		})
	);
}

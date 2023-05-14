export enum buttonStateTypes {
	DEFAULT,
	HOVER,
	ACTIVE
}

export type buttonStateType =
	| buttonStateTypes.DEFAULT
	| buttonStateTypes.ACTIVE
	| buttonStateTypes.HOVER;

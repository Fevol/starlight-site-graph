export type MenuItem = {
	group?: string;
	text: string;
	icon?: string;
	onClick: () => void;
};

export type ActionButtonOption = MenuItem & {
	icon: string;
};

export const INPUT_TYPES = {
	single: 'SINGLE',
	multi: 'MULTI'
};

export const FIELDS = {
	name: {
		label: 'Title',
		input_type: INPUT_TYPES.single
	},
	authors: {
		label: 'Authors',
		input_type: INPUT_TYPES.multi
	},
	tags: {
		label: 'Tags',
		input_type: INPUT_TYPES.multi
	},
	description: {
		label: 'Description',
		input_type: INPUT_TYPES.single
	},
	link: {
		label: 'Link',
		input_type: INPUT_TYPES.single
	}
};

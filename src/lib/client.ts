import { createClient } from '@urql/svelte';

export default createClient({
	url: 'https://graphql.us.fauna.com/graphql',

	fetchOptions: () => {
		const token = import.meta.env.VITE_SECRET;
		return {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
	}
});

export const details = [
	{
		icon: 'i-fluent-hat-graduation-24-regular',
		text: 'Robear Mankaryous'
	},
	{
		icon: 'i-carbon-home',
		text: '25 Highland View Dr, Sutton MA'
	},
	{
		icon: 'i-carbon-calendar',
		text: 'Saturday, 06/18/2022'
	},
	{
		icon: 'i-carbon-time',
		text: '02:00 PM - 08:00 PM'
	},
	{
		icon: 'i-carbon-phone',
		text: '(774) 777-1034'
	}
];

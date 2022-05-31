<script lang="ts">
	import { setContextClient, gql, getContextClient, mutationStore } from '@urql/svelte';
	import { page } from '$app/stores';
	import client from '$lib/client';
	setContextClient(client);

	let userStatus: string;
	$: users = mutationStore({
		client: getContextClient(),
		query: gql`
			mutation UpdateUser($id: ID!, $status: Status) {
				partialUpdateUser(id: $id, data: { status: $status }) {
					name
					status
					email
				}
			}
		`,
		variables: {
			id: $page.params.id,
			status: userStatus
		}
	});

	const setStatus = (status: string) => {
		userStatus = status;
	};

	const details = [
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
			text: '06:00 PM - 10:00 PM'
		},
		{
			icon: 'i-carbon-phone',
			text: '774-777-1034'
		}
	];

	const confirms = [
		{
			text: 'No',
			color: '#BB2222',
			status: 'NO'
		},
		{
			text: 'Maybe',
			color: '#1133BB',
			status: 'MAYBE'
		},
		{
			text: 'Yes',
			color: '#118833',
			status: 'YES'
		}
	];
</script>

<svelte:head>
	<title>{$users.data?.partialUpdateUser?.name ?? 'Graduation'}</title>
</svelte:head>

<template>
	<div flex flex-col gap-6>
		<h1 leading-12 text-12>Graduation Party</h1>
		<div>
			<ul flex flex-col gap-2>
				{#each details as detail}
					<li flex items-center gap-4 pb-2 border-b-2 border-dark-600>
						<div text-2xl class={detail.icon} />
						{detail.text}
					</li>
				{/each}
			</ul>
		</div>
		<div bg-dark-600 rounded-2 overflow-hidden>
			{#if $users.error || ($users.data && $users.data.partialUpdateUser == null)}
				<div justify-between p-4 bg-red-800 text-light-800 font-bold>
					<p>Uh oh. {$users.error ?? "We didn't even receive an error."}</p>
					<p>If you see this, text me @ 774-777-1034</p>
				</div>
			{:else}
				{@const user = $users.data?.partialUpdateUser}
				<div flex justify-between p-4 bg-light-400 text-dark-800 font-bold>
					<p>Secure Access Card</p>
					<div text-2xl class="i-carbon-identification" />
				</div>
				<ul p-4 flex flex-col gap-2>
					<li flex items-center gap-4 pb-2 border-b-2 border-dark-200>
						<div text-2xl class="i-carbon-user" />
						{#if user?.name}
							{user.name}
						{:else}
							<div w="1/3" h="1.5em" rounded-md animate-pulse bg-dark-200 />
						{/if}
					</li>
					<li flex items-center gap-4 pb-2 border-b-2 border-dark-200>
						<div text-2xl class="i-carbon-email" />
						{#if user?.email}
							{user.email}
						{:else}
							<div w="1/2" h="1.5em" rounded-md animate-pulse bg-dark-200 />
						{/if}
					</li>
					<li flex items-center gap-4 pb-2 border-b-2 border-dark-200>
						<div text-2xl class="i-carbon-api" />
						{#if user?.status}
							Response: {user.status.charAt(0) + user.status.toLowerCase().slice(1)}
						{:else}
							<div w="1/4" h="1.5em" rounded-md animate-pulse bg-dark-200 />
						{/if}
					</li>
				</ul>
			{/if}
		</div>
		{#if !$users.error && !($users.data && $users.data.partialUpdateUser == null)}
			{@const user = $users.data?.partialUpdateUser}
			<div
				transition-all
				style="opacity: {$users.fetching ? '0.5' : '1.0'};
				filter: saturate({$users.fetching ? '0%' : '100%'})"
				disabled={$users.fetching}
			>
				<p>Credentials Verified.</p>
				<p>Please confirm attendance below:</p>
				<div mt-4 flex flex-col justify-between gap-4>
					{#each confirms as confirm}
						<button
							on:click={() => setStatus(confirm.status)}
							pl-2
							text-6
							text-left
							h-12
							style:background-color={confirm.color}
							style:border-bottom={user?.status == confirm.status ? '6px solid #fafafa' : ''}
						>
							> {confirm.text}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</template>

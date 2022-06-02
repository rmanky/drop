<script lang="ts">
	import { gql, setContextClient } from '@urql/svelte';
	import client from '$lib/client';
	import { details } from '$lib/client';
	setContextClient(client);

	let error = '';
	let name = '';
	let phone = '';

	const signUp = (name: string, phone: string) => {
		// convert phone number to form (XXX) XXX-XXXX
		const phoneNumber = phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

		if (name.length < 3) {
			error = 'Name must be at least 3 characters long';
			return;
		}

		if (phoneNumber.length < 10) {
			error = 'Phone number must be at least 10 digits long';
			return;
		}

		client
			.mutation(
				gql`
					mutation CreateUser($name: String!, $phone: String!) {
						createUser(data: { name: $name, phone: $phone, status: PENDING }) {
							_id
							name
							phone
							status
						}
					}
				`,
				{ name, phone: phoneNumber }
			)
			.toPromise()
			.then((result) => {
				if (result.error) {
					error = result.error.message;
				} else {
					// redirect to id
					window.location.href = `/grad/${result.data.createUser._id}`;
				}
			});
	};
</script>

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
		<div flex-shrink bg-dark-600 rounded-2 overflow-hidden>
			<div flex justify-between gap-8 p-4 bg-light-400 text-dark-800 font-bold>
				<p>Sign Up Below</p>
				<div text-2xl class="i-carbon-identification" />
			</div>
			<form on:submit|preventDefault={() => signUp(name, phone)}>
				<div flex flex-col gap-4 p-4>
					<label>
						<span text-light-800>Name</span>
						<input
							w-full
							p-2
							border
							border-gray-400
							bg-dark-600
							rounded-lg
							type="text"
							placeholder="John M. Doe"
							bind:value={name}
						/>
					</label>
					<label>
						<span text-light-800>Phone</span>
						<input
							w-full
							p-2
							border
							border-gray-400
							bg-dark-600
							rounded-md
							type="text"
							placeholder="(999) 999-9999"
							bind:value={phone}
						/>
					</label>
					<input
						p-2
						disabled={!name || !phone}
						style:opacity={!name || !phone ? '0.2' : '1.0'}
						class="!bg-blue-800 {name && phone ? 'hover:!bg-blue-600' : ''}"
						text-light-200
						rounded-md
						hover:cursor-pointer
						type="submit"
					/>
				</div>
			</form>
		</div>
		{#if error}
			<div bg-red-800 p-4 rounded-md>
				<div>{error}</div>
				<div>If you are seeing this, please text me: 774-777-1034</div>
			</div>
		{/if}
	</div>
</template>

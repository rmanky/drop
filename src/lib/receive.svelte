<script lang="ts">
	import { onMount } from 'svelte';
	import Send from '$lib/send.svelte';
	export let targetId: string;

	let message = '';
	const state = {
		connection: undefined
	};

	onMount(async () => {
		const Peer = (await import('peerjs')).default;
		const peer = new Peer({ debug: 3 });
		console.log('Created new peer');

		peer.on('open', (selfId) => {
			console.log(`Connected to server with ID ${selfId}`);

			state.connection = peer.connect(targetId);
			state.connection.on('open', () => {
				console.log('Connected to peer');
			});
		});

		peer.on('error', function (err) {
			console.log(err);
		});
	});

	const send = () => {
		if (state.connection) {
			state.connection.send(message);
			console.log(`Sent message: ${message}`);
			message = '';
		}
	};
</script>

<div>
	<p>Receiver</p>
	<p>Target: {targetId}</p>
	<Send connection={state.connection} />
</div>

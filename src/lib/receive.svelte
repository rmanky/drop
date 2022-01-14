<script lang="ts">
	import { onMount } from 'svelte';
	import download from 'downloadjs';
	export let targetId: string;

	const state = {
		connection: undefined
	};

	const fileDetails = {
		name: '',
		size: 0,
		type: ''
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

			state.connection.on('data', (data) => {
				download(data.buffer, data.name, data.type);
				console.log('Received data');
			});
		});

		peer.on('error', function (err) {
			console.log(err);
		});
	});
</script>

<div>
	<p>Receiver</p>
	<p>Target: {targetId}</p>
</div>

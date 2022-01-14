<script>
	export let connection;

	let message = '';

	const send = () => {
		if (connection) {
			connection.send(message);
			console.log(`Sent: ${message}`);
			message = '';
		}
	};
</script>

<input bind:value={message} />
<button on:click={send}>Send</button>

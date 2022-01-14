<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Receive from '$lib/receive.svelte';
	import QRCode from '$lib/qrcode.svelte';
</script>

<h1>Receive</h1>
<Receive targetId={$page.params.id} />
<QRCode id={$page.params.id} />

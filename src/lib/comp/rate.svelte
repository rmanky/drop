<script lang="ts">
	import { formatBytes } from '$lib/util/convert';
	export let sent: number = 0;
	let time: number = 0;
	let interval: NodeJS.Timer;
	let startTime: number = Date.now();

	let started: boolean = false;

	export function start() {
		startTime = Date.now();
		started = true;
		// update time every second
		interval = setInterval(() => {
			time = (Date.now() - startTime) / 1000;
		}, 100);
	}

	export function stop() {
		clearInterval(interval);
		started = false;
	}
</script>

<template>
	<p>Total Sent: {formatBytes(sent)} in {time} seconds</p>
	<p>Transfer Rate: {formatBytes(time ? sent / time : 0)} per second</p>
	<p>Interval Debug: {interval}</p>
	<p>Started Debug: {started}</p>
</template>

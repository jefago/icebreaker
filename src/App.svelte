<script lang="ts">
	import { writable } from 'svelte/store'
import BackgroundImage from './BackgroundImage.svelte';
	import questions from './questions'

	const message = writable<string[] | undefined>(undefined);
	
	let question, keyword : string;
	
	$: if ($message) {
		[question, keyword] = $message;
	}

	function pickRandomMessage() {
		const index = Math.floor(Math.random() * questions.length);
		message.set(questions[index]);
		console.log(`Index ${index}, message: ${JSON.stringify(questions[index])}`)
	}


</script>

<main>
	{#if keyword }
		<BackgroundImage keyword={keyword} />	
	{/if }
	<div>
		<h1>{question ?? 'Click Randomize to generate an icebreaker question!'}</h1>
		<button on:click={() => pickRandomMessage()}>Randomize!</button>
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		font-size: 4em;
		font-weight: 100;
		position:relative;
		z-index: 100;

		height: 3.6em;
		line-height:1.2em;
		font-family:Impact,sans-serif;
		font-weight: bold;
		color:white;
		text-shadow:0px 0px 8px black;

	}

	button {
		position:relative;
		z-index: 100;
		font-family:sans-serif;
	}

	div {
		width:100%;
	}

	
</style>
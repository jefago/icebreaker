<script lang="ts">
	import { writable } from 'svelte/store'
import BackgroundImage from './Icebreaker.svelte';
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
		<BackgroundImage keyword={keyword} question={question}/>	
	{/if }
	<div>
		<button on:click={() => pickRandomMessage()}>Randomize!</button>
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	div {
		position:absolute;
		top:80%;
		left:0px;
		width:100%;
		text-align:center;
		z-index:100;
	}

	button {
		font-family: sans-serif;
	}
	
</style>
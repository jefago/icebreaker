<script lang="ts">
	import { writable } from 'svelte/store'
	import questions from './questions'

	const message = writable();
	
	$: question = $message ? $message[0] : '';

	function pickRandomMessage() {
		const index = Math.floor(Math.random() * questions.length);
		message.set(questions[index]);
		console.log(`Index ${index}, message: ${JSON.stringify(questions[index])}`)
	}


</script>

<main>
	<h1>{question}</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<button on:click={() => pickRandomMessage()}>Randomize!</button>

</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
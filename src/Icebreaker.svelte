<script lang="ts">
  import { writable } from "svelte/store";
import LoadingSpinner from "./LoadingSpinner.svelte";


  export let keyword : string;
  export let question : string;
  
  const shown = writable<boolean>(false);
  const url = writable<string>("");
  const displayedQuestion = writable<string>("");

  const apiKey = process.env.UNSPLASH_API_KEY;

  $: {
    shown.set(false);

    fetch(`https://api.unsplash.com/photos/random?client_id=${apiKey}&query=${keyword}`)
    .then(res => res.json())
    .then(json => {
      console.log(JSON.stringify(json));
      let img = new Image();
      img.src = json.urls.regular;
      img.onload = () => {
        url.set(img.src);
        shown.set(true);
        displayedQuestion.set(question);
      }
    })
    .catch(() => {
      // TODO error handling
    });  }
</script>

<div class="icebreaker {$shown ? "shown" : "hidden"}" style="background-image:url({$url})">
  <h1>{$displayedQuestion}</h1>
</div>
{#if !$shown}
  <LoadingSpinner />
{/if}

<style>
  div.icebreaker {
    transition: opacity 250ms;
    width:100%;
    height:100%;
    position:absolute;
    top:0px;
    left:0px;
    background-size:cover;
    display:flex;
    align-items: center;
    justify-content: center;
  }

  h1 {
    font-size:4em;
		line-height:1.2em;
		font-family:Impact,sans-serif;
		font-weight: bold;
		color:white;
		text-shadow:0px 0px 8px black;
  }

  div.hidden {
    opacity:0%;
  }

  div.shown {
    opacity:100%;
  }
</style>


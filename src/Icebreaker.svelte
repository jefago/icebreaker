<script lang="ts">
  import { writable } from "svelte/store";
import LoadingSpinner from "./LoadingSpinner.svelte";


  export let keyword : string;
  export let question : string;
  
  const shown = writable<boolean>(false);
  const background = writable<string>("");
  const displayedQuestion = writable<string>("");

  const apiKey = process.env.UNSPLASH_API_KEY;

  $: {
    shown.set(false);


    const finish = (newBackground : string) => {
      background.set(newBackground);
      shown.set(true);
      displayedQuestion.set(question);
    }

    fetch(`https://api.unsplash.com/photos/random?client_id=${apiKey}&query=${keyword}`)
    .then(res => {
      if (!res.ok) throw "Non-ok result from Unsplash";
      return res.json();
    })
    .then(json => {
      console.log(JSON.stringify(json));
      let img = new Image();
      img.src = json.urls.regular;
      img.onload = () => {
        finish(`url(${img.src})`);
      }
      img.onerror = () => {
        finish('black');
      }
    })
    .catch(() => {
      finish('black');
      // TODO error handling
    });  }
</script>

<div class="icebreaker {$shown ? "shown" : "hidden"}" style="background:{$background}">
  <h1>{$displayedQuestion}</h1>
</div>
{#if !$shown}
  <LoadingSpinner />
{/if}

<style>
  div.icebreaker {
    transition: opacity 500ms;
    width:100%;
    height:100%;
    position:absolute;
    top:0px;
    left:0px;
    background-size:cover !important;
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


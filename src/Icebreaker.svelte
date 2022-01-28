<script lang="ts">
  import { writable } from "svelte/store";
import LoadingSpinner from "./LoadingSpinner.svelte";


  export let keyword : string;
  export let question : string;

  type AuthorInfo = {
    name : string;
    profileUrl : string;
  }


  const shown = writable<boolean>(false);
  const background = writable<string>("");
  const displayedQuestion = writable<string>("");
  const authorInfo = writable<AuthorInfo|null>(null);

  const apiKey = process.env.UNSPLASH_API_KEY;

  $: {
    shown.set(false);


    const finish = (newBackground : string, author?: AuthorInfo) => {
      background.set(newBackground);
      shown.set(true);
      displayedQuestion.set(question);
      authorInfo.set(author ?? null);
    }

    fetch(`https://api.unsplash.com/photos/random?client_id=${apiKey}&query=${keyword}`)
    .then(res => {
      if (!res.ok) throw "Non-ok result from Unsplash";
      return res.json();
    })
    .then(json => {
      let img = new Image();
      img.src = json.urls.regular;
      img.onload = () => {
        finish(`url(${img.src})`, {name: json.user.name, profileUrl: json.user.links.html});
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
  {#if $authorInfo }
    <div class="authorInfo">
      Photo by
      <a href="{$authorInfo.profileUrl}?utm_source=Icebreaker&utm_medium=referral" rel="noopener noreferrer">{$authorInfo.name}</a>
      on
      <a href="https://unsplash.com?utm_source=Icebreaker&utm_medium=referral" rel="noopener noreferrer">Unsplash</a></div>
  {/if}
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

  div.authorInfo {
    position:absolute;
    right:0px;
    bottom:0px;
    background-color: black;
    padding:6px;
    color:white;
    font-size:12px;
    font-family:Arial, Helvetica, sans-serif;
  }

  div.authorInfo a, div.authorInfo a:link, div.authorInfo a:visited {
    color:white;
  } 

  h1 {
    font-size:4em;
		line-height:1.2em;
		font-family:Impact,sans-serif;
		font-weight: bold;
		color:white;
		text-shadow:0px 0px 8px black;
    margin:0em .5em;
  }

  @media (max-width:600px) {
    h1 {
      font-size:2em;
    }
  }

  div.hidden {
    opacity:0%;
  }

  div.shown {
    opacity:100%;
  }
</style>


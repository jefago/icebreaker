<script lang="ts">
import { writable } from "svelte/store";


  export let keyword : string;

  const shown = writable<boolean>(false);

  $: {
    keyword;
    shown.set(false);
    setTimeout(() => {
      shown.set(true);
    }, 1000)
  }
</script>

<div class="{$shown ? "shown" : "hidden"}">{keyword}</div>

<style>
  div {
    background-color:green;
    position:absolute;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
    transition:opacity 250ms;
  }

  div.hidden {
    opacity:0%;
  }

  div.shown {
    opacity:100%;
  }
</style>


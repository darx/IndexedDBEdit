<script>
  export let position = "Top";
  export let dismiss = true;
  export let active = false;
  export let sound = false;
  export let text;
  export let timeout = Infinity;

  import { audio } from "../stubs/tips";
  import { fade } from "svelte/transition";
  import ActionsIcons from "./icons/Actions.svelte";

  $: if (active === true && sound === true) audio.play();

  $: if (active === true && timeout !== Infinity) {
    setTimeout(() => (active = false), timeout);
  }
</script>

{#if active}
  <div
    class="tip"
    transition:fade
    class:top={position == "Top"}
    class:bottom={position == "Bottom"}
  >
    <span>{text}</span>
    {#if dismiss}
      <button type="button" on:click={() => (active = false)}>
        <ActionsIcons size={16} name="exit" />
      </button>
    {/if}
  </div>
{/if}

<style>
  .tip {
    right: 50%;
    z-index: 10;
    padding: 1em;
    display: flex;
    max-width: 264px;
    position: absolute;
    text-align: center;
    align-items: center;
    transform: translate(50%, 0);
    background-color: var(--light-secondery-background-colour, #ebebeb);
    border: 1px solid var(--light-border-colour, #d3d3d3);
  }

  .tip span {
    user-select: none;
  }

  .tip.top {
    top: 1em;
  }

  .tip.bottom {
    bottom: 1em;
  }

  @media (prefers-color-scheme: dark) {
    .tip {
      color: #fff;
      background-color: var(--dark-secondery-background-colour, #292a2d);
      border: 1px solid var(--dark-border-colour, #494c50);
    }
  }
</style>

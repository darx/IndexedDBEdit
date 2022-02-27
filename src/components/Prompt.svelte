<script>
  export let active = false;

  import keyBindings from "../utils/keyBindings";
  import ActionsIcons from "./icons/Actions.svelte";
</script>

{#if active === true}
  <div class="prompt">
    <div class="wrapper">
      <div class="header">
        <button
          type="button"
          on:click={() => (active = false)}
          use:keyBindings={["altKey", 27]}
          aria-label="Close settings"
          title="Close settings - Alt&hairsp;+&hairsp;Esc"
        >
          <ActionsIcons size="24" name="exit" />
        </button>
      </div>

      <div class="content">
        <slot name="content" />
      </div>
    </div>
  </div>
{/if}

<style>
  .prompt {
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    height: 100%;
    display: flex;
    position: fixed;
    background-color: rgb(32 33 36 / 80%);
  }

  .prompt .wrapper {
    padding: 1em;
    border: 1px solid #494c50;
    margin: auto;
    max-width: 600px;
    width: 100%;
    height: 100%;
    max-height: 400px;
    background-color: #202124;
  }

  .header {
    display: flex;
  }

  .header button {
    margin: 0 0 0 auto;
  }
</style>

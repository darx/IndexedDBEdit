<script>
  export let active = false;

  import keyBindings from "../utils/keyBindings";
  import clickOutside from "../utils/clickOutside";
  import ActionsIcons from "./icons/Actions.svelte";
</script>

{#if active === true}
  <div class="prompt">
    <div class="wrapper" use:clickOutside on:outclick={() => (active = false)}>
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

      <div class="actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
{/if}

<style>
  .prompt {
    top: 0;
    left: 0;
    width: 100%;
    z-index: 20;
    height: 100%;
    display: flex;
    position: fixed;
    background-color: rgb(32 33 36 / 80%);
  }

  .prompt .wrapper {
    padding: 1em;
    border: 1px solid var(--light-border-colour, #494c50);
    margin: auto;
    max-width: 600px;
    width: 100%;
    height: 100%;
    display: flex;
    max-height: 400px;
    position: relative;
    flex-direction: column;
    background-color: var(--light-primary-background-colour, #202124);
  }

  .prompt .content {
    height: 100%;
    overflow: auto;
  }

  .header {
    top: 0;
    left: 0;
    width: 100%;
    padding: 1em;
    display: flex;
    position: absolute;
    box-sizing: border-box;
  }

  .header button {
    margin: 0 0 0 auto;
  }

  :global(.content .row label) {
    display: block;
  }

  .wrapper .actions {
    display: flex;
    margin: auto 0 0 0;
    justify-content: end;
  }

  @media (prefers-color-scheme: dark) {
    .prompt .wrapper {
      border: 1px solid var(--dark-border-colour, #494c50);
      background-color: var(--dark-primary-background-colour, #202124);
    }
  }
</style>

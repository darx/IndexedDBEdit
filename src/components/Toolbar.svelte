<script>
  import { tick } from "svelte";

  import Prompt from "./Prompt.svelte";
  import keyBindings from "../utils/keyBindings";
  import ActionsIcons from "./icons/Actions.svelte";

  let settingsPrompt = false;

  let inputFilter;
  let inputFilterDisplay = false;

  const inputFilterOnClick = async () => {
    inputFilterDisplay = !inputFilterDisplay;
    await tick();
    if (inputFilterDisplay) inputFilter.focus();
  };
</script>

<Prompt bind:active={settingsPrompt}>
  <div slot="content">This is a test</div>
</Prompt>

<div class="toolbar">
  <button
    use:keyBindings={["altKey", "shiftKey", 70]}
    class="toolbar-item toolbar-button"
    class:active={inputFilterDisplay}
    type="button"
    style="display:none"
    on:click={inputFilterOnClick}
    aria-label="Filter object stores"
    title="Filter object stores - Alt&hairsp;+&hairsp;Shift&hairsp;+&hairsp;F"
  >
    <ActionsIcons size="16" name="filter" />
  </button>

  <button
    use:keyBindings={["ctrlKey", "shiftKey", 69]}
    class="toolbar-item toolbar-button"
    type="button"
    on:click={() => location.reload(true)}
    aria-label="Reload page"
    title="Reload page - Ctrl&hairsp;+&hairsp;Shift&hairsp;+&hairsp;E"
  >
    <ActionsIcons size="16" name="refresh" />
  </button>

  <button
    use:keyBindings={["altKey", "shiftKey", 83]}
    class="toolbar-item toolbar-button"
    type="button"
    on:click={() => (settingsPrompt = !settingsPrompt)}
    aria-label="Settings"
    title="Settings - Alt&hairsp;+&hairsp;Shift&hairsp;+&hairsp;S"
  >
    <ActionsIcons size="16" name="settings" />
  </button>
</div>

{#if inputFilterDisplay}
  <div class="toolbar toolbar-expand">
    <input
      bind:this={inputFilter}
      class="toolbar-input"
      type="search"
      placeholder="Filter"
    />
  </div>
{/if}

<style>
  .toolbar {
    display: flex;
    justify-content: end;
    border-bottom: 1px solid #494c50;
  }

  .toolbar-button {
    white-space: nowrap;
    overflow: hidden;
    min-width: 28px;
    background: 0 0;
    border-radius: 0;
    cursor: pointer;
    color: inherit;
  }

  .toolbar-input {
    color: inherit;
    background-color: inherit;
    border: 1px solid #494c50;
    border-radius: 2px;
    margin: 6px auto 6px 6px;
    padding-left: 4px;
    width: calc(100% - 12px);
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
  }

  .toolbar-input:focus {
    outline: 0;
    border-color: hsl(214deg 47% 48%);
  }

  .toolbar-item {
    position: relative;
    display: flex;
    background-color: transparent;
    flex: none;
    align-items: center;
    justify-content: center;
    padding: 0;
    height: 26px;
    border: none;
    white-space: pre;
  }

  @media (prefers-color-scheme: dark) {
    .toolbar-button {
      color: #919191;
    }

    .toolbar-button:hover,
    .toolbar-button.active {
      color: #fff;
    }
  }
</style>

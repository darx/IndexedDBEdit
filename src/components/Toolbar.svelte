<script>
  import { tick, createEventDispatcher } from "svelte";

  import { databases } from "../store";

  import settings from "../stubs/settings";

  import Input from "./Input.svelte";
  import Prompt from "./Prompt.svelte";
  import keyBindings from "../utils/keyBindings";
  import ActionsIcons from "./icons/Actions.svelte";
  import DownloadButton from "./button/Download.svelte";

  let settingsPrompt = false;

  let inputFilter;
  let inputFilterDisplay = false;

  const dispatch = createEventDispatcher();

  const inputFilterOnClick = async () => {
    inputFilterDisplay = !inputFilterDisplay;
    await tick();
    if (inputFilterDisplay) inputFilter.focus();
  };

  $: preferences = $settings.reduce(
    (acc, curr) => ((acc[curr.name] = curr.value), acc),
    {}
  );

  const isOptionVisible = (option) => {
    if (typeof option.visible === "undefined") return true;
    for (let key in option.visible) {
      if (
        $settings.find((x) => x.name == key && x.value == option.visible[key])
      ) {
        return true;
      }
    }
    return false;
  };

  const actionManualSaveClick = () => dispatch("manualSave");

  $: downloadContentName =
    "indexeddb-" +
    new Date()
      .toISOString()
      .replace(/(\.|\:|Z)|T/g, "-")
      .slice(0, -1) +
    ".json";
</script>

<Prompt bind:active={settingsPrompt}>
  <div slot="content">
    <h2>Settings</h2>
    {#each $settings as option}
      {#if !option.visible || isOptionVisible(option)}
        <Input bind:value={option.value} {...option} />
      {/if}
    {/each}
  </div>
  <svelte:fragment slot="actions">
    <DownloadButton
      name={downloadContentName}
      contentType="application/json;charset=utf-8"
      content={JSON.stringify($databases, null, preferences.tab_size)}
    />
  </svelte:fragment>
</Prompt>

<div class="toolbar">
  {#if preferences.save_method == "Manually"}
    <button
      class="toolbar-item toolbar-button"
      class:active={inputFilterDisplay}
      type="button"
      on:click={actionManualSaveClick}
      aria-label="Save changes"
      title="Save changes"
    >
      <ActionsIcons size="16" name="save" />
    </button>
  {/if}

  <button
    use:keyBindings={["altKey", "shiftKey", 70]}
    class="toolbar-item toolbar-button"
    class:active={inputFilterDisplay}
    type="button"
    style="display:none"
    on:click={inputFilterOnClick}
    aria-label="Filter object stores"
    title="Filter object stores - Ctrl&hairsp;+&hairsp;Shift&hairsp;+&hairsp;S"
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
  <div class="toolbar toolbar-expand" />
{/if}

<style>
  .toolbar {
    display: flex;
    justify-content: end;
    border-bottom: 1px solid var(--light-border-colour, #d3d3d3);
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
    .toolbar {
      border-bottom: 1px solid var(--dark-border-colour, #494c50);
    }

    .toolbar-button {
      color: #919191;
    }

    .toolbar-button:hover,
    .toolbar-button.active {
      color: #fff;
    }
  }
</style>

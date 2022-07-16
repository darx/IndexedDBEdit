<script>
  export let json = [];
  export let value = [];
  export let editor;

  import settings from "../stubs/settings";

  $: preferences = $settings.reduce(
    (acc, curr) => ((acc[curr.name] = curr.value), acc),
    {}
  );

  import { onDestroy, onMount, createEventDispatcher } from "svelte";

  import diff from "deep-diff";
  import ace from "ace-builds";

  import "brace";
  import "brace/keybinding";
  import "brace/ext/searchbox";
  import "brace/mode/json";
  import "brace/worker/json";
  import "brace/theme/twilight";

  import isJSON from "../utils/isJSON";

  let container;

  const dispatch = createEventDispatcher();

  const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  };

  export const save = () => {
    let content = editor.getValue();

    if (!isJSON(content)) return;

    let parsed = JSON.parse(content);

    let difference = diff(value, parsed);
    if (!difference) return;

    dispatch("save", [parsed, difference, value]);

    value = json = parsed;
  };

  onMount(() => {
    editor = ace.edit(container, {
      mode: "ace/mode/json",
      tabSize: preferences.tab_size,
      useSoftTabs: true,
    });

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      editor.setTheme("ace/theme/twilight");
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) =>
        editor.setTheme(e.matches ? "ace/theme/twilight" : "")
      );

    if (preferences.save_method == "Debounce") {
      const handleInput = debounce(
        () => save(),
        preferences.debounce_time || 2000
      );

      editor.session.on("change", handleInput);
    }

    if (preferences.save_method == "Blur") {
      editor.on("blur", save);
    }

    editor.save = save;
  });

  onDestroy(() => {
    if (editor) editor.destroy();
  });

  $: if (editor)
    editor.setValue(JSON.stringify(value, null, preferences.tab_size));
</script>

<div class="jsoneditor-svelte-container" bind:this={container} />

<style>
  .jsoneditor-svelte-container {
    width: 100%;
    height: 100%;
  }

  @media (prefers-color-scheme: dark) {
    .jsoneditor-svelte-container :global(.jsoneditor-menu) {
      background-color: var(--dark-primary-background-colour, #202124);
      border-bottom: 1px solid #494c50;
    }

    .jsoneditor-svelte-container :global(.ace_button),
    .jsoneditor-svelte-container :global(.ace_searchbtn),
    .jsoneditor-svelte-container :global(.ace_search_field) {
      color: white;
    }

    .jsoneditor-svelte-container :global(.ace_searchbtn),
    .jsoneditor-svelte-container :global(.ace_search_field),
    .jsoneditor-svelte-container :global(.ace_search) {
      background-color: var(--dark-primary-background-colour, #202124);
      border-color: #494c50;
    }
  }
</style>

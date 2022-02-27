<script>
  export let json = [];
  export let value = [];

  import { onDestroy, onMount, createEventDispatcher } from "svelte";

  import diff from "deep-diff";
  import ace from "ace-builds";

  import "brace/mode/json";
  import "brace/worker/json";
  import "brace/theme/twilight";

  import isJSON from "../utils/isJSON";

  let editor;
  let container;

  const dispatch = createEventDispatcher();

  const onBlur = () => {
    let content = editor.getValue();

    if (!isJSON(content)) return;

    let parsed = JSON.parse(content);
    
    let difference = diff(value, parsed);
    if (!difference) return;

    dispatch("blur", [ parsed, difference, value ]);

    value = json = parsed;
  };

  const onChange = () => {};

  onMount(() => {
    editor = ace.edit(container, {
      mode: "ace/mode/json",
    });

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      editor.setTheme("ace/theme/twilight");
    }

    editor.on("blur", onBlur);
    editor.session.on("change", onChange);
  });

  onDestroy(() => {
    if (editor) editor.destroy();
  });

  $: if (editor) editor.setValue(JSON.stringify(value, null, 2));
</script>

<div class="jsoneditor-svelte-container" bind:this={container} />

<style>
  .jsoneditor-svelte-container {
    width: 100%;
    height: 100%;
  }

  @media (prefers-color-scheme: dark) {
    .jsoneditor-svelte-container :global(.jsoneditor-menu) {
      background-color: #202124;
      border-bottom: 1px solid #494c50;
    }
  }
</style>

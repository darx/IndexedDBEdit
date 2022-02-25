<script>
  export let json;
  export let value = [];

  import { onDestroy, onMount, createEventDispatcher } from "svelte";
  import ace from "ace-builds";

  const dispatch = createEventDispatcher();

  let editor;
  let container;
  

  const onBlur = () => dispatch("input", (value = json = editor.getValue()));
  const onChange = (data) => dispatch("input", data);

  import "brace/theme/twilight";

  onMount(
    () => {
      
      // jsoneditor = new JSONEditor(container, {
      //   mode: "code",
      //   onBlur: onBlur,
      //   onChangeJSON: onChange
      // });

      editor = ace.edit(container, {
        mode: "ace/mode/json"
      });
      editor.setTheme("ace/theme/twilight");

      editor.session.on('change', onChange);
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

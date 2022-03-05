<script>
  export let name;
  export let contentType;
  export let content = undefined;
  import ActionsIcons from "../icons/Actions.svelte";

  const onClick = () => {
    const bytes = new TextEncoder().encode(content);
    const blob = new Blob([bytes], {
      type: contentType,
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = name;

    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };
</script>

<button type="button" on:click={onClick}>
  <ActionsIcons size="16" name="download" />
  Download all databases
</button>

<style>
  button {
    padding: 1em;
    display: flex;
    align-items: center;
  }

  button :global(svg) {
    margin-right: 8px;
  }
</style>

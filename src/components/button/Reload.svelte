<script>
  const reloadApplication = () => window.location.reload(true);
</script>

<button type="button" on:click={reloadApplication}>Reload</button>

<style>
  button {
    right: 0;
    bottom: 0;
    z-index: 10;
    position: fixed;
  }
</style>

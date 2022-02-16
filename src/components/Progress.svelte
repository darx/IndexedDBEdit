<script>
  export let value = 0;
  export let hideOnComplete = false;
</script>

<progress class:hide={hideOnComplete} {value} max="100" />

<style>
  progress {
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 8px;
    display: flex;
    line-height: 0;
    overflow: hidden;
    appearance: none;
    vertical-align: 0;
    position: absolute;
    background-color: transparent;
  }

  progress[value="100"].hide {
    opacity: 0;
    transition: opacity 300ms linear;
    transition-delay: 1500ms !important;
  }

  progress::-webkit-progress-bar {
    background-color: transparent;
  }

  progress::-moz-progress-bar {
    background-color: #f5ae43;
    transition: all 1s ease;
  }

  progress::-webkit-progress-value {
    background-color: #f5ae43;
    transition: all 1s ease;
  }
</style>

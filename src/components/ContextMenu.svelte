<script>
  export let items = [];
  export let active = false;

  import style from "../utils/style";
  import clickOutside from "../utils/clickOutside";

  let actionBox;
  let styles = {};
  let mouse = { x: 0, y: 0 };

  const onKeyup = (e) => {
    if (active && e.keyCode === 27) active = false;
  };

  const onContextMenu = () => (active = true);

  const onMousemove = (e) => {
    const { clientX, clientY } = e;
    if (active === true) return;
    mouse = { x: clientX, y: clientY };
  };

  const getBoxPosition = () => {
    let { offsetWidth: boxWidth } = actionBox;
    return {
      top: mouse.y + "px",
      left: (mouse.x > boxWidth ? mouse.x - boxWidth : mouse.x) + "px",
    };
  };

  $: styles = actionBox ? getBoxPosition() : {};
</script>

<svelte:window
  on:keyup={onKeyup}
  on:mouseup={onMousemove}
  on:mousemove={onMousemove}
  on:contextmenu={onContextMenu}
/>

{#if active}
  <div
    use:clickOutside
    class="action_box"
    use:style={styles}
    bind:this={actionBox}
    on:outclick={() => (active = false)}
  >
    <ul class="action_wrap">
      {#each items as item}
        <li class="action_list_item">
          <button
            type="button"
            on:click={item.action}
            on:click={() => (active = false)}
          >
            {item.value}
          </button>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .action_box {
    z-index: 90;
    margin: 10px;
    padding: 6px;
    color: #000;
    position: fixed;
    font-size: 14px;
    min-width: 172px;
    line-height: 1.4;
    user-select: none;
    border-radius: 8px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 3px 0px 8px 0px rgba(0, 0, 0, 0.25);
  }

  .action_box .action_wrap {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .action_list_item button {
    border: 0;
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    text-align: left;
    background-color: #fff;
  }

  .action_list_item button:hover {
    background-color: #e5e9f1;
  }

  .action_list_item:first-child button {
    border-radius: 6px 6px 0 0;
  }

  .action_list_item:last-child button {
    border-radius: 0 0 6px 6px;
  }

  .action_list_item:only-child button {
    border-radius: 6px;
  }

  :global(.action_list_item button svg) {
    width: 16px;
    margin: 0 8px 0 0;
  }
</style>

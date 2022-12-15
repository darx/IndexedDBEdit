<script context="module">
  import { writable } from "svelte/store";

  const _selectedState = writable({});

  const _expansionState = {};
</script>

<script>
  export let tree;
  export let parent = undefined;

  import { createEventDispatcher } from "svelte";
  import Database from "./icons/Database.svelte";

  const { label, children } = tree;
  const dispatch = createEventDispatcher();

  let expanded = _expansionState[label] || false;

  const select = () => {
    dispatch("select", [parent, label]);

    for (let label in $_selectedState) {
      $_selectedState[label] = false;
    }

    $_selectedState[label] = true;
  };
  const toggleExpansion = (x = !expanded) =>
    (expanded = _expansionState[label] = x);

  const onKeydown = (e) => {
    const keyCode = e.which;
    const whitelist = [13, 37, 38, 39, 40];

    if (whitelist.includes(keyCode) === true) e.preventDefault();
    if (whitelist.includes(keyCode) === false) return;

    if (keyCode === 13) {
      if (!tree.children) return select();
      return toggleExpansion();
    }

    if ([37, 39].includes(keyCode)) {

      console.log(parent);
      console.log(e.keyCode)

      return toggleExpansion(keyCode === 39);
    }

    const current = document.activeElement;
    const items = [...document.querySelectorAll("[role=treeitem]")];
    const index = items.indexOf(current);

    const focusIndex =
      index === -1
        ? 0
        : keyCode === 38
        ? (index + items.length - 1) % items.length
        : (index + 1) % items.length;

    current.blur();
    items[focusIndex].focus();
  }

  $: selected = $_selectedState[label] || false;
  $: arrow_down = expanded;
</script>

<ul>
  <li>
    {#if children}
      <div
        title={label}
        role="treeitem"
        aria-label={label}
        class="item parent expanded"
        aria-expanded={expanded}
        tabindex="0"
        on:dblclick={toggleExpansion}
        on:keydown={onKeydown}
      >
        <span
          class="arrow icon"
          class:arrow_down
          aria-hidden="true"
          on:click={toggleExpansion}
        >
          &#x25b6
        </span>

        <Database class="icon" />

        <span class="label">{label}</span>
      </div>
      {#if expanded}
        {#each children as child}
          <svelte:self tree={child} parent={label} on:select />
        {/each}
      {/if}
    {:else}
      <div
        title={label}
        role="treeitem"
        class="item"
        class:selected
        aria-label={label}
        tabindex="0"
        on:click={select}
        on:keydown={onKeydown}
        on:focus={select}
      >
        <span aria-hidden="true" class="no_arrow" />
        <Database class="icon" name="columns" />
        <span class="label">{label}</span>
      </div>
    {/if}
  </li>
</ul>

<style scoped>
  ul {
    margin: 0;
    padding: 0;
    display: flex;
    list-style: none;
    user-select: none;
  }

  li {
    width: 100%;
  }

  ul li > div {
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    display: flex;
    align-items: center;
    min-height: 20px;
  }

  .no_arrow {
    padding-left: 14px;
  }

  .arrow {
    cursor: pointer;
    display: inline-block;
  }

  .item {
    outline: none;
  }

  .item ~ :global(ul) {
    padding-left: 1em !important;
  }

  .item :global(.icon) {
    z-index: 1;
    flex: 0 0 auto;
    margin: 0 4px 0 0;
  }

  .arrow_down {
    transform: rotate(90deg);
  }

  .label {
    z-index: 1;
  }

  .item:focus::before,
  .selected::before {
    content: "";
    position: absolute;
    width: 100vw;
    height: 100%;
    background-color: var(--dark-border-colour, #494c50);
    z-index: 0;
    left: -10em;
  }

  .item:focus::before {
    background-color: #11639d;
  }
</style>

<script context="module">
  const _expansionState = {};
</script>

<script>
  export let tree;
  export let parent = undefined;

  import { createEventDispatcher } from "svelte";

  const { label, children } = tree;
  const dispatch = createEventDispatcher();

  let expanded = _expansionState[label] || false;

  const onSelect = () => dispatch("select", [parent, label]);
  const toggleExpansion = () => (expanded = _expansionState[label] = !expanded);

  $: arrow_down = expanded;
</script>

<ul>
  <li>
    {#if children}
      <div
        title={label}
        role="treeitem"
        aria-label={label}
        class="parent expanded"
        aria-expanded={expanded}
        on:dblclick={toggleExpansion}
      >
        <span
          class="arrow"
          class:arrow_down
          aria-hidden="true"
          on:click={toggleExpansion}
        >
          &#x25b6
        </span>
        {label}
      </div>
      {#if expanded}
        {#each children as child}
          <svelte:self tree={child} parent={label} on:select />
        {/each}
      {/if}
    {:else}
      <div title={label} role="treeitem" aria-label={label} on:click={onSelect}>
        <span aria-hidden="true" class="no_arrow" />
        {label}
      </div>
    {/if}
  </li>
</ul>

<style>
  ul {
    margin: 0;
    display: flex;
    list-style: none;
    user-select: none;
    padding: 0 8px;
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
    padding-left: 1rem;
  }
  .arrow {
    cursor: pointer;
    margin: 0 8px 0 0;
    display: inline-block;
  }
  .arrow_down {
    transform: rotate(90deg);
  }
</style>

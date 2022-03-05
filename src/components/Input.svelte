<script>
  export let id;
  export let name;
  export let type = "text";
  export let value = "";
  export let label = undefined;
  export let options = [];
  export let placeholder = "";


  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const onChange = ({ target }) => dispatch("change", { name, value: target.value });

  $: getType = (() => {
    return type;
  })();

</script>

<div class="input-wrapper">
  {#if label}
    <label for={id} {name}>{label}</label>
  {/if}
  {#if type == "select"}
    <select class="input" bind:value {id} {name} on:change={onChange}>
      {#each options as option}
        <option>{option}</option>
      {/each}
    </select>
  {:else}
    <input class="input" bind:value {placeholder} type="input" {name} />
  {/if}
</div>

<style>
  .input-wrapper {
    align-items: center;
    display: flex;
  }

  .input {
    color: inherit;
    background-color: inherit;
    border: 1px solid #494c50;
    border-radius: 2px;
    margin: 6px auto 6px 6px;
    padding-left: 4px;
    width: calc(100% - 12px);
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
  }

  label:hover {
    color: #9aa0a6;
  }

  .input:focus,
  .input:hover,
  label:hover + .input {
    outline: 0;
    border-color: hsl(214deg 47% 48%);
  }
</style>
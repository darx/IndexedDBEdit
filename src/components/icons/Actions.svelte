<script>
  export let name;
  export let size = 32;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  aria-hidden="true"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  {#if name == "refresh"}
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  {/if}

  {#if name == "filter"}
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  {/if}
</svg>
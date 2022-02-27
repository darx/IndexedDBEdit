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

  {#if name == "settings"}
    <path
      d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
    />
  {/if}

  {#if name == "exit"}
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  {/if}
</svg>
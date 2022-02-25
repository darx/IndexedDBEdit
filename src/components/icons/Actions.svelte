<script>
  export let name;
  export let size = 32;
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
  {#if name == "refresh"}
  <g>
    <path d="M16,0C7.2,0,0,7.2,0,16s7.2,16,16,16s16-7.2,16-16h-5.3c0,5.9-4.8,10.7-10.7,10.7S5.3,21.9,5.3,16S10.1,5.3,16,5.3
      c3.4,0,6.4,1.6,8.3,4.1h6.3C28,3.7,22.3,0,16,0z"/>
    <path style="stroke:#000000;stroke-width:1.068;" d="M30.6,3.3v8.2h-8.2L30.6,3.3z"/>
  </g>
  {/if}
</svg>

<style>
  svg {
    fill: currentColor;
    color: currentColor;
    
  }
</style>
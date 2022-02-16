import { writable } from "svelte/store";

export let selected = writable([]);
export let databases = writable([]);

export let tree = writable({
  label: "IndexedDB",
  children: [],
});

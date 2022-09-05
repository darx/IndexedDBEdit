import { writable } from "svelte/store";

export let selected = writable(null);
export let databases = writable([]);
export let modified = writable({});

export let tree = writable({
  label: "IndexedDB",
  children: [],
});

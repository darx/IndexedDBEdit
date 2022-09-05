import { writable } from "svelte/store";

const settings = writable([
  {
    id: "saveType",
    type: "select",
    name: "save_method",
    label: "Save method",
    options: ["Blur", "Manually"],
    value: "Blur"
  },
  {
    id: "debounceTime",
    type: "text",
    name: "debounce_time",
    label: "Save debounce time (milliseconds)",
    value: 700,
    visible: {
      "save_method": "Debounce"
    }
  },
  {
    id: "sidePosition",
    type: "select",
    name: "side_position",
    label: "Sidebar position",
    options: ["Left", "Right"],
    value: "Left"
  },
  {
    id: "messagePosition",
    type: "select",
    name: "message_position",
    label: "Notification position",
    options: ["Top", "Bottom"],
    value: "Top"
  },
  {
    id: "tabSize",
    type: "select",
    name: "tab_size",
    label: "Tab size",
    options: [2, 4, 6, 8],
    value: 2
  }
]);

const isSettings = localStorage.getItem("__idxe_settings");
if (isSettings) settings.set(JSON.parse(isSettings));

settings.subscribe(value => {
  localStorage.setItem("__idxe_settings", JSON.stringify(value));
});

export const saving = writable(false);
export const loading = (() => {
  const loading = writable(0);
  const { set } = loading;

  let waiting;
  let start = () => setInterval(() => {
    set(loading + 10);

    if (loading < 100) return;

    set(100);
    clearInterval(waiting);
  }, 1000);

  return {
    ...loading,
    start,
    completed: () => set(100)
  };
})();

export default settings;

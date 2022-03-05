<script>
  import { fade, fly } from "svelte/transition";
  import differenceBy from "lodash/differenceBy";

  import { databases, selected, tree } from "./store";

  import tips from "./stubs/tips";
  import settings from "./stubs/settings";

  import resizable from "./utils/resizable";
  import storageController from "./utils/storageController";

  import Notification from "./components/Notification.svelte";
  import Toolbar from "./components/Toolbar.svelte";
  import TreeView from "./components/TreeView.svelte";
  import Progress from "./components/Progress.svelte";
  import JSONEditor from "./components/JSONEditor.svelte";
  import BracketsIcon from "./components/icons/Brackets.svelte";

  let editor;
  let options;
  let loading = 0;
  let saving = false;

  let waiting = setInterval(() => {
    loading = loading + 10;
    if (loading >= 100) {
      loading = 100;
      clearInterval(waiting);
    }
  }, 1000);

  const StorageController = new storageController();

  const init = () => {
    databases.set([]);

    StorageController.test((d) => {
      loading = 100;

      const structure = d.reduce((acc, x) => {
        if (x.length) {
          let { name, objectStoreNames, version } = x[0].database;
          acc.push({
            databaseName: name,
            databaseVersion: version,
            objectStoreNames,
            stores: objectStoreNames.map((y, index) => {
              return { name: y, data: x[index].data };
            }),
          });
        }
        return acc;
      }, []);

      const test = {
        label: "IndexedDB",
        children: d.reduce((acc, x) => {
          if (x.length) {
            let { name, objectStoreNames, version } = x[0].database;
            acc.push({
              label: name,
              version: version,
              children: objectStoreNames.map((y, index) => {
                return { label: y };
              }),
              stores: objectStoreNames.map((y, index) => {
                return { name: y, data: x[index].data };
              }),
            });
          }
          return acc;
        }, []),
      };

      tree.set(test);
      databases.set(structure);
    });
  };

  init();

  const onSave = ({ detail }) => {
    let { [0]: updated, [2]: original } = detail;

    const isSameRecord = (x, y) => x.key == y.key && x.vaule == y.vaule;

    const inLeft = (l, r, compare) =>
      l.filter((lv) => !r.some((rv) => compare(lv, rv)));

    const inX = inLeft(updated, original, isSameRecord);
    const inY = inLeft(original, updated, isSameRecord);

    const deleted = [...inX, ...inY].map((x) => x.key);

    saving = true;

    deleted.forEach((x) =>
      StorageController.deleteRecord({
        version: options.source.transaction.db.version,
        database: options.database,
        storeName: options.source.name,
        storeNameKey: typeof x === "number" ? x : `"${x}"`,
      })
    );

    let diff = differenceBy(updated, original, "value");
    diff.forEach((x) => {
      if (x && x.key) {
        StorageController.updateValue({
          version: options.source.transaction.db.version,
          database: options.database,
          storeName: options.source.name,
          storeNameKey: typeof x.key === "number" ? x.key : `"${x.key}"`,
          storeNameKeyValue: JSON.stringify(x.value),
        });
      }
    });
  };

  const storeLookup = (database, store) => {
    const items = $databases
      .find((x) => x.databaseName == database)
      .stores.find((x) => x.name == store).data;

    const selected = { database };

    const values = items.map((x) => {
      if (!selected.source) selected.source = x.source;
      return { key: x.key, value: x.value };
    });

    return [values, selected];
  };

  const onTreeClick = ({ detail }) => {
    const items = storeLookup.apply(null, detail);

    options = items[1];
    selected.set(items[0]);
  };

  const actionSaveEditor = () => {
    if (!editor?.save) return;
    editor.save();
  };

  $: placeholder = (() => {
    if (loading < 100) {
      return "Content not Loaded";
    } else if (content === false) {
      return "No content";
    } else {
      return "Select object store";
    }
  })();

  $: content = $databases.length > 0;
  $: resizeDirection = preferences.side_position == "Right" ? "left" : "right";
  $: preferences = $settings.reduce(
    (acc, curr) => ((acc[curr.name] = curr.value), acc),
    {}
  );
</script>

<main class:panel_right={preferences.side_position == "Right"}>
  {#if content}
    <div
      class="panel"
      use:resizable={resizeDirection}
      in:fly={{ x: preferences.side_position == "Right" ? 200 : -200 }}
    >
      <div class="wrapper">
        <Toolbar on:manualSave={() => actionSaveEditor()} />
        <TreeView bind:tree={$tree} on:select={onTreeClick} />
      </div>
    </div>
  {/if}

  <div class="content">
    <Notification
      {...$tips.save_method}
      position={preferences.message_position}
      bind:active={$tips.save_method.active}
    />
    <Progress value={loading} hideOnComplete={true} />

    {#if !$selected}
      <div class="no_table">
        <BracketsIcon />
        <div>
          {#key placeholder}
            <strong in:fade|local>
              {placeholder}
            </strong>
          {/key}
        </div>
      </div>
    {:else}
      <Notification
        bind:active={saving}
        text="Saving changes ..."
        timeout={2000}
      />
      <JSONEditor on:save={onSave} bind:editor bind:value={$selected} />
    {/if}
  </div>
</main>

<style>
  :global(body) {
    color: #333;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  }

  :global(button) {
    border: 0;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    background-color: transparent;
  }

  main {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: row;
  }

  main .content {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    flex-direction: column;
  }

  main .panel {
    min-width: 250px;
    position: relative;
    white-space: nowrap;
    padding: 1em 1em 1em 0;
    box-sizing: border-box;
    background-color: var(--light-secondery-background-colour, #ebebeb);
    border-right: 1px solid var(--light-border-colour, #d3d3d3);
    overflow: hidden;
    flex: 1 0 auto;
  }

  main.panel_right {
    flex-direction: row-reverse;
  }

  main.panel_right .panel {
    border-right: 0;
    border-left: 1px solid var(--light-border-colour, #d3d3d3);
  }

  .panel .wrapper {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    position: absolute;
  }

  :global(.panel .wrapper > ul) {
    padding: 0;
  }

  .no_table {
    color: #919191;
    margin: auto;
    text-align: center;
    font-weight: 100;
    font-size: 1.24em;
    user-select: none;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  @media (prefers-color-scheme: dark) {
    :global(body) {
      background-color: var(--dark-primary-background-colour, #202124);
    }
    main .panel {
      color: #fff;
      background-color: var(--dark-secondery-background-colour, #292a2d);
      border-right: 1px solid var(--dark-border-colour, #494c50);
    }
    main.panel_right .panel {
      border-right: 0;
      border-left: 1px solid var(--dark-border-colour, #d3d3d3);
    }
    main .content {
      color: #fff;
      background-color: var(--dark-primary-background-colour, #202124);
    }
    :global(.grabber:hover) {
      border-color: var(--dark-border-colour, #494c50);
    }
  }
</style>

<script>
  import { fade, fly } from "svelte/transition";

  import { databases, selected, tree } from "./store";

  import resizable from "./utils/resizable";
  import storageController from "./utils/storageController";

  import TreeView from "./components/TreeView.svelte";
  import Progress from "./components/Progress.svelte";
  import JSONEditor from "./components/JSONEditor.svelte";
  import ContextMenu from "./components/ContextMenu.svelte";
  import BracketsIcon from "./components/icons/Brackets.svelte";
  
  const StorageController = new storageController();

  let json;
  let loading = 0;

  let waiting = setInterval(() => {
    loading = loading + 10;
    if (loading >= 100) {
      loading = 100;
      clearInterval(waiting);
    }
  }, 1000);

  function init() {
    databases.set([]);

    // StorageController.fetchNames((data) => {
    // 	// console.log(data);
    // 	data.forEach((params) => {
    // 		// console.log(params);
    // 		StorageController.fetchTable(params, (data) => {
    // 			// console.log(data);
    // 			databases.set(
    // 				$databases.concat([
    // 					{
    // 						name: params.name,
    // 						files: data,
    // 					},
    // 				])
    // 			);
    // 		});
    // 	});
    // });

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
  }

  init();

  const onBlur = () => {
    // console.log(JSON.parse(selected));
    // StorageController.updateValue({
    // 	database: "localforage",
    // 	version: 2,
    // 	storeName: "keyvaluepairs",
    // 	storeNameKey: "token",
    // 	storeNameKeyValue: Math.random(),
    // });
    // init();
  };

  const storeLookup = (database, store) => {
    let items = $databases
      .find((x) => x.databaseName == database)
      .stores.find((x) => x.name == store).data;

    return items.map((x) => {
      return { key: x.key, value: x.value };
    });
  };

  $: json = !$selected ? null : $selected;
  $: content = $databases.length > 0;

  const onTreeClick = ({ detail }) =>
    selected.set(storeLookup.apply(null, detail));

  $: placeholder = (() => {
    if (loading < 100) {
      return "Content not Loaded";
    } else if (content === false) {
      return "No content";
    } else {
      return "Select object store";
    }
  })();
</script>

<main>
  <ContextMenu
    items={[
      {
        value: "Reload",
        action() {
          location.reload(true);
        },
      },
    ]}
  />

  {#if content}
    <div class="panel" use:resizable={"right"} in:fly={{ x: -200 }}>
      <div class="wrapper">
        <TreeView bind:tree={$tree} on:select={onTreeClick} />
      </div>
    </div>
  {/if}

  <div class="content">
    <Progress value={loading} hideOnComplete={true} />

    {#if !json || !json.length}
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
      <JSONEditor on:blur={onBlur} bind:value={json} />
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
    background-color: #ebebeb;
    border-right: 1px solid #d3d3d3;
    overflow: hidden;
    flex: 1 0 auto;
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

  :global(.grabber) {
    position: absolute;
    box-sizing: border-box;
  }

  :global(.grabber:hover) {
    border-color: #d3d3d3;
    border-style: solid;
    border-width: 5px;
  }

  :global(.grabber.right) {
    width: 10px;
    height: 100%;
    right: -5px;
    top: 0;
    cursor: col-resize;
  }

  :global(.grabber.left) {
    width: 10px;
    height: 100%;
    left: -5px;
    top: 0;
    cursor: col-resize;
  }

  :global(.grabber.top) {
    height: 10px;
    width: 100%;
    top: -5px;
    cursor: row-resize;
  }

  :global(.grabber.bottom) {
    height: 10px;
    width: 100%;
    bottom: -5px;
    cursor: row-resize;
  }

  :global(.grabber.top-left) {
    height: 20px;
    width: 20px;
    top: -10px;
    left: -10px;
    cursor: nw-resize;
    border-radius: 100%;
  }

  :global(.grabber.top-right) {
    height: 20px;
    width: 20px;
    top: -10px;
    right: -10px;
    cursor: ne-resize;
    border-radius: 100%;
  }

  :global(.grabber.bottom-left) {
    height: 20px;
    width: 20px;
    bottom: -10px;
    left: -10px;
    cursor: sw-resize;
    border-radius: 100%;
  }

  :global(.grabber.bottom-right) {
    height: 20px;
    width: 20px;
    bottom: -10px;
    right: -10px;
    cursor: se-resize;
    border-radius: 100%;
  }
</style>
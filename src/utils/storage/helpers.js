import { writable, get } from "svelte/store";
import differenceBy from "lodash/differenceBy";

import { saving } from "../../stubs/settings";
import { databases, modified } from "../../store";

export const storage = writable({});

export const lookup = (database, store) => {
  const items = get(databases)
    .find((x) => x.databaseName == database)
    .stores.find((x) => x.name == store).data;

  const selected = { database };

  const values = items.map((x) => {
    if (!selected.source) selected.source = x.source;
    return { key: x.key, value: x.value };
  });

  return [values, selected];
};

export const onSave = ({ detail }) => {
  let { [0]: updated, [2]: original } = detail;

  const isSameRecord = (x, y) => x.key == y.key && x.vaule == y.vaule;

  const inLeft = (l, r, compare) =>
    l.filter((lv) => !r.some((rv) => compare(lv, rv)));

  const inX = inLeft(updated, original, isSameRecord);
  const inY = inLeft(original, updated, isSameRecord);

  const deleted = [...inX, ...inY].map((x) => x.key);
  const options = get(modified);

  saving.set(true);

  const table = get(storage);

  deleted.forEach((x) =>
    table.deleteRecord({
      version: options.source.transaction.db.version,
      database: options.database,
      storeName: options.source.name,
      storeNameKey: typeof x === "number" ? x : `"${x}"`,
    })
  );

  let diff = differenceBy(updated, original, "value");
  diff.forEach((x) => {
    if (!(x || {}).hasOwnProperty("key")) return;

    table.updateRecord({
      version: options.source.transaction.db.version,
      database: options.database,
      storeName: options.source.name,
      storeNameKey: typeof x.key === "number" ? x.key : `"${x.key}"`,
      storeNameKeyValue: JSON.stringify(x.value),
    });
  });
};

export const structure = {
  database(data) {
    return data.reduce((arr, x) => {
      if (!x.length) return arr;

      let [{ database }] = x;

      let {
        name: databaseName,
        objectStoreNames,
        version: databaseVersion,
      } = database;

      let stores = objectStoreNames.map((y, index) => {
        return { name: y, data: x[index].data };
      });

      arr.push({ databaseName, databaseVersion, objectStoreNames, stores });

      return arr;
    }, []);
  },
  tree(data) {
    return data.reduce((acc, x) => {
      if (!x.length) return acc;

      let [{ database }] = x;

      let { name: label, objectStoreNames, version } = database;

      let children = objectStoreNames.map((y, index) => {
        return { label: y };
      });

      let stores = objectStoreNames.map((y, index) => {
        return { name: y, data: x[index].data };
      });

      acc.push({ label, version, children, stores });

      return acc;
    }, []);
  },
};

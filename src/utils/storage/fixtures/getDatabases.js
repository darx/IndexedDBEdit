(async function () {
  const copy = (mainObject) => {
    let objectCopy = {};
    let key;
    for (key in mainObject) {
      if (typeof mainObject[key] === "function" || key == "request") continue;
      objectCopy[key] =
        typeof mainObject[key] === "object"
          ? copy(mainObject[key])
          : mainObject[key];
    }
    return objectCopy;
  };

  const getTableContent = (db, dbName) => {
    return new Promise((resolve, reject) => {
      if (db == null) return reject();

      let data = {
        database: {
          name: db.name,
          version: db.version,
          objectStoreNames: [...db.objectStoreNames],
        },
        data: [],
      };

      db = event.target.result;

      const transaction = db
        .transaction([dbName])
        .objectStore(dbName)
        .openCursor();

      transaction.onsuccess = (e) => {
        const cursor = e.target.result;

        if (!cursor) return resolve(data);

        data.data.push({
          key: cursor.key,
          value: cursor.value,
          source: copy(cursor.source),
        });
        cursor.continue();
      };

      transaction.onerror = (err) => {
        reject("error in " + dbName + ": " + err);
      };
    });
  };

  const getDatabase = (dbName) => {
    const request = indexedDB.open(dbName);

    let db;
    return new Promise((resolve) => {
      request.onsuccess = (e) => {
        db = e.target.result;
        const tableNames = [...db.objectStoreNames];

        ((tableNames, db) => {
          const tableContents = tableNames.reduce((acc, tableName) => {
            acc.push(getTableContent(db, tableName));
            return acc;
          }, []);

          Promise.all(tableContents).then((content) => resolve(content));
        })(tableNames, db);
      };
    });
  };

  let names = await indexedDB.databases();
  let items = names.map((x) => getDatabase(x.name));
  let promiseAll = Promise.all(items);
  let data = await promiseAll;

  return (window.__INDEXED_DB_EDIT__.data = data);
})();

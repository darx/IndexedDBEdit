import resizable from "./resizable";

console.log((resizable.toString()));

export default class storageController {
  constructor() {
    if (!chrome.devtools) {
      chrome.devtools = {
        inspectedWindow: {
          eval: function () {},
        },
      };
    }

    chrome.devtools.inspectedWindow.eval("window.__MODIFY_STORAGE__={};");
  }

  fetchAll(fn) {
    chrome.devtools.inspectedWindow.eval(
      "(function() {return JSON.stringify(localStorage, null, 2);})();",
      (o, r) => {
        if ("function" === typeof fn) {
          fn(o);
        }
      }
    );
  }

  fetchNames(fn) {
    chrome.devtools.inspectedWindow.eval(
      "(async function() {return window.__MODIFY_STORAGE__.tables = await indexedDB.databases();})();",
      (o, r) => {
        let data;
        (data = () => {
          this.retrive("tables", (res) => {
            if (!res) {
              return setTimeout(data, 100);
            }
            if ("function" === typeof fn) {
              fn(res);
            }
          });
        })();
      }
    );
  }

  retrive(key, fn) {
    let type = `(function() {return window.__MODIFY_STORAGE__["${key}"];})();`;
    chrome.devtools.inspectedWindow.eval(type, (o, r) => {
      if ("function" === typeof fn) {
        fn(o);
      }
    });
  }

  fetchTable(opts, fn) {
    let script = `
      (async function() {

        window.__MODIFY_STORAGE__.data = [];

        var db;
        var openRequest = indexedDB.open('${opts.name}', ${opts.version});

        openRequest.onsuccess = e => {
          db = e.target.result;

          var data = {};
          var promises = [];

          for (var i = 0; i < db.objectStoreNames.length; i++) {
            promises.push(
              new Promise((resolve, reject) => {
                let objectstore = db.objectStoreNames[i];
                var transaction = db.transaction([objectstore], "readonly");
                var content = [];

                transaction.oncomplete = event => {
                  resolve({ name: objectstore, data:content });
                };

                transaction.onerror = event => {
                  console.dir(event);
                };

                let handleResult = event => {
                  let cursor = event.target.result;
                  if (cursor) {
                    content.push({
                      key: cursor.key,
                      value: cursor.value
                    });
                    cursor.continue();
                  }
                };

                let objectStore = transaction.objectStore(objectstore);
                objectStore.openCursor().onsuccess = handleResult;
              })
            );
          }

          Promise.all(promises).then(result =>{
            window.__MODIFY_STORAGE__.data.push(result);
          });

          db.onerror = (event) => {
            console.dir(event.target);
          };
        }
      })();`;

    chrome.devtools.inspectedWindow.eval(script, (o, r) => {
      let data;
      (data = () => {
        this.retrive("data", (res) => {
          if (!res) {
            return setTimeout(data, 100);
          }
          if ("function" === typeof fn) {
            fn(res);
          }
        });
      })();
    });
  }

  updateTableValues() {}

  updateValue(opts, fn) {
    let script = `
      (async () => {
        var connection = indexedDB.open("${opts.database}", ${opts.version});

        connection.onsuccess = (e) => {
          var db = e.target.result;
          var transaction = db.transaction(["${opts.storeName}"], 'readwrite');
          var objectStore = transaction.objectStore("${opts.storeName}");

          request = objectStore.get("${opts.storeNameKey}");

          request.onsuccess = (event) => {
            objectStore.put("${opts.storeNameKeyValue}", "${opts.storeNameKey}")
          };
        };
      })();`;

    chrome.devtools.inspectedWindow.eval(script, (o, r) => {
      let data;
      (data = () => {
        this.retrive("tables", (res) => {
          if (!res) {
            return setTimeout(data, 100);
          }
          if ("function" === typeof fn) {
            fn(res);
          }
        });
      })();
    });
  }

  modify(key, value) {}

  /*
   * Taken from https://github.com/treojs/idb-batch
   **/
  batch(db, storeName, ops) {}

  test(fn) {
    let script = `
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
    
            data.data.push(copy(cursor));
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
    
      return (window.__MODIFY_STORAGE__.data = data);
    })();
`;
    chrome.devtools.inspectedWindow.eval(script, (o, r) => {
      let data;
      (data = () => {
        this.retrive("data", (res) => {
          if (!res) {
            return setTimeout(data, 5000);
          }
          if ("function" === typeof fn) {
            fn(res);
          }
        });
      })();
    });
  }
}

function updateItem(db, dbName) {
  const transaction = db.transaction([dbName], "readwrite");
  const objectStore = transaction.objectStore(dbName);

  objectStore.openCursor().onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      if (cursor.key === Infinity) {
        const updateData = cursor.value;
        const request = cursor.update(updateData);

        request.onsuccess = () => {};
      }

      cursor.continue();
    }
  };
}

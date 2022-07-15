(async () => {
  let connection = indexedDB.open("${database}", ${version});

  connection.onsuccess = (e) => {
    let db = e.target.result;
    let transaction = db.transaction(["${storeName}"], "readwrite");
    let objectStore = transaction.objectStore("${storeName}");
    
    objectStore.delete(${storeNameKey});
  };
})();
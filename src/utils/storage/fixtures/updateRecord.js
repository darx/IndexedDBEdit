(async () => {
  var connection = indexedDB.open("${database}", ${version});

  connection.onsuccess = (e) => {
    var db = e.target.result;
    var transaction = db.transaction(["${storeName}"], "readwrite");
    var objectStore = transaction.objectStore("${storeName}");

    request = objectStore.get(${storeNameKey});

    request.onsuccess = () => {
      try {
        objectStore.put(${storeNameKeyValue}, ${storeNameKey});
      } catch (e) {
        if (e && e.message.indexOf("in-line keys") !== -1) {
          objectStore.put(${storeNameKeyValue});
        }
      }
    };
  };
})();
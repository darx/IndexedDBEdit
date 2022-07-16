(async () => {
  var connection = indexedDB.open("${database}", ${version});

  connection.onsuccess = (e) => {
    var db = e.target.result;
    var transaction = db.transaction(["${storeName}"], "readwrite");
    var objectStore = transaction.objectStore("${storeName}");

    request = objectStore.get(${storeNameKey});

    request.onsuccess = () => {
      objectStore.put(${storeNameKeyValue}, ${storeNameKey})
    };
  };
})();
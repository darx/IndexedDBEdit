(async function () {
  return (window.__INDEXED_DB_EDIT__.tables = await indexedDB.databases());
})();

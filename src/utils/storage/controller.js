import init from "./fixtures/init";
import getDatabases from "./fixtures/getDatabases";
import getFromCache from "./fixtures/getFromCache";
import updateRecord from "./fixtures/updateRecord";
import deleteRecord from "./fixtures/deleteRecord";
import getDatabasesNames from "./fixtures/getDatabasesNames";

function interpolate(t, c) {
  return t.replace(
    /\${([^}]+)}/g,
    (m, p) => p.split(".").reduce((a, f) => (a ? a[f] : undefined), c) ?? ""
  );
}

export default class storageController {
  constructor() {
    if (!chrome.devtools) {
      chrome.devtools = {
        inspectedWindow: {
          eval: function () {},
        },
      };
    }

    this.inject = chrome.devtools.inspectedWindow.eval;

    this.inject(init);
  }

  check(fn, key = "data", wait = 100) {
    let data;
    (data = () => {
      this.fetch(key, (res) => {
        if (!res) {
          return setTimeout(data, wait);
        }
        fn(res);
      });
    })();
  }

  fetchTableNames() {
    return new Promise((resolve) => {
      this.inject(getDatabasesNames, () => this.check(resolve, "tables"));
    });
  }

  fetch(key, fn) {
    this.inject(interpolate(getFromCache, { key }), (o) => fn(o));
  }

  deleteRecord(opts) {
    return new Promise((resolve) => {
      this.inject(interpolate(deleteRecord, opts), () => this.check(resolve));
    });
  }

  updateRecord(opts) {
    return new Promise((resolve) => {
      this.inject(interpolate(updateRecord, opts), () => this.check(resolve));
    });
  }

  getDatabases() {
    return new Promise((resolve) => {
      this.inject(getDatabases, this.check(resolve, "data", 500));
    });
  }
}

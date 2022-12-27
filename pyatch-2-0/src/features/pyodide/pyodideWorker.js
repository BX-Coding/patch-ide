class PyodideWorker {
  
  static curId = 0;

  constructor() {
    console.log("PyodideWorker constructor ran");

    this.worker = new Worker(new URL('./pyodideWebWorker.js', import.meta.url));

    this.callbacks = {};

    this.id = (PyodideWorker.curId + 1) % Number.MAX_SAFE_INTEGER;
    PyodideWorker.curId++;


    this.worker.onmessage = (event) => {
      //console.log(event);
      const { id, ...data } = event.data;
      const onSuccess = this.callbacks[id];
      delete this.callbacks[id];
      onSuccess(data);
    };
  }

  asyncRun (script, context) {
    return new Promise((onSuccess) => {
      this.callbacks[this.id] = onSuccess;
      this.worker.postMessage({
        ...context,
        python: script,
        cmd: 'run',
        id: this.id,
      });
    });
  }

  halt() {
    this.worker.terminate();
  }
}

const pyodideWorker = new PyodideWorker();

export { pyodideWorker };
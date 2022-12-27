/* eslint-disable */
import {PyodideStates, PYODIDE_INDEX_URL} from './pyodideConstants'
import { Bridge } from '../../scripts/ScratchBridge';
import { useSelector, useDispatch } from 'react-redux';
import { pyodideUpdateStatus } from './pyodideSlice';

importScripts(PYODIDE_INDEX_URL + "pyodide.js");

const context = {
  bridge: Bridge,
}

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide();
  // await self.pyodide.loadPackage(["numpy", "pytz"]);
}
let pyodideReadyPromise = loadPyodideAndPackages();

self.onmessage = async (event) => {
  await pyodideReadyPromise;
  if (event.data.cmd === 'run') {
    const { id, python } = event.data;
    for (const key of Object.keys(context)) {
      self[key] = context[key];
    }
    try {
      await self.pyodide.loadPackagesFromImports(python);
      let results = await self.pyodide.runPythonAsync(python);
      self.postMessage({ results, id });
    } catch (error) {
      self.postMessage({ error: error.message, id });
    }
  }
};
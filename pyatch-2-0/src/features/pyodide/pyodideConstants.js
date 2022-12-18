export const PyodideStates = {
    //initial state
    PRE_LOAD: 'PRE_LOAD',
    LOADING: 'LOADING',
    RUNNING: 'RUNNING',
    READY: 'READY',
}

export const pyodideMessageDict = {
    [PyodideStates.PRE_LOAD]: 'Pyodide is waiting to loading...',
    [PyodideStates.LOADING]: 'Pyodide is loading...',
    [PyodideStates.RUNNING]: 'Pyodide is running...',
    [PyodideStates.READY]: 'Pyodide is ready',
}

export const PYODIDE_INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/';
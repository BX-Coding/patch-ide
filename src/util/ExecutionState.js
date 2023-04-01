export const PYATCH_LOADING_STATES = {
    //initial state
    PRE_LOAD: 'PRE_LOAD',
    LOADING: 'LOADING',
    RUNNING: 'RUNNING',
    HALTING: 'HALTING',
    READY: 'READY',
}

export const PYATCH_LOADING_MESSAGES = {
    [PyodideStates.PRE_LOAD]: 'Pyodide is waiting to loading...',
    [PyodideStates.LOADING]: 'Pyodide is loading...',
    [PyodideStates.RUNNING]: 'Pyodide is running...',
    [PyodideStates.HALTING]: 'Pyodide is halting...',
    [PyodideStates.READY]: 'Pyodide is ready',
}

export const PYATCH_LOADING_STATES = {
    //initial state
    PRE_LOAD: 'PRE_LOAD',
    LOADING: 'LOADING',
    RUNNING: 'RUNNING',
    HALTING: 'HALTING',
    READY: 'READY',
}

export const PYATCH_LOADING_MESSAGES = {
    [PYATCH_LOADING_STATES.PRE_LOAD]: 'Pyodide is waiting to loading...',
    [PYATCH_LOADING_STATES.LOADING]: 'Pyodide is loading...',
    [PYATCH_LOADING_STATES.RUNNING]: 'Pyodide is running...',
    [PYATCH_LOADING_STATES.HALTING]: 'Pyodide is halting...',
    [PYATCH_LOADING_STATES.READY]: 'Pyodide is ready',
}

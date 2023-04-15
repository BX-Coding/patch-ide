export const PYATCH_EXECUTION_STATES = {
    //initial state
    PRE_LOAD: 'PRE_LOAD',
    LOADING: 'LOADING',
    RUNNING: 'RUNNING',
    HALTING: 'HALTING',
    READY: 'READY',
}

export const PYATCH_LOADING_MESSAGES = {
    [PYATCH_EXECUTION_STATES.PRE_LOAD]: 'Pyodide is waiting to loading...',
    [PYATCH_EXECUTION_STATES.LOADING]: 'Pyodide is loading...',
    [PYATCH_EXECUTION_STATES.RUNNING]: 'Pyodide is running...',
    [PYATCH_EXECUTION_STATES.HALTING]: 'Pyodide is halting...',
    [PYATCH_EXECUTION_STATES.READY]: 'Pyodide is ready',
}

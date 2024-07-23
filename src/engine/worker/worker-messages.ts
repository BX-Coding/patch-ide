const WorkerMessages = {
    ToVM: {
        PyodideLoading: "PyodideLoading",
        PyodideLoaded: "PyodideLoaded",
        PythonLoading: "PythonLoading",
        PythonRunning: "PythonRunning",
        PythonFinished: "PythonFinished",
        PythonError: "PythonRuntimeError",
        PythonCompileTimeError: "PythonCompileTimeError",
        BlockOP: "BlockOP",
        EndOfThread: "EndOfThread",
        PromiseLoaded: "ThreadsRegistered",
        ThreadDone: "ThreadDone",
    },

    FromVM: {
        VMConnected: "VMConnected",
        InitPyodide: "InitPyodide",
        LoadThread: "LoadThread",
        ResultValue: "ResultValue",
        StartThread: "StartThread",
        InterruptThread: "InterruptThread",
        LoadGlobal: "LoadGlobal",
    },
};

export default WorkerMessages;

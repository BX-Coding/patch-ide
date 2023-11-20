import usePatchStore from "../store";

export const useRuntimeDiagnostics = (threadId: string) => {
    const clearDiagnostics = usePatchStore((state) => state.clearDiagnostics);
    const invalidateDiagnostics = usePatchStore((state) => state.invalidateDiagnostics);
    const getThreadDiagnostics = usePatchStore((state) => state.getThreadDiagnostics);

    return {
        getDiagnostics: () => getThreadDiagnostics(threadId),
        clearDiagnostics,
        invalidateDiagnostics,
    };
}

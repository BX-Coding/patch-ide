// utils.ts
import usePatchStore from "../store";

export const appendFunction = (threadId: string, newFunction: string): void => {
  const appendFunctionToThread = usePatchStore.getState().appendFunction;
  appendFunctionToThread(threadId, newFunction);
};

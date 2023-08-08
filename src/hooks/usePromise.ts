import { DependencyList, useEffect, useState } from "react";

type PromiseState<T = any> = {
    loading: boolean,
    error: Error | null,
    data: T | null,
}

export const usePromise = <T>(promise: Promise<T>, deps: DependencyList = []) => {
    const [state, setState] = useState<PromiseState>({
        loading: true,
        error: null,
        data: null
    });
    useEffect(() => {
        promise.then(data => {
            setState({
                loading: false,
                error: null,
                data
            });
        }).catch(error => {
            setState({
                loading: false,
                error,
                data: null
            });
        });
    }, deps);
    return state;
}
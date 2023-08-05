import { useEffect } from "react";

const useMonitorProjectChange = (setProjectChanged: (changed: boolean) => void, monitoredVariables: any[]) => {
    useEffect(() => {
        setProjectChanged(true);
      }, monitoredVariables);
}

export default useMonitorProjectChange;
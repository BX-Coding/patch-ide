import { useEffect } from "react";

const useConfirmClose = (projectChanged: boolean) => {
    //https://dev.to/zachsnoek/creating-custom-react-hooks-useconfirmtabclose-eno
    const confirmationMessage = "You have unsaved changes. Continue?";
    useEffect(() => {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        if (projectChanged) {
          event.returnValue = confirmationMessage;
          return confirmationMessage;
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [projectChanged]);
}

export default useConfirmClose;
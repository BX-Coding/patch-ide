import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { auth, db } from "../lib/firebase";
import { FirestoreError, doc } from "firebase/firestore";
import { User } from "firebase/auth";
import { UserMeta } from "../types/userMeta";

type UseUserReturn = {
    user: User | null;
    userMeta: UserMeta | null;
    loading: boolean;
    error: Error | FirestoreError | null | undefined;
}

export const useUser = (): UseUserReturn => {
    const [user, userLoading, userError] = useAuthState(auth);
    if (!user) {
        return {user: null, userMeta: null, loading: userLoading, error: userError};
    }
    const userReference = doc(db, 'users', user.uid);
    const [data, loading, error] = useDocumentDataOnce(userReference);
    return { user, userMeta: data as UserMeta, loading, error };
}
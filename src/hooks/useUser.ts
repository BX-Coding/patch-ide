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
    const userReference = user ? doc(db, 'users', user.uid) : null;
    const [data, loading, error] = useDocumentDataOnce(userReference);
    
    return { user: user ?? null, userMeta: data as UserMeta, loading, error };
}
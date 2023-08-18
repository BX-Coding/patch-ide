// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { Auth, getAuth, connectAuthEmulator } from 'firebase/auth';
import { FirebaseApp } from "firebase/app";

const initializeFirebaseApp = () => {

    type FirebaseConfig = {
        apiKey: string | undefined,
        authDomain: string | undefined,
        projectId: string | undefined,
        storageBucket: string | undefined,
        messagingSenderId: string | undefined,
        appId: string | undefined,
        measurementId?: string | undefined,
    }

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig: FirebaseConfig = {
        apiKey: process.env.FIREBASE_WEB_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
    };

    if (process.env.ENVIRONMENT === 'production') {
        firebaseConfig["measurementId"] = process.env.FIREBASE_MEASUREMENT_ID;
    }

    return initializeApp(firebaseConfig);
}

type PatchFirebaseServices = {
    auth: Auth,
    analytics?: Analytics,
}

const getFirebaseServices = (app?: FirebaseApp): PatchFirebaseServices => {
    const auth = getAuth(app);
    let analytics = undefined;
    if (process.env.ENVIRONMENT === 'local') {
        connectAuthEmulator(auth, "http://127.0.0.1:9099");
    } else if (process.env.ENVIRONMENT === 'production') {
        analytics = getAnalytics(app);
    }
    return { auth, analytics };
}

const app = initializeFirebaseApp();

if (process.env.ENVIRONMENT === 'local') {
    console.warn('Using local Firebase emulator');
}

const services = getFirebaseServices(app);
export const auth = services.auth;
export const analytics = services.analytics;
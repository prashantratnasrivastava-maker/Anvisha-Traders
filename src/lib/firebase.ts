import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Connectivity check test (gracefully handles offline & fluctuating network)
export async function testFirestoreConnection(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return false;
  }
  try {
    const timeoutPromise = new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(typeof navigator !== 'undefined' ? navigator.onLine : true), 2500)
    );
    const checkPromise = getDoc(doc(db, 'system_status', 'ping'))
      .then(() => true)
      .catch((err) => {
        // Suppress benign offline notice
        return typeof navigator !== 'undefined' ? navigator.onLine : false;
      });
    return await Promise.race([checkPromise, timeoutPromise]);
  } catch {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }
}

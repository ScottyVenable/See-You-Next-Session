// Firebase Context - Real-time data sync for portal
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy,
    getDoc,
    setDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const FirebaseContext = createContext(null);

export function FirebaseProvider({ children }) {
    // Real-time state
    const [discussions, setDiscussions] = useState([]);
    const [settings, setSettings] = useState({});
    const [sharedFiles, setSharedFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Subscribe to discussions collection (real-time)
    useEffect(() => {
        const discussionsQuery = query(
            collection(db, 'discussions'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(
            discussionsQuery,
            (snapshot) => {
                const discussionData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate(),
                }));
                setDiscussions(discussionData);
                setLoading(false);
            },
            (err) => {
                console.error('Discussions subscription error:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // Subscribe to settings document (real-time)
    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, 'config', 'settings'),
            (snapshot) => {
                if (snapshot.exists()) {
                    setSettings(snapshot.data());
                }
            },
            (err) => {
                console.error('Settings subscription error:', err);
            }
        );

        return () => unsubscribe();
    }, []);

    // Subscribe to shared files collection (real-time)
    useEffect(() => {
        const filesQuery = query(
            collection(db, 'sharedFiles'),
            orderBy('uploadedAt', 'desc')
        );

        const unsubscribe = onSnapshot(
            filesQuery,
            (snapshot) => {
                const fileData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    uploadedAt: doc.data().uploadedAt?.toDate(),
                }));
                setSharedFiles(fileData);
            },
            (err) => {
                console.error('Shared files subscription error:', err);
            }
        );

        return () => unsubscribe();
    }, []);

    // === Discussion Functions ===

    const addDiscussion = useCallback(async (title, content, author) => {
        try {
            const docRef = await addDoc(collection(db, 'discussions'), {
                title,
                content,
                author,
                createdAt: serverTimestamp(),
                replies: [],
            });
            return docRef.id;
        } catch (err) {
            console.error('Error adding discussion:', err);
            throw err;
        }
    }, []);

    const addReply = useCallback(async (discussionId, content, author) => {
        try {
            const discussionRef = doc(db, 'discussions', discussionId);
            const discussionSnap = await getDoc(discussionRef);

            if (discussionSnap.exists()) {
                const currentReplies = discussionSnap.data().replies || [];
                await updateDoc(discussionRef, {
                    replies: [
                        ...currentReplies,
                        {
                            id: Date.now().toString(),
                            content,
                            author,
                            createdAt: new Date().toISOString(),
                        },
                    ],
                });
            }
        } catch (err) {
            console.error('Error adding reply:', err);
            throw err;
        }
    }, []);

    const deleteDiscussion = useCallback(async (discussionId) => {
        try {
            await deleteDoc(doc(db, 'discussions', discussionId));
        } catch (err) {
            console.error('Error deleting discussion:', err);
            throw err;
        }
    }, []);

    // === Settings Functions ===

    const updateSettings = useCallback(async (newSettings) => {
        try {
            await setDoc(doc(db, 'config', 'settings'), {
                ...settings,
                ...newSettings,
                updatedAt: serverTimestamp(),
            }, { merge: true });
        } catch (err) {
            console.error('Error updating settings:', err);
            throw err;
        }
    }, [settings]);

    // === Shared Files Functions ===

    const addSharedFile = useCallback(async (fileData) => {
        try {
            const docRef = await addDoc(collection(db, 'sharedFiles'), {
                ...fileData,
                uploadedAt: serverTimestamp(),
            });
            return docRef.id;
        } catch (err) {
            console.error('Error adding shared file:', err);
            throw err;
        }
    }, []);

    const deleteSharedFile = useCallback(async (fileId) => {
        try {
            await deleteDoc(doc(db, 'sharedFiles', fileId));
        } catch (err) {
            console.error('Error deleting shared file:', err);
            throw err;
        }
    }, []);

    const value = {
        // State
        discussions,
        settings,
        sharedFiles,
        loading,
        error,

        // Discussion actions
        addDiscussion,
        addReply,
        deleteDiscussion,

        // Settings actions
        updateSettings,

        // File actions
        addSharedFile,
        deleteSharedFile,
    };

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    );
}

export function useFirebase() {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
}

export default FirebaseContext;

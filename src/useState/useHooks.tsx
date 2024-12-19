import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged, User } from "firebase/auth";
import { ref, push, onValue } from "firebase/database";
import { db } from "../firebase/firebase";

import React from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

export default function useHooks() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [path, setPath] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const googleProvider = new GoogleAuthProvider();
  // const { user } = useSelector((state: RootState) => state.auth);

  const timestamp = Date.now();

  // Buat objek Date berdasarkan timestamp
  const date = new Date(timestamp);

  // Ambil komponen tanggal dan waktu
  const day = String(date.getDate()).padStart(2, "0"); // Hari (2 digit)
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Bulan (2 digit, bulan dimulai dari 0)
  const year = date.getFullYear(); // Tahun (4 digit)

  const hours = String(date.getHours()).padStart(2, "0"); // Jam (2 digit)
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Menit (2 digit)
  const seconds = String(date.getSeconds()).padStart(2, "0"); // Detik (2 digit)

  // Format tanggal dan waktu
  const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

  useEffect(() => {
    // Pantau status autentikasi
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserAuth(user);
        navigate("/dashboard"); // Arahkan ke dashboard jika login
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("result", user);
      console.log("Google Login Successful", user);
    } catch (error) {
      console.error("Google Login Failed", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User successfully logged out.");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to login page
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMessages(setMessages);
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const sendMessage = async (message: any) => {
    const chatDocRef = doc(db, "chats", "chat1");
    const messagesCollection = collection(chatDocRef, "messages");
    await addDoc(messagesCollection, {
      text: message,
      sender: auth?.currentUser?.email,
      timestamp: Date.now(),
    });
  };

  const fetchMessages = (setMessages: any) => {
    const chatDocRef = doc(db, "chats", "chat1");
    const messagesCollection = collection(chatDocRef, "messages");
    const messagesQuery = query(
      messagesCollection,
      orderBy("timestamp", "asc")
    );

    onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id, // ID dokumen
        ...doc.data(), // Data dokumen
      }));
      setMessages(messages);
    });
  };

  return {
    googleProvider,
    navigate,
    location,
    email,
    password,
    confirmPassword,
    error,
    userAuth,
    message,
    messages,
    loading,
    setMessage,
    setEmail,
    setPath,
    setPassword,
    setConfirmPassword,
    setError,
    handleLogin,
    handleRegister,
    handleLogout,
    signInWithGoogle,

    fetchMessages,
    sendMessage,
    handleSend,
  };
}

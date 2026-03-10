import { auth } from "./config"
import { createUserWithEmailAndPassword, 
        sendEmailVerification, 
        signInWithEmailAndPassword,
        signOut }  
        from "firebase/auth"

export const registerUser = async(email, password) => {
    const user = await createUserWithEmailAndPassword(auth, email, password)
     await sendEmailVerification(auth.currentUser)
    return user;
};

export const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
};

export const logoutUser = () => {
    return signOut(auth)
};
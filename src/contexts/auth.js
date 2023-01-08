import { createContext, useState, useEffect, Children } from "react";
import { auth, db} from '../services/firebaseConnection'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


export const AuthContext = createContext({});

function AuthProvider({children}){
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        async function loadUser(){
            const storageUser = localStorage.getItem('@ticketsPRO')
            
            if(storageUser){
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }

            setLoading(false);
        }
        loadUser();

    }, [])

    // login user
    async function signIn(email, password){
        setLoadingAuth(true);
        await signInWithEmailAndPassword(auth, email, password)
        .then( async (value)=>{
            let uid = value.user.uid;
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef)
            let data = {
                uid: uid,
                name: docSnap.data().name,
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl,
            }
            setUser(data)
            storageUser(data)
            setLoadingAuth(false)
            toast.success("Good to see you again!")
            navigate('/dashboard')
        })
        .catch((error) =>{
            console.log(error);
            setLoadingAuth(false)
            toast.error("Please, verify your e-mail and password!")
        })
    }

    // create new user
    async function signUp (email, password, name){
       setLoadingAuth(true)

       await createUserWithEmailAndPassword(auth, email, password)
       .then( async (value)=>{
            let uid = value.user.uid;
            await setDoc(doc(db, 'users', uid), {
                name: name,
                avatarUrl: null,
            })
            .then(()=>{
                let data = {
                    uid: uid,
                    name: name,
                    email: value.user.email,
                    avatarUrl: null,
                }
                setUser(data)
                storageUser(data)
                setLoadingAuth(false)
                toast.success("Welcome to the system!")
                navigate('/dashboard')

            })
            .catch((error) =>{
                console.log(error)
                setLoadingAuth(false)
            })

        })
        .catch((error) =>{
            console.log(error)
            setLoadingAuth(false)
        })

    }

    //logout
    async function logout(){
        await signOut(auth);
        localStorage.removeItem('@ticketsPRO')
        setUser(null)
    }

    function storageUser(data){
        localStorage.setItem('@ticketsPRO', JSON.stringify(data))
    }
    return(
        <AuthContext.Provider 
            value={{
                signed: !!user, // false
                user,
                setUser,
                signIn,
                signUp,
                logout,
                storageUser,
                loadingAuth,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
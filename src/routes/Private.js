import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import { toast } from 'react-toastify';


export default function Private({ children }){

    const { signed, loading } = useContext(AuthContext)

    if(loading){
        return(
            <div></div>
        )
    }

    if(!signed){
        // toast.error('Faça login para acessar a rota')
        return <Navigate to="/" />
        
    }    
    return children;
  
}
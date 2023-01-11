
import './customer.css'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiUser } from 'react-icons/fi'
import { useState } from 'react'
import { db } from '../../services/firebaseConnection'
import { addDoc, collection } from 'firebase/firestore'
import { toast } from 'react-toastify'

export default function Customer(){
    const [name, setName] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [address, setAddress] = useState('')

    async function handleRegister(e){
        e.preventDefault();
       if(name !== '' && cnpj !== '' && address !== ''){
            await addDoc(collection(db, 'customers'), {
                nameCompany: name,
                cnpj: cnpj,
                address: address
            })
            .then(()=>{
                setAddress('')
                setName('')
                setCnpj('')
                toast.success('Customer added with success!')
            })
            .catch((error)=>{
                console.log(error)
                toast.error('Error while adding customer, please, try again!')
            })
            
       }else{
            toast.error('All the fileds are required')
       }
    }
    return(
        <div>
            <Header />
            <div className='content'>
                <Title title="Customers">
                    <FiUser size={25} />
                </Title>
                
                <div className='container' onSubmit={handleRegister}>
                    <form className='formProfile'>
                        <label>Name</label>
                        <input 
                            type='text'
                            placeholder='Company Name'
                            value={name}
                            onChange={ (e)=> setName(e.target.value)}
                        />
                        <label>CNPJ</label>
                        <input 
                            type='text'
                            placeholder='00.000.000/0000-00'
                            value={cnpj}
                            onChange={ (e)=> setCnpj(e.target.value)}
                        />
                        <label>address</label>
                        <input 
                            type='text'
                            placeholder='Address'
                            value={address}
                            onChange={ (e)=> setAddress(e.target.value)}
                        />

                        <button type='submit'>Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
import Header from '../../components/Header'
import Title  from '../../components/Title'
import './new.css'
import { FiPlusCircle, FiEdit } from 'react-icons/fi'
import { useState, useEffect, useContext} from 'react'
import { AuthContext } from '../../contexts/auth'
import { db } from '../../services/firebaseConnection'
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'

const listRef = collection(db, 'customers');

export default function New(){
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [customers, setCustomers] = useState([])
    const [customerSelected, setCustomerSelected] = useState(0)
    const [loadCustomer, setLoadCustomer] = useState(true)
    const [idCustomer, setIdCustomer] = useState(false)

    const [note, setNote] = useState('');
    const [subject, setSubject] = useState('Support');
    const [status, setStatus] = useState('Open');

    useEffect(()=>{
        async function loadCustomers(){
            const querySnapshot = await getDocs(listRef)
            .then((snapshot)=>{
                let list = []
                snapshot.forEach((doc)=>{
                    list.push({
                        id: doc.id,
                        nameCompany: doc.data().nameCompany
                    })
                })
                if(snapshot.docs.size === 0){
                    setCustomers([{id: 1, name:'Default'}])
                    setLoadCustomer(false)
                    return
                }
                setCustomers(list)
                setLoadCustomer(false)
                if(id){
                    loadId(list);
                }
            })

            .catch((error)=>{
                console.log('Erro:', error)
                setLoadCustomer(false)
                setCustomers([{id: 1, name:'Default'}])
            })
        }

        loadCustomers()
    }, [id])

    async function loadId(list) {
        const docRef = doc(db, 'tickets', id);
        await getDoc(docRef)
        .then((snapshot) =>{
            setSubject(snapshot.data().subject)
            setStatus(snapshot.data().status)
            setNote(snapshot.data().note)
            
            let index = list.findIndex( item => item.id === snapshot.data().customerId)
            setCustomerSelected(index)
            setIdCustomer(true)
        })
        .catch((error) =>{
            console.log(error)
            toast.error('Invalid Id')
            navigate('/dashboard')
            setIdCustomer(false)
        })
    }
    function handleOptionChange(e){
        setStatus(e.target.value)
        
    }

    function handleChangeSelect(e){
        setSubject(e.target.value)
        console.log(e.target.value)
    }

    function handleChangeCustomer(e){
        setCustomerSelected(e.target.value);
    }

    async function handleRegister(e){
        e.preventDefault();

        //update ticked
        if(idCustomer){
           const docRef = doc(db, 'tickets', id)
           await updateDoc(docRef, {
                customer: customers[customerSelected].nameCompany,
                customerId: customers[customerSelected].id,
                subject: subject,
                note: note,
                status: status,
                 userId: user.uid
           })
           .then(()=>{
                toast.success("Ticket updated with success!")
                setCustomerSelected(0)
                setNote('');
                navigate('/dashboard')
           })
           .catch(()=> {
                toast.error('Error in update the ticket')
           })
            return;
        }
        await addDoc(collection(db, 'tickets'), {
            created: new Date(),
            customer: customers[customerSelected].nameCompany,
            customerId: customers[customerSelected].id,
            subject: subject,
            note: note,
            status: status,
            userId: user.uid
        })
        .then(()=>{
            toast.success('Ticked submited!')
            setNote('');
            setCustomerSelected(0)
        })
        .catch((error)=>{
            console.log(error)
            toast.error('Error, please try again!')
        })
    }
    return(
        <div>
            <Header />
            <div className='content'>
                <Title title={id ? 'Update Ticket' : 'Add Ticket'}>
                {!id ? <FiPlusCircle size={25} /> : <FiEdit size={25} />} 
                </Title>
                <div className='container'>
                    <form className='formProfile' onSubmit={handleRegister}>

                        <label>Customers</label>
                        {
                            loadCustomer ? (
                                <input type='text' disabled={true} value='Loading...' />
                            ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    {customers.map((item, index)=>{
                                        return(
                                            <option key={index} value={index}>{item.nameCompany}</option>
                                        )
                                    })}
                                </select>
                            )
                        }

                        <label>Subject</label>
                        <select value={subject} onChange={handleChangeSelect}>
                            <option key={1} value="Support">Support</option>
                            <option key={2} value="Technical Visit">Technical Visit</option>
                            <option key={3} value="Financy">Financy</option>
                        </select>
                        
                        <label>Status</label>
                        <div className='status'>
                            <input type='radio' name='radio' checked={status === 'Open'} value='Open' onChange={ handleOptionChange}/><span>Open</span>
                            <input type='radio' name='radio'  checked={status === 'In Progress'} value='In Progress' onChange={ handleOptionChange} /><span>In Progress</span>
                            <input type='radio' name='radio' checked={status === 'Closed'} value='Closed' onChange={ handleOptionChange}/><span>Closed</span>
                        </div>

                        <label>Additional Notes</label>
                        <textarea
                            type='text'
                            placeholder='Describle your issue(optional)'
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <button type='submit' >{id ? 'Update Ticket' : 'Register'}</button>
                    </form>
                </div>
                
            </div>
                
        </div>
    )
}
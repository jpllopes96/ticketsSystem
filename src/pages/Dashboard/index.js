import { useContext, useEffect, useState} from "react"
import { AuthContext } from "../../contexts/auth"
import Header from "../../components/Header"
import './dashboard.css'
import Title from '../../components/Title'
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi"
import { Link } from "react-router-dom"
import { db } from "../../services/firebaseConnection"
import { collection, getDocs, orderBy, limit, startAfter, query } from "firebase/firestore"
import { format } from "date-fns"
const listRef = collection(db, 'tickets')


export default function Dashboard(){

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false)

   useEffect(()=>{
        async function loadCases(){
            const q = query(listRef, orderBy('created', 'desc'), limit(5));
            const querySnapshot = await getDocs(q)
            setTickets([]);
            await updateState(querySnapshot)

            setLoading(false);
        }

        loadCases()

        return () =>{

        }

   }, [])

   async function updateState(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0;
        if (!isCollectionEmpty){
            let list =[]
            querySnapshot.forEach((doc) =>{
                list.push({
                    id: doc.id,
                    subject: doc.data().subject,
                    customer: doc.data().customer,
                    customerId: doc.data().customerId,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    note: doc.data().note
                })
            })

            setTickets(cases => [...cases, ...list])
        }else{
            setIsEmpty(true)
        }
   }
   if(loading){
    return(
        <div>
            <Header />

            <div className="content">
                <Title title='Tickets'>
                    <FiMessageSquare size={25} />
                </Title>

                <div className="container dashboard">
                    <span>Searching tickets....</span>
                </div>
            </div>
        </div>
    )
   }
    return(
        <div>
            <Header/>

            <div className="content">
                <Title title='Tickets'>
                    <FiMessageSquare size={25} />
                </Title>
                <>
                    { tickets.length === 0 ? (
                        <div className="container dashboard">
                            <span>No tickets found....</span>
                            <Link className="new" to='/new'>
                                <FiPlus color="#FFF" size={25} /> New Ticket
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link className="new" to='/new'>
                                <FiPlus color="#FFF" size={25} /> New Ticket
                            </Link>
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Customer</th>
                                        <th scope="col">Subject</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Created at</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { tickets.map((item, index)=>{
                                        return(
                                            <tr key={index}>
                                                <td data-label='Customer'>{item.customer}</td>
                                                <td data-label='Subject'>{item.subject}</td>
                                                <td data-label='Status'>
                                                    <span className="badge" style={{ backgroundColor: '#999' }}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td data-label='Created'>{item.createdFormat}</td>
                                                <td data-label='Actions'>
                                                    <button style={{ backgroundColor: '#3583f6'}} className='action'>
                                                        <FiSearch color="#FFF" size={17}   />
                                                    </button>
                                                    <button style={{ backgroundColor: '#F6a935'}} className='action'>
                                                        <FiEdit2 color="#FFF" size={17}   />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </>
                    )}                    
                </>
            </div>
        </div>
    )
}
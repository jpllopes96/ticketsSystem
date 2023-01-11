import './modal.css'
import { FiX } from 'react-icons/fi'
export default function Modal({content, close}){
    return(
        <div className='modal'>
            <div className='container'>
                <button className='close' onClick={ close }>
                    <FiX size={25} color="#FFF" />Back
                </button>
                <main>
                    <h2>Ticket Details</h2>
                    <div className='row'>
                        <span>
                            Customer: <i>{content.customer}</i>
                        </span>
                    </div>

                    <div className='row'>
                        <span>
                            Subject: <i>{content.subject}</i>
                        </span>
                        <span>
                            Created at: <i>{content.createdFormat}</i>
                        </span>
                    </div>

                    <div className='row'>
                        <span>
                            Status: <i style={{ color: content.status === 'Open' ? '#5cb85c' : content.status === 'Closed' ? '#d21' : '#111' }}>{content.status}</i>
                        </span>
                    </div>
                    {content.note !== '' && (
                        <>
                            <h3>Additional Note: </h3>
                            <p> {content.note} </p>
                         </>
                    )}
                    
                </main>
            </div>
        </div>
    )

}
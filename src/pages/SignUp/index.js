import { useState, useContext } from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'

export default function SignUp(){
        const [name, setName] = useState('')
        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('');

        const {signUp, loadingAuth} = useContext(AuthContext)

       async function handleSubmit(e){
            e.preventDefault();
            if( name !== '' && password !== '' && email !==''){
                await signUp(email, password, name)
            }
            
        }
        return(
            <div className='containerSingup'>
                <div className='login'>
                    <div className='loginArea'>
                        <img src={logo} alt='logo' />
                    </div>
    
                    <form onSubmit={handleSubmit}>
                        <h1>Sign Up</h1>
                        <input 
                            type='text' 
                            placeholder='Your Name' 
                            value={name} 
                            onChange={(text) => setName(text.target.value)} 
                        />
                        <input 
                            type='text' 
                            placeholder='email@email.com' 
                            value={email} 
                            onChange={(text) => setEmail(text.target.value)} 
                        />
    
                        <input 
                            type='password' 
                            placeholder='******' 
                            value={password} 
                            onChange={(text) => setPassword(text.target.value)} 
                        />
    
                        <button type='submit'>
                            { loadingAuth ? 'Creating Account...' : 'Sing Up' }
                        </button>
    
                    </form>
    
                    <Link to='/'>Have an account? Sing In</Link>
    
                </div>
            </div>
    )
}
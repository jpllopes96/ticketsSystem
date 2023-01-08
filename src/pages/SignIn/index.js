import './styles.css'
import { useState, useContext} from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'


export default function SignIn(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const {signIn, loadingAuth} = useContext(AuthContext)

    async function handleSubmit(e){
        e.preventDefault();
        if( email !== '' && password !== '' ){
           await signIn(email, password);
        }
    }
    return(
        <div className='containerSingup'>
            <div className='login'>
                <div className='loginArea'>
                    <img src={logo} alt='logo' />
                </div>

                <form onSubmit={ handleSubmit }>
                    <h1>Sign In</h1>
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
                        { loadingAuth? 'Loading...' :  'Sing In'}
                    </button>

                </form>

                <Link to='/register'>Don't have an account? Sing Up</Link>

            </div>
        </div>
    )
}
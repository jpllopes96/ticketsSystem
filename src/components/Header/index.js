import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import { useContext } from 'react'
import avatarImg from '../../assets/avatar.png'
import { FiHome, FiUser, FiSettings, FiArrowRight } from 'react-icons/fi'
import './header.css'

export default function Header(){
    const { user, logout } = useContext(AuthContext);

    async function handleLogout(){
        await logout()
    }

    return(
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl } alt="Avatar" />
            </div>
            <Link to='/dashboard'>
                <FiHome color="#FFF" size={24} />Tickets
            </Link>

            <Link to='/customers'>
                <FiUser color="#FFF" size={24} />Customers
            </Link>

            <Link to='/profile'>
                <FiSettings color="#FFF" size={24} />Profile
            </Link>

            <Link onClick={handleLogout }>
                <FiArrowRight color="#FFF" size={24} />Logout
            </Link>
        </div>
    )
}
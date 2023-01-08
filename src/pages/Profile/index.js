import Header from "../../components/Header"
import Title from "../../components/Title"
import { FiSettings, FiUpload } from "react-icons/fi"
import avatar from '../../assets/avatar.png'
import { AuthContext } from "../../contexts/auth"
import { useContext, useState } from "react"
import './profile.css'
import {doc, updateDoc} from 'firebase/firestore'
import {db, storage} from '../../services/firebaseConnection'
import { toast } from "react-toastify"
import { ref, uploadBytes, getDownloadURL}  from 'firebase/storage'




export default function Profile(){
    const { user, storageUser, setUser, logout} = useContext(AuthContext)
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [name, setName] = useState(user && user.name)
    const [email, setEmail] = useState(user && user.email)
    const [imageAvatar, setImageAvatar] = useState(null)

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image)
                setAvatarUrl(URL.createObjectURL(image))
            }else{
                alert("The image must to be PNG or JPEG")
                setAvatarUrl(null)
                return
            }
        }
    }

    async function handleUpload(){
        const currentUid = user.uid;

        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)
        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snpashot)=>{
            getDownloadURL(snpashot.ref).then(async (downloadUrl) =>{
                let urlFoto = downloadUrl;

                const docRef = doc(db, 'users', user.uid)
                await updateDoc(docRef, {
                    avatarUrl: urlFoto,
                    name: name
                })
                .then(()=>{
                    let data = {
                        ...user,
                        name: name,
                        avatarUrl: urlFoto,
                    }
                    toast.success("Updated with success!")
                    setUser(data)
                    storageUser(data)
                })

            })
        })
    }

    async function handleSubmit(e){
        e.preventDefault();
        if(imageAvatar === null && name !== ''){
            const docRef = doc(db, 'users', user.uid)
            await updateDoc(docRef, {
                name: name
            })
            .then(()=>{
                let data = {
                    ...user,
                    name: name
                }
                toast.success("Name updated with success!")
                setUser(data)
                storageUser(data)
            })
        }else if(name !== '' && imageAvatar !== null){
            //update name and image
            handleUpload()
        }
    }

    return(
        <div>
            <Header />
            <div className="content">
                <Title title='My Profile'>
                    <FiSettings size={25} />
                </Title>

                <div className="container">
                    <form className="formProfile" onSubmit={handleSubmit}>
                        <label className="labelAvatar">
                            <span>
                                <FiUpload color="#FFF" size={25} />
                            </span>
                            <input type='file' accept='image/*'  onChange={handleFile}/> <br />
                            {avatarUrl ===  null ? (
                                <img src={avatar} alt='profile image' width={250} heigth={250} />
                                ): (
                                    <img src={avatarUrl} alt='profile image' width={250} heigth={250} />
                                )
                            }
                        </label>

                        <label>Name</label>
                        <input type='text'  value={name} onChange={(e) => setName(e.target.value)}/>
                        
                        <label>E-mail</label>
                        <input type='email' value={email} disabled={true} />

                        <button type='submit'>Save</button>

                    </form>

                    
                </div>
                <div className="container">
                    <button className="logoutBtn" onClick={()=> logout()}>Logout</button>
                </div>

            </div>            
            
        </div>
    )
}
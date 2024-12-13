import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { addUser, logout, setOnlineUser, setToken,SocketConnection } from '../../redux/UserRedux';
import Sidebar from '../../Components/Sidebar/Sidebar';
import logo from '../../assets/Logo_swiftTalk.jpg';
import io from 'socket.io-client'

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selector = useSelector((state) => state.user);
    const location = useLocation();
    useEffect(()=>{
const socketConnections = io('http://localhost:8000',{
    auth:{
        token:localStorage.getItem('token')

    }
})
socketConnections.on('onlineUsers',data => {
    dispatch(setOnlineUser(data))
})
dispatch(SocketConnection(socketConnections))
return ()=>{socketConnections.disconnect();}
    },[])

    useEffect(() => {
        const userDataFetch = async () => {
            try {
               
                const response = await axios.get('http://localhost:8000/api/user', {
                    withCredentials: true,
                });
                if (response.data.result.logout) {
                    dispatch(setToken(null));
                     dispatch(logout())
                    localStorage.removeItem('token'); 
                    navigate('/login'); 
                } else {
                    dispatch(addUser(response.data.result));
                   

                }
            } catch (error) {
                console.error('Error fetching user data:', error.response?.data || error.message);

                if (error.response?.status === 401) {
                    dispatch(setToken(null));
                    localStorage.removeItem('token');
                  
                }
            }
        };

        userDataFetch();
    }, []);
   const basepath = location.pathname === '/'
    return (
        <div className={`h-screen grid md:grid-cols-7 max-h-screen bg-zinc-950  `}>
        <section className={`col-span-2 max-lg:col-span-3 max-lg:w-screen h-full ${!basepath&& 'hidden'} lg:block`}>
            <Sidebar />
        </section>
        <section className={`col-span-5 bg-slate-100 h-full overflow-y-auto ${basepath && 'hidden'}`}>
            <Outlet/>
        </section>
        <div className={` flex-col col-span-5 justify-center items-center gap-2 bg-white ${!basepath?'hidden':'lg:flex'}`}>
            <img src={logo} alt='logo' className='h-14 w-56 rounded-md' />
            <p className='text-xl font-semibold shadow-sm '>Connect with your homies</p>
        </div>
    
</div>
    );
};

export default Home;

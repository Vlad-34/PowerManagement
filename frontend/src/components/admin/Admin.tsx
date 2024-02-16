import { useEffect, useState } from 'react';
import * as Reusable from '../../assets/Token'
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import CreateUClient from './clientCRUD/CreateClient';
import UpdateClient from './clientCRUD/UpdateClient';
import DeleteClient from './clientCRUD/DeleteClient';
import '../../assets/Admin_Client.css'
import CreateDevice from './deviceCRUD/CreateDevice';
import UpdateDevice from './deviceCRUD/UpdateDevice';
import DeleteDevice from './deviceCRUD/DeleteDevice';
import Map from './Map';
import WebSocketComponent from '../../assets/WebSocketComponent';

interface MessageConvo {
    from: string;
    content: string;
  }
  
  interface MessageRecord {
    from: string;
    content: MessageConvo[];
  }

const Admin = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const decoded = (token ? jwtDecode(token) : null) as Reusable.Decoded;
    const [from, setFrom] = useState(decoded.sub);
    const [to, setTo] = useState("");
    const [available, setAvailable] = useState<string[]>([]);
    const [messages, setMessages] = useState<MessageRecord[]>([]);
    const [status, setStatus] = useState<"content" | "seen" | "assigned">("assigned");
    const role = decoded.authorities[decoded.authorities.length - 1].authority;

    const handleLogout = async () => {
        try {
            await fetch('/logout', {
                method: 'POST',
                credentials: 'same-origin',
            });
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    useEffect(() => {
        if(!decoded || decoded.authorities[decoded.authorities.length - 1].authority != "ROLE_ADMIN"){
            navigate("/login");
        }
    }, []);
    
    const [tab, setTab] = useState("");

    return (
        <div className='background'>
        <div className="tab">
        <button className="tablinks" onClick={() => {setTab("CREATE_CLIENT")}}>CREATE <br/> CLIENT</button>
        <button className="tablinks" onClick={() => {setTab("UPDATE_CLIENT")}}>UPDATE <br/> CLIENT</button>
        <button className="tablinks" onClick={() => {setTab("DELETE_CLIENT")}}>DELETE <br/> CLIENT</button>
        
        <button className="tablinks" onClick={() => {setTab("CREATE_DEVICE")}}>CREATE <br/> DEVICE</button>
        <button className="tablinks" onClick={() => {setTab("UPDATE_DEVICE")}}>UPDATE <br/> DEVICE</button>
        <button className="tablinks" onClick={() => {setTab("DELETE_DEVICE")}}>DELETE <br/> DEVICE</button>

        <button className="tablinks" onClick={() => {setTab("MAP")}}>MAP</button>
        <button className="tablinks" onClick={() => {setTab("CHAT")}}>CHAT</button>
        <button className="tablinks" onClick={handleLogout}>LOGOUT</button>
        
        </div>
        
            {tab === "CREATE_CLIENT" && <CreateUClient/>}
            {tab === "UPDATE_CLIENT" && <UpdateClient/>}
            {tab === "DELETE_CLIENT" && <DeleteClient/>}
            {tab === "CREATE_DEVICE" && <CreateDevice/>}
            {tab === "UPDATE_DEVICE" && <UpdateDevice/>}
            {tab === "DELETE_DEVICE" && <DeleteDevice/>}
            {tab === "MAP" && <Map/>}
            {tab === "CHAT" && <WebSocketComponent from={from} setFrom={setFrom} role={role} messages={messages} setMessages={setMessages} available={available} setAvailable={setAvailable} status={status} setStatus={setStatus} to={to} setTo={setTo}/>}
            </div>
        
    );
}

export default Admin;
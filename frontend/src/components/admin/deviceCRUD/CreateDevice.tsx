import { useState } from 'react';
import '../../../assets/Admin_Client.css';
import ModalCustom from '../../customComponents/ModalCustom';
import ViewDevice from './ViewDevice';

const baseURL = `http://localhost:8081/api/v1/devices/add`;

const CreateDevice = () => {

    const [address, setAddress] = useState("");
    const [maxHourlyConsumption, setMaxHourlyConsumption] = useState(0);
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [view, setView] = useState(false);
    const token = localStorage.getItem("token");

    const handleCreateDevice = async () => {
        setOpen(true);
        setView(true);
        const data = {
            address: address,
            maxHourlyConsumption: maxHourlyConsumption,
            description: description
        }

        try {
            await fetch(baseURL,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                      },
                    body: JSON.stringify(data),
                }
                );
            setErrorMessage("");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
                console.error(error);
            }
        }
    }

    return (
        <div className='bottom'>
            {errorMessage && open && (
                    <ModalCustom open={open} setOpen={setOpen} errorMessage={errorMessage} />
                )}
            <ViewDevice view={view} setView={setView} style='picture'/>
            <div className='formular'>
            <table>
                <tbody>
                <tr><td><label>address</label></td><td><input onChange={(e) => { setAddress(e.target.value) }} /></td></tr>
                <tr><td><label>max hourly consumption</label></td><td><input onChange={(e) => { setMaxHourlyConsumption(Number(e.target.value)) }} /></td></tr>
                <tr><td><label>description</label></td><td><input onChange={(e) => { setDescription(e.target.value) }} /></td></tr>
                </tbody>
            </table>
            <button onClick={handleCreateDevice}>Create</button>
            </div>
            </div>
            
    );
}

export default CreateDevice;
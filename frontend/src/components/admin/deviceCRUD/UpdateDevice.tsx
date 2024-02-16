import { useState } from 'react';
import '../../../assets/Admin_Client.css';
import ModalCustom from '../../customComponents/ModalCustom';
import ViewDevice from './ViewDevice';

const UpdateDevice = () => {

    const [id, setId] = useState(0);
    const baseURL = `http://localhost:8081/api/v1/devices/edit`;
    const [address, setAddress] = useState("");
    const [maxHourlyConsumption, setMaxHourlyConsumption] = useState(0);
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [view, setView] = useState(false);
    const token = localStorage.getItem("token");

    const handleUpdateDevice = async () => {
        setOpen(true);
        setView(true);
        const data = {
            address: address,
            maxHourlyConsumption: maxHourlyConsumption,
            description: description
        }
        const queryParams = new URLSearchParams();
        queryParams.append('id', id.toString());
        const urlWithParams = `${baseURL}?${queryParams.toString()}`;

        try {
            await fetch(urlWithParams,
                {
                    method: 'PATCH',
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
                <tr><td><label>id</label></td><td><input onChange={(e) => { setId(Number(e.target.value)) }} /></td></tr>
                <tr><td><label>address</label></td><td><input onChange={(e) => { setAddress(e.target.value) }} /></td></tr>
                <tr><td><label>max hourly consumption</label></td><td><input onChange={(e) => { setMaxHourlyConsumption(Number(e.target.value)) }} /></td></tr>
                <tr><td><label>description</label></td><td><input onChange={(e) => { setDescription(e.target.value) }} /></td></tr>
                </tbody>
            </table>
            <button onClick={handleUpdateDevice}>Update</button>
            </div>
            </div>
            
    );
}

export default UpdateDevice;
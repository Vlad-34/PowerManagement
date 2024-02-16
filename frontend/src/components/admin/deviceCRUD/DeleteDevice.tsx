import { useState } from 'react';
import '../../../assets/Admin_Client.css';
import ModalCustom from '../../customComponents/ModalCustom';
import ViewDevice from './ViewDevice';

const DeleteDevice = () => {

    const [id, setId] = useState(0);
    const baseURL = `http://localhost:8081/api/v1/devices/delete`;
    const [errorMessage, setErrorMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [view, setView] = useState(false);
    const token = localStorage.getItem("token");

    const handleDeleteUser = async () => {
        setOpen(true);
        setView(true);

        const queryParams = new URLSearchParams();
        queryParams.append('id', id.toString());
        const urlWithParams = `${baseURL}?${queryParams.toString()}`;

        try {
            await fetch(urlWithParams,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                      }
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
                </tbody>
            </table>
            <button onClick={handleDeleteUser}>Delete</button>
            </div>
            </div>
            
    );
}

export default DeleteDevice;
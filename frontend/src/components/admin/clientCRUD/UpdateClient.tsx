import { useState } from 'react';
import '../../../assets/Admin_Client.css';
import validator from 'validator';
import * as Reusable from '../../../assets/Token'
import ModalCustom from '../../customComponents/ModalCustom';
import ViewUser from './ViewClient';

function validate(data: Reusable.Data) {
    if (data.email && !(validator.isEmail(data.email)))
        throw new Error("The email address is not valid!");
    if (data.password && !(validator.isStrongPassword(data.password)))
        throw new Error("The password is not valid!");
}

const UpdateClient = () => {

    const [id, setId] = useState(0);
    const baseURL = `http://localhost:8080/api/v1/users/edit`;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("CLIENT");
    const [errorMessage, setErrorMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [view, setView] = useState(false);
    const token = localStorage.getItem("token");

    const handleUpdateClient = async () => {
        setOpen(true);
        setView(true);
        const data = {
            name: name,
            email: email,
            password: password,
            role: role
        }
        const queryParams = new URLSearchParams();
        queryParams.append('id', id.toString());
        const urlWithParams = `${baseURL}?${queryParams.toString()}`;

        try {
            validate({ email, password } as Reusable.Data);
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
            <ViewUser view={view} setView={setView} style='picture'/>
            <div className='formular'>
            <table>
                <tbody>
                <tr><td><label>id</label></td><td><input onChange={(e) => { setId(Number(e.target.value)) }} /></td></tr>
                <tr><td><label>name</label></td><td><input onChange={(e) => { setName(e.target.value) }} /></td></tr>
                <tr><td><label>email</label></td><td><input onChange={(e) => { setEmail(e.target.value) }} /></td></tr>
                <tr><td><label>password</label></td><td><input type='password' onChange={(e) => { setPassword(e.target.value) }} /></td></tr>
                <tr><td><label>role</label></td><td><select onChange={(e) => { setRole(e.target.value) }}>
                        <option value={"CLIENT"}>Client</option>
                        <option value={"ADMIN"}>Admin</option>
                    </select></td></tr>
                </tbody>
            </table>
            <button onClick={handleUpdateClient}>Update</button>
            </div>
            </div>
            
    );
}

export default UpdateClient;
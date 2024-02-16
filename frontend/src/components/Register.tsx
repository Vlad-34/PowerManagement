import { useEffect, useState } from 'react';
import validator from 'validator';
import ModalCustom from './customComponents/ModalCustom';
import '../assets/Login_Register.css';
import { Link, useNavigate } from 'react-router-dom';
import * as Reusable from '../assets/Token';
import {jwtDecode} from 'jwt-decode';

const baseURL = `http://localhost:8080/api/v1/auth/register`;

const Register = () => {

    const navigate = useNavigate();

    function route_with_token(token: string){
        const decoded = jwtDecode(token) as Reusable.Decoded;
        if(decoded.authorities[decoded.authorities.length - 1].authority === "ROLE_CLIENT")
            navigate("/client");
        if(decoded.authorities[decoded.authorities.length - 1].authority === "ROLE_ADMIN")
            navigate("/admin");
    
    }

    function validate(data: Reusable.Data) {
        if (!validator.isEmail(data.email)) {
            throw new Error("The email address is not valid!");
        }
        if (!validator.isStrongPassword(data.password)) {
            throw new Error("The password is not valid!");
        }
        if (data.confirm !== data.password) {
            throw new Error("The confirmation is not the same as the password you provided");
        }
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirm, setConfirm] = useState("");
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleRegister = async () => {
        setOpen(true);
        const data = {
            name,
            email,
            password,
            role: "ADMIN",
        };
        
        const fetchConfig: RequestInit = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
        }

        try {
            validate({ email, password, confirm } as Reusable.Data);
            const response = await fetch(baseURL, fetchConfig);
            const responseData = await response.json();
            localStorage.setItem("token", responseData.access_token);
            route_with_token(responseData.access_token);
            setErrorMessage("");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
                console.error(error);
            }
        }
    };

    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("decoded");
    }, []);

    return (
        <div className='back'>
            <div className='form'>
                {errorMessage && open && (
                    <ModalCustom open={open} setOpen={setOpen} errorMessage={errorMessage} />
                )}
                <table>
                    <tbody>
                        <tr>
                            <td><label>name</label></td>
                            <td><input onChange={(e) => { setName(e.target.value) }} /></td>
                        </tr>
                        <tr>
                            <td><label>email</label></td>
                            <td><input onChange={(e) => { setEmail(e.target.value) }} /></td>
                        </tr>
                        <tr>
                            <td><label>password</label></td>
                            <td><input type='password' onChange={(e) => { setPassword(e.target.value) }} /></td>
                        </tr>
                        <tr>
                            <td><label>confirm password</label></td>
                            <td><input type='password' onChange={(e) => { setConfirm(e.target.value) }} /></td>
                        </tr>
                    </tbody>
                </table>
                <button className='button-class' onClick={handleRegister}>register</button>
                <div>You already have an account? <Link to="/login">login</Link></div>
            </div>
            <img src="src/assets/images/register.png" alt="Register" />
        </div>
    );
}

export default Register;

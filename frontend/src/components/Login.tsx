import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import validator from 'validator';
import ModalCustom from './customComponents/ModalCustom';
import '../assets/Login_Register.css';
import * as Reusable from '../assets/Token';
import {jwtDecode} from 'jwt-decode';

interface Data {
    email: string;
    password: string
}

function validate(data: Data) {
    if (!(validator.isEmail(data.email)))
        throw new Error("The email address is not valid!");
    if (!(validator.isStrongPassword(data.password)))
        throw new Error("The password is not valid!");
}

const baseURL = `http://localhost:8080/api/v1/auth/login`;

const Login = () => {

    const navigate = useNavigate();

    function route_with_token(token: string){
        const decoded = jwtDecode(token) as Reusable.Decoded;
        if(decoded.authorities[decoded.authorities.length - 1].authority === "ROLE_CLIENT")
            navigate("/client");
        if(decoded.authorities[decoded.authorities.length - 1].authority === "ROLE_ADMIN")
            navigate("/admin");
    
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [open, setOpen] = useState(false);

    const handleLogin = async () => {
        setOpen(true);
        const data = {
            email: email,
            password: password,
        }

        try {
            validate({ email, password } as Data);
            const response = await fetch(baseURL, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                  },
            });
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
            {errorMessage && open &&
                <ModalCustom
                    open = {open}
                    setOpen = {setOpen}
                    errorMessage = {errorMessage}
                />}
            <table>
                <tbody>
                <tr><td><label>email</label></td><td><input onChange={(e) => { setEmail(e.target.value) }} /></td></tr>
                <tr><td><label>password</label></td><td><input type='password' onChange={(e) => { setPassword(e.target.value) }} /></td></tr>
                </tbody>
            </table>
            <div>
                <button className='button-class' onClick={handleLogin}>login</button>
                <div>You don't have an account? <Link to="/register">register</Link></div>
            </div>
        </div>
        <img src="src\assets\images\login.png"/>
        </div>
    )
}

export default Login;

import Admin from './admin/Admin';
import Client from './Client';
import Login from './Login'
import Register from './Register';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Root = () => {

    return (
        <BrowserRouter>
    <Routes>
      <Route index element={<Login />} />
      <Route index path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="admin" element={<Admin />} />
      <Route path="client" element={<Client />} />
    </Routes>
    </BrowserRouter>
    );
}

export default Root;
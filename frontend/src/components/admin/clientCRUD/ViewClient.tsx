import { useEffect, useState, useCallback } from 'react';
import '../../../assets/Admin_Client.css';
interface Authority {
    authority: string;
}

interface Data {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    enabled: boolean;
    authorities: Authority[];
    username: string;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
}

interface Props {
    view: boolean;
    setView: React.Dispatch<React.SetStateAction<boolean>>;
    style: string;
}

const baseURL = `http://localhost:8080/api/v1/users/get`;

const ViewClient = (prop: Props) => {

    const [data, setData] = useState<Data[]>();
    const token = localStorage.getItem("token");

    const handleViewClient = useCallback(async () => {
        try{
            const response = await fetch(baseURL,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                      }
                }
            );
            const responseData = await response.json();
            setData(responseData);
        } catch(err) {
            console.error(err);
        }
        prop.setView(false);
        
    }, [token, prop.view]);

    useEffect(() => {
        handleViewClient();
    }, [handleViewClient]);

    return (<div className={prop.style}>
{Array.isArray(data) ? (
        <table>
          <thead>
            <tr>
            <th>id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
              {data.map(item => (  
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
              </tr>))}
              </tbody>
              </table>
            ) : (
                <p>Data is not in the expected format.</p>
              )}
    </div>);
}

export default ViewClient;

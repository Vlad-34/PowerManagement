import { useEffect, useState, useCallback } from 'react';
import '../../../assets/Admin_Client.css';

interface Data {
    id: number;
    address: string;
    maxHourlyConsumption: number;
    description: string;
}

interface Props {
    view: boolean;
    setView: React.Dispatch<React.SetStateAction<boolean>>;
    style: string
}

const baseURL = `http://localhost:8081/api/v1/devices/get`;

const ViewDevice = (prop: Props) => {

    const [data, setData] = useState<Data[]>();
    const token = localStorage.getItem("token");

    const handleView = useCallback(async () => {
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
        handleView();
    }, [handleView]);

    return (<div className={prop.style}>
{Array.isArray(data) ? (
        <table>
          <thead>
            <tr>
            <th>id</th>
              <th>Address</th>
              <th>Max hourly consumption</th>
              <th>Description</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
              {data.map(item => (  
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.address}</td>
                <td>{item.maxHourlyConsumption}</td>
                <td>{item.description}</td>
                {/* Add more table cells as needed */}
              </tr>))}
              </tbody>
              </table>
            ) : (
                <p>Data is not in the expected format.</p>
              )}
    </div>);
}

export default ViewDevice;

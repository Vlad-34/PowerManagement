import { useCallback, useState } from "react";
import ViewDevice from "./deviceCRUD/ViewDevice";
import ViewUser from "./clientCRUD/ViewClient";

const Map = () => {
    const [view, setView] = useState(false);
    const [idUser, setIdUser] = useState(0);
    const [idDevice, setIdDevice] = useState(0);
    const baseUrl = 'http://localhost:8081/api/v1/devices/map';
    const token = localStorage.getItem("token");
    const handleViewClient = async () => {
        try{
            const response = await fetch(`http://localhost:8080/api/v1/users/getById?id=${idUser}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                      }
                }
            );
            return await response.json();
        } catch(err) {
            console.error(err);
        }
        
    };

    const handleMap = useCallback(async () => {
        const user = await handleViewClient();
        const data = {
            userId: idUser,
            deviceId: idDevice,
            userMail: user.email,
        }
        await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            body: JSON.stringify(data),
        });
    }, [idUser, idDevice]);

    return (
        <div>
            <div className="labels">
            <div className="users">
        <label>id</label><input onChange={(e) => {setIdUser(Number(e.target.value))}}/>

            </div>
            <div className="devices">
            <label>id</label><input onChange={(e) => {setIdDevice(Number(e.target.value))}}/>
            </div>
            <button onClick={handleMap} className="submit">Submit</button>
            </div>
        <div className="bottom2">
        <ViewUser view={view} setView={setView} style='picture'/>
        <ViewDevice view={view} setView={setView}style='right'/>
        </div>
        </div>
    );
}

export default Map;
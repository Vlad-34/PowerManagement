import { useNavigate } from "react-router-dom";
import * as Reusable from '../assets/Token';
import { useCallback, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

import Chart from "../assets/Chart";
import Calendar from 'react-calendar';
import WebSocketComponent from "../assets/WebSocketComponent";

interface Data {
  id: number;
  address: string;
  maxHourlyConsumption: number;
  description: string;
}

interface SensorData {
  id: number;
  sensorId: number;
  value: number;
  timestamp: number;
  date: string;
}

interface Map {
  id: number;
  userId: number;
  deviceId: number;
}

interface MessageConvo {
  from: string;
  content: string;
}

interface MessageRecord {
  from: string;
  content: MessageConvo[];
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const options: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'short',
  day: '2-digit',
  year: 'numeric'
};

const Client = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = (token ? jwtDecode(token) : null) as Reusable.Decoded;
  const [devices, setDevices] = useState<Data[]>([]);

  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [chartName, setChartName] = useState(0);
  const [value, setValue] = useState<Value>(new Date());

  const [from, setFrom] = useState(decoded.sub);
    const [to, setTo] = useState("");
    const [available, setAvailable] = useState<string[]>([]);
    const [messages, setMessages] = useState<MessageRecord[]>([]);
    const [status, setStatus] = useState<"content" | "seen" | "assigned">("assigned");
    const role = decoded.authorities[decoded.authorities.length - 1].authority;

  const getUserIdByEmail = async () => {
    const baseUrl = 'http://localhost:8080/api/v1/users/getByEmail';
    const urlWithParams = `${baseUrl}?email=${decoded.sub}`;

    const response = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    return response.json();
  }

  const getDevicesIdByUserId = async (userId: number) => {
    const baseUrl = 'http://localhost:8081/api/v1/devices/getDevicesId';
    const queryParams = new URLSearchParams();
    queryParams.append('id', userId.toString());
    const urlWithParams = `${baseUrl}?${queryParams.toString()}`;

    const response = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    return response.json();
  }

  const getDevicesByDevicesId = async (deviceIds: number[]) => {
    const baseUrl = 'http://localhost:8081/api/v1/devices/getById';
    const devices = [];

    for (let i = 0; i < deviceIds.length; i++) {
      const queryParams = new URLSearchParams();
      queryParams.append('id', deviceIds[i].toString());
      const urlWithParams = `${baseUrl}?${queryParams.toString()}`;

      const response = await fetch(urlWithParams, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const responseData = await response.json();
      devices.push(responseData);
    }

    return devices;
  }

  const getSensorDataBySensorId = async (sensorIds: number[], value: Value) => {
    const baseUrl = 'http://localhost:8082/api/v1/sensor/getBySensorId';
    const urlWithParams = `${baseUrl}`;

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(value instanceof Date ? value : new Date());
    const formattedDateWithSpaces = formattedDate.replace(/,/g, '');

    const requestData = {
      sensorIds: sensorIds,
      date: formattedDateWithSpaces,
    };

    const response = await fetch(urlWithParams, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    const responseData = await response.json();

    return responseData;
  }

  const handleGetDevices = useCallback(async () => {
    try {
      const userIdResponse = await getUserIdByEmail();
      const userId = userIdResponse.id;

      const devicesIdResponse = await getDevicesIdByUserId(userId) as Map[];
      const devicesIds = devicesIdResponse.map((item: Map) => item.deviceId);
      const sensorIds = devicesIdResponse.map((item: Map) => item.id);

      const devicesResponse = await getDevicesByDevicesId(devicesIds);
      setSensorData(await getSensorDataBySensorId(sensorIds, value));

      const devices = devicesResponse;

      setDevices(devices);
    } catch (error) {
      console.error(error);
    }
  }, [value, chartName]);

  const handleLogout = async () => {
    try {
      await fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });

      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  useEffect(() => {
    const decoded = (token ? jwtDecode(token) : null) as Reusable.Decoded;
    if (!decoded || decoded.authorities[decoded.authorities.length - 1].authority != "ROLE_CLIENT") {
      navigate("/login");
    } else
      handleGetDevices();
  }, [chartName, value]);

  return (
    <div>
      {Array.isArray(devices) ? (
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>Address</th>
              <th>max hourly consumption</th>
              <th>Description</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {devices.map(item => (
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
      <button onClick={handleLogout}>Logout</button>
      <select onChange={(e) => { setChartName(Number(e.target.value)) }} value={chartName}>
        <option>{0}</option>
        {devices?.map((item) => { return <option>{item.id}</option> })}
      </select>
      <Calendar onChange={setValue} value={value} />
      <Chart
        threshold={devices
          .filter((item: Data) => item.id === chartName)
          .map((item: Data) => item.maxHourlyConsumption)[0]}
        chartName={chartName}
        values={sensorData
          .filter(item => item.sensorId === chartName)
          .slice(-25)
          .map((item: SensorData) => { return item.value })}
        timestamps={sensorData
          .filter(item => item.sensorId === chartName)
          .slice(-25)
          .map((item: SensorData) => { return item.timestamp })} />

<WebSocketComponent from={from} setFrom={setFrom} role={role} messages={messages} setMessages={setMessages} available={available} setAvailable={setAvailable} status={status} setStatus={setStatus} to={to} setTo={setTo}/>
    </div>
  )
}

export default Client;
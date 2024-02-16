package com.example.monitoringmicroservice.repo;

import com.example.monitoringmicroservice.dto.SensorData;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class Request {
    private final RestTemplate restTemplate = new RestTemplate();

    @Data
    @RequiredArgsConstructor
    public static class Device {
        private Integer id;
        private String address;
        private Double maxHourlyConsumption;
        private String description;
    }

    public ResponseEntity<Device> getDevice(Integer id) {
        String apiUrl = "http://devices-microservice:8081/api/v1/devices/getDeviceById";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> requestEntity = new HttpEntity<>(id.toString(), headers);
        return restTemplate.postForEntity(apiUrl, requestEntity, Device.class);
    }

    private JSONObject convertSensorData(SensorData sensorData) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", sensorData.getId());
        jsonObject.put("sensorId", sensorData.getSensorId());
        jsonObject.put("value", sensorData.getValue());
        jsonObject.put("timestamp", sensorData.getTimestamp());
        jsonObject.put("date", sensorData.getDate());
        return jsonObject;
    }

    private JSONObject convertMessageToChat(String message, String userMail) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("message", message);
        jsonObject.put("userMail", userMail);
        return jsonObject;
    }

    private void sendMessageToWebSocket(SensorData sensorData, String userMail) {
        Device device = this.getDevice(sensorData.getSensorId()).getBody();
        assert device != null;
        String apiUrl = "http://monitoring-microservice:8082/api/v1/chat";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if(sensorData.getValue() >= device.getMaxHourlyConsumption()) {
            JSONObject jsonObject = this.convertMessageToChat("The value " + sensorData.getValue() +
                    " registered by the sensor " + sensorData.getSensorId() +
                    " that is a device " + device.getId() +
                    " at the date " + sensorData.getDate() +
                    " and timestamp " + sensorData.getTimestamp() +
                    " is too high!", userMail);
            HttpEntity<String> requestEntity = new HttpEntity<>(jsonObject.toString(), headers);
            restTemplate.postForEntity(apiUrl, requestEntity, String.class);
        }
    }

    public void sendSensorData(SensorData sensorData, String userMail) {
        String apiUrl = "http://monitoring-microservice:8082/api/v1/queue/send";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        this.sendMessageToWebSocket(sensorData, userMail);
        JSONObject jsonObject = this.convertSensorData(sensorData);
        HttpEntity<String> requestEntity = new HttpEntity<>(jsonObject.toString(), headers);
        restTemplate.postForEntity(apiUrl, requestEntity, String.class);
    }

    public void authorizeToken(String jwt) {
        String apiUrl = "http://users-microservice:8080/api/v1/auth/authenticate-token";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> requestEntity = new HttpEntity<>(jwt.substring(7), headers);
        restTemplate.postForEntity(apiUrl, requestEntity, Boolean.class);
    }
}

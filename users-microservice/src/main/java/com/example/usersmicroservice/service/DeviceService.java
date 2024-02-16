package com.example.usersmicroservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@RequiredArgsConstructor
@Service
public class DeviceService {
    private final RestTemplate restTemplate;

    public void deleteDevices(Integer id, String token) {
        String apiUrl = "http://devices-microservice:8081/api/v1/devices/deleteMaps";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("Authorization", token);
        HttpEntity<String> requestEntity = new HttpEntity<>(id.toString(), headers);
        restTemplate.postForEntity(apiUrl, requestEntity, Void.class);
    }
}

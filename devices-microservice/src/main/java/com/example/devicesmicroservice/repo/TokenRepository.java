package com.example.devicesmicroservice.repo;

import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@RequiredArgsConstructor
@Service
public class TokenRepository {
    private final RestTemplate restTemplate;

    public ResponseEntity<Boolean> authorizeToken(String jwt) {
        String apiUrl = "http://users-microservice:8080/api/v1/auth/authenticate-token";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> requestEntity = new HttpEntity<>(jwt.substring(7), headers);
        return restTemplate.postForEntity(apiUrl, requestEntity, Boolean.class);
    }

    private JSONObject jsonMapObject(Integer mappingId, String userMail){
        JSONObject jsonpObject = new JSONObject();
        jsonpObject.put("userMail", userMail);
        jsonpObject.put("mappingId", mappingId);
        return jsonpObject;
    }

    public void createSensor(Integer mappingId, String userMail, String token) {
        String apiUrl = "http://monitoring-microservice:8082/api/v1/sensor/create";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("Authorization", token);
        HttpEntity<String> requestEntity = new HttpEntity<>(jsonMapObject(mappingId, userMail).toString(), headers);
        restTemplate.postForEntity(apiUrl, requestEntity, String.class);
    }
}

package com.example.monitoringmicroservice.controller;

import com.example.monitoringmicroservice.dto.Map;
import com.example.monitoringmicroservice.dto.SensorData;
import com.example.monitoringmicroservice.publisher.SensorThread;
import com.example.monitoringmicroservice.repo.Request;
import com.example.monitoringmicroservice.repo.SensorRepo;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("api/v1/sensor")
public class SensorController {
    List<SensorThread> threads = new ArrayList<>();
    private final SensorRepo sensorRepo;
    Request request = new Request();

    @Data
    public static class BodyRequest {
        private List<Integer> sensorIds;
        private String date;
    }

    @PostMapping("/getBySensorId")
    public ResponseEntity<List<SensorData>> getData(@RequestBody BodyRequest bodyRequest) {
        List<SensorData> sensorsData = sensorRepo.getSensorDataBySensorId(bodyRequest.getSensorIds(), bodyRequest.getDate());
        return ResponseEntity.ok(sensorsData);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createSensorThread(
            @RequestBody Map mapping,
            @RequestHeader("Authorization") String token
    ){
        request.authorizeToken(token);
        SensorThread sensorThread = new SensorThread(mapping);
        threads.add(sensorThread);
        sensorThread.run();
        return ResponseEntity.ok("Thread with id" + mapping.getMappingId() + " was created");
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteSensorThread(
            @RequestBody int id,
            @RequestHeader("Authorization") String token
    ){
        request.authorizeToken(token);
        List<SensorThread> threadsToDelete = threads.stream().filter(thread1 -> thread1.getMappingId() == id).toList();
        List<SensorData> sensorData = sensorRepo.getBySensorId(id);
        for (SensorThread sensorThread : threadsToDelete) {
            sensorThread.interrupt();
            threads.remove(sensorThread);
        }
        sensorRepo.deleteAll(sensorData);
        return ResponseEntity.ok("Thread with id" + id + " was created");
    }
}
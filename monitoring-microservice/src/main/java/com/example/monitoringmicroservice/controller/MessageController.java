package com.example.monitoringmicroservice.controller;

import com.example.monitoringmicroservice.dto.SensorData;
import com.example.monitoringmicroservice.publisher.RabbitmqProducer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/queue")
public class MessageController {
    private final RabbitmqProducer producer;

    public MessageController(RabbitmqProducer producer) {
        this.producer = producer;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody SensorData sensorData) {
        producer.sendMessage(sensorData);
        return ResponseEntity.ok("Message has been sent.");
    }
}

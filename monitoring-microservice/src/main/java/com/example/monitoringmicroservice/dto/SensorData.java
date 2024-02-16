package com.example.monitoringmicroservice.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sensors_values")
@Entity
public class SensorData {
    @Id
    @GeneratedValue
    private int id;
    private int sensorId;
    private String userMail;
    private double value;
    private String timestamp;
    private String date;
}

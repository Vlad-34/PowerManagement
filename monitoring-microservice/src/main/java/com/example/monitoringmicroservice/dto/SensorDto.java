package com.example.monitoringmicroservice.dto;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class SensorDto {
    private int sensorId;
    private String userMail;
    private double value;
    private String timestamp;
    private String date;

    public SensorData map() {
        SensorData sensorData = new SensorData();
        sensorData.setSensorId(this.sensorId);
        sensorData.setUserMail(this.userMail);
        sensorData.setTimestamp(this.timestamp);
        sensorData.setValue(this.value);
        sensorData.setDate(this.date);
        return sensorData;
    }
}

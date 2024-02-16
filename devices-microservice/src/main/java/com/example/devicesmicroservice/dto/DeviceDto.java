package com.example.devicesmicroservice.dto;

import lombok.Data;

@Data
public class DeviceDto {
    private String description;
    private String address;
    private Double maxHourlyConsumption;
}

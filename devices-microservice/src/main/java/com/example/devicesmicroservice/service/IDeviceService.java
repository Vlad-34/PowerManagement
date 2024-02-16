package com.example.devicesmicroservice.service;

import com.example.devicesmicroservice.dto.DeviceDto;
import com.example.devicesmicroservice.model.Device;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IDeviceService {
    List<Device> getAll();
    ResponseEntity<Device> getById(Integer id);
    ResponseEntity<Device> add(DeviceDto device);
    ResponseEntity<Device> edit(Integer id, DeviceDto deviceDetails);
    ResponseEntity<Void> delete(Integer id);
}

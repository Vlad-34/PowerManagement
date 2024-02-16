package com.example.devicesmicroservice.service;

import com.example.devicesmicroservice.dto.DeviceDto;
import com.example.devicesmicroservice.model.Device;
import com.example.devicesmicroservice.repo.IDeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeviceServiceImpl implements IDeviceService {
    public final IDeviceRepository deviceRepository;

    @Override
    public List<Device> getAll() {
        return deviceRepository.findAll();
    }

    @Override
    public ResponseEntity<Device> getById(Integer id) {
        Device device = deviceRepository.findById(id).orElse(null);
        if(device != null)
            return ResponseEntity.ok(device);
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Device> add(DeviceDto device) {
        Device deviceMapped = Device.builder()
                .description(device.getDescription())
                .address(device.getAddress())
                .maxHourlyConsumption(device.getMaxHourlyConsumption())
                .build();
        deviceRepository.save(deviceMapped);
        return ResponseEntity.created(URI.create("/device/" + deviceMapped.getId())).body(deviceMapped);
    }

    @Override
    public ResponseEntity<Device> edit(Integer id, DeviceDto deviceDetails) {
        Device device = deviceRepository.findById(id).orElse(null);
        if(device != null) {
            device = Device.builder()
                    .id(id)
                    .description(deviceDetails.getDescription().isEmpty() ? device.getDescription() : deviceDetails.getDescription())
                    .address(deviceDetails.getAddress().isEmpty() ? device.getAddress() : deviceDetails.getAddress())
                    .maxHourlyConsumption(deviceDetails.getMaxHourlyConsumption() == null ? device.getMaxHourlyConsumption() : deviceDetails.getMaxHourlyConsumption())
                    .build();
            deviceRepository.save(device);
            return ResponseEntity.ok(device);
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Void> delete(Integer id) {
        Optional<Device> device = deviceRepository.findById(id);
        if(device.isPresent()) {
            deviceRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

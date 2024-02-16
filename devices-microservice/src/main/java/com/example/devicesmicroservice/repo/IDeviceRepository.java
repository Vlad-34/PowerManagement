package com.example.devicesmicroservice.repo;

import com.example.devicesmicroservice.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IDeviceRepository extends JpaRepository<Device, Integer> {
}

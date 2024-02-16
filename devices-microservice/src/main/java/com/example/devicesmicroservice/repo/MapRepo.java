package com.example.devicesmicroservice.repo;

import com.example.devicesmicroservice.model.Map;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MapRepo extends JpaRepository<Map, Integer> {
    @Query("""
        select m from Map as m \s
        where m.userId = :id \s
            """)
    List<Map> findDeviceIdByUserId(Integer id);

    @Query("""
        select m from Map as m \s
        where m.userId = :id \s
            """)
    List<Map> findMapByUserId(Integer id);
}

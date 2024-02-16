package com.example.monitoringmicroservice.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Set;

import static com.example.monitoringmicroservice.dto.Permission.*;

@Getter
@RequiredArgsConstructor
public enum Role {
    CLIENT(Set.of(CLIENT_READ)),
    ADMIN(Set.of(
                    ADMIN_CREATE,
                    ADMIN_READ,
                    ADMIN_UPDATE,
                    ADMIN_DELETE
            )
    );

    private final Set<Permission> permissions;
}
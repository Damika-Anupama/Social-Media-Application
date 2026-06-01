package com.pali.palindromebackend.business.util.impl;

import com.pali.palindromebackend.business.util.StatusEntityDTOMapper;
import com.pali.palindromebackend.dto.StatusDTO;
import com.pali.palindromebackend.entity.Status;

public class StatusEntityDTOMapperimpl extends StatusEntityDTOMapper {
    @Override
    public Status getStatus(StatusDTO dto) {
        if (dto == null) {
            return null;
        }

        Status status = new Status();
        try {
            status.setUser(getUser(dto));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        status.setId(dto.getId());
        status.setDetails(dto.getDetails());
        status.setMedia(dto.getMedia());
        status.setMediaType(dto.getMediaType());
        status.setCreatedTime(dto.getCreatedTime());
        status.setExpiringTime(dto.getExpiringTime());
        status.setExpired(dto.isExpired());
        status.setSponsored(dto.isSponsored());
        status.setViewedNumber(dto.getViewedNumber());
        return status;
    }

    @Override
    public StatusDTO getStatusDTO(Status status) {
        if(status == null){
            return null;
        }

        StatusDTO dto = new StatusDTO();

        dto.setUser(getUserName(status.getUser()));
        dto.setId(status.getId());
        dto.setDetails(status.getDetails());
        dto.setMedia(status.getMedia());
        dto.setMediaType(status.getMediaType());
        dto.setCreatedTime(status.getCreatedTime());
        dto.setExpired(status.isExpired());
        dto.setSponsored(status.isSponsored());
        dto.setViewedNumber(status.getViewedNumber());
        return dto;
    }
}

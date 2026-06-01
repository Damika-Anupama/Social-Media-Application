package com.pali.palindromebackend.business.custom.impl;


import com.pali.palindromebackend.business.custom.StatusBO;
import com.pali.palindromebackend.business.util.StatusEntityDTOMapper;
import com.pali.palindromebackend.dao.StatusDAO;
import com.pali.palindromebackend.dto.StatusDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 01/06/2021
 **/
@Transactional
@Service
public class StatusBOImpl implements StatusBO {

    private final StatusDAO dao;

    private final StatusEntityDTOMapper mapper;

    public StatusBOImpl(StatusDAO dao, StatusEntityDTOMapper mapper) {
        this.dao = dao;
        this.mapper = mapper;
    }


    @Override
    public void saveStatus(StatusDTO dto) {
        dao.save(mapper.getStatus(dto));
    }

    @Override
    public void updateStatus(StatusDTO dto) {
        dao.save(mapper.getStatus(dto));
    }

    @Override
    public void deleteStatus(int statusId) {
        dao.deleteById(statusId);
    }

    @Override
    public List<StatusDTO> getAllStatuses() {
        return dao.findAll().stream().
                map(mapper::getStatusDTO).collect(Collectors.toList());
    }

    @Override
    public StatusDTO getStatus(int statusId) {
        return dao.findById(statusId).map(mapper::getStatusDTO).get();
    }
}

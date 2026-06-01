package com.pali.palindromebackend.business.custom.impl;

import com.pali.palindromebackend.business.custom.ShareBO;
import com.pali.palindromebackend.business.util.LaunchEntityDTOMapper;
import com.pali.palindromebackend.dao.ShareDAO;
import com.pali.palindromebackend.dto.ShareDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 5/11/2022
 **/
@Transactional
@Service
public class ShareBOImpl implements ShareBO {

    private final ShareDAO dao;
    private final LaunchEntityDTOMapper mapper;

    public ShareBOImpl(ShareDAO dao, LaunchEntityDTOMapper mapper) {
        this.dao = dao;
        this.mapper = mapper;
    }

    @Override
    public void saveShare(ShareDTO dto) {
        dao.save(mapper.getShare(dto));
    }

    @Override
    public void updateShare(ShareDTO dto) {
        dao.save(mapper.getShare(dto));
    }

    @Override
    public void deleteShare(int shareId) {
        dao.deleteById(shareId);
    }

    @Override
    public List<ShareDTO> getAllShares() {
        return dao.findAll().stream().
                map(mapper::getShareDTO).collect(Collectors.toList());
    }

    @Override
    public ShareDTO getShare(int shareId) {
        return dao.findById(shareId).map(mapper::getShareDTO).get();
    }
}

package com.pali.palindromebackend.business.custom.impl;

import com.pali.palindromebackend.business.custom.CommunityBO;
import com.pali.palindromebackend.business.util.EntityDTOMapper;
import com.pali.palindromebackend.dao.CommunityDAO;
import com.pali.palindromebackend.dto.CommunityDTO;
import com.pali.palindromebackend.entity.Community;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 17/06/2021
 **/
@Transactional
@Service
public class CommunityBOImpl implements CommunityBO {

    private final CommunityDAO dao;
    private final EntityDTOMapper mapper;

    public CommunityBOImpl(CommunityDAO dao, EntityDTOMapper mapper) {
        this.dao = dao;
        this.mapper = mapper;
    }

    @Override
    public Community saveCom(CommunityDTO dto){
        return dao.save(mapper.getCommunity(dto));
    }

    @Override
    public void updateCom(CommunityDTO dto){
        dao.save(mapper.getCommunity(dto));
    }

    @Override
    public void deleteCom(int comId){
        dao.deleteById(comId);
    }

    @Override
    public List<CommunityDTO> getAllCommunities(){
        return dao.findAll().stream().
                map(mapper::getCommunityDTO).collect(Collectors.toList());
    }

    @Override
    public CommunityDTO getCom(int comId){
        return dao.findById(comId).map(mapper::getCommunityDTO).get();
    }


}

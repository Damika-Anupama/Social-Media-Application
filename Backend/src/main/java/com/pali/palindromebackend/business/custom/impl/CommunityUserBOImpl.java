package com.pali.palindromebackend.business.custom.impl;

import com.pali.palindromebackend.business.custom.CommunityUserBO;
import com.pali.palindromebackend.business.util.CommunityUserEntityDTOMapper;
import com.pali.palindromebackend.dao.CommunityUserDAO;
import com.pali.palindromebackend.dto.CommunityUserDTO;
import com.pali.palindromebackend.entity.CommunityUserPK;
import com.pali.palindromebackend.model.MiniUserComDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 6/22/2022
 **/

@Transactional
@Service
public class CommunityUserBOImpl implements CommunityUserBO {
    private final CommunityUserDAO dao;
    private final CommunityUserEntityDTOMapper  mapper;

    public CommunityUserBOImpl(CommunityUserDAO dao, CommunityUserEntityDTOMapper mapper) {
        this.dao = dao;
        this.mapper = mapper;
    }

    @Override
    public void saveCommunityUser(CommunityUserDTO dto){
        dao.save(mapper.getCommunityUser(dto));
    }

    @Override
    public void updateCommunityUser(CommunityUserDTO dto){
        dao.save(mapper.getCommunityUser(dto));
    }

    @Override
    public void deleteCommunityUser(CommunityUserPK pk){
        dao.deleteById(pk);
    }

    @Override
    public List<CommunityUserDTO> getAllCommunityUsers(){
        return dao.findAll().stream().map(mapper::getCommunityUserDTO).collect(Collectors.toList());
    }

    @Override
    public CommunityUserDTO getCommunityUser(CommunityUserPK pk){
        return dao.findById(pk).map(mapper::getCommunityUserDTO).get();
    }

    @Override
    public List<CommunityUserDTO> getAllCommunitiesByUserId(int userId) {
        return dao.findAllByUserId(userId).stream().map(mapper::getCommunityUserDTO).collect(Collectors.toList());
    }

    @Override
    public List<MiniUserComDTO> getCommunityUsers(int comId) {
        return dao.findAllByCommunityId(comId);
    }
}

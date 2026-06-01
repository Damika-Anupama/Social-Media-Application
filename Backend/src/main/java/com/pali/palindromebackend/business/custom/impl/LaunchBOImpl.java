package com.pali.palindromebackend.business.custom.impl;

import com.pali.palindromebackend.business.custom.LaunchBO;
import com.pali.palindromebackend.business.util.LaunchEntityDTOMapper;
import com.pali.palindromebackend.dao.LaunchDAO;
import com.pali.palindromebackend.dto.LaunchDTO;
import com.pali.palindromebackend.entity.Launch;
import com.pali.palindromebackend.entity.custom.LaunchUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 01/06/2021
 **/
@Transactional
@Service
public class LaunchBOImpl implements LaunchBO {
    private final LaunchDAO dao;

    private final LaunchEntityDTOMapper mapper;

    public LaunchBOImpl(LaunchDAO dao, LaunchEntityDTOMapper mapper) {
        this.dao = dao;
        this.mapper = mapper;
    }

    @Override
    public Launch saveLaunch(LaunchDTO dto){
        return dao.save(mapper.getLaunch(dto));
    }

    @Override
    public void updateLaunch(LaunchDTO dto){
        dao.save(mapper.getLaunch(dto));
    }

    @Override
    public void deleteLaunch(int launchId){
        dao.deleteById(launchId);
    }

    @Transactional(readOnly = true)
    @Override
    public List<LaunchDTO> getAllLaunches(){
        return dao.findAll().stream().
                map(mapper::getLaunchDTO).collect(Collectors.toList());
    }

    @Override
    public LaunchDTO getLaunch(int launchId){
        return dao.findById(launchId).map(mapper::getLaunchDTO).get();
    }

    @Override
    public List<LaunchDTO> getLaunchesByUserId(int userId){
        return dao.findLaunchesByUserId(userId).stream().
                map(mapper::getLaunchDTO).collect(Collectors.toList());
    }

    @Override
    public List<LaunchUserDetails> getAllLaunchesWithUserDetails(){
        return new ArrayList<>(dao.findLaunchesWithUserDetails());
    }
}

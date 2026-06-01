package com.pali.palindromebackend.business.custom;

import com.pali.palindromebackend.business.SuperBO;
import com.pali.palindromebackend.dto.LaunchDTO;
import com.pali.palindromebackend.entity.Launch;
import com.pali.palindromebackend.entity.custom.LaunchUserDetails;

import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 01/06/2021
 **/
public interface LaunchBO extends SuperBO {
    Launch saveLaunch(LaunchDTO dto);

    void updateLaunch(LaunchDTO dto);

    void deleteLaunch(int launchId);

    LaunchDTO getLaunch(int launchId);

    List<LaunchDTO> getAllLaunches();

    List<LaunchDTO> getLaunchesByUserId(int userId);

    List<LaunchUserDetails> getAllLaunchesWithUserDetails();
}

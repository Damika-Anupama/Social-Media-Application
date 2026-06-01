package com.pali.palindromebackend.business.custom;

import com.pali.palindromebackend.business.SuperBO;
import com.pali.palindromebackend.dto.StatusDTO;

import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 01/06/2021
 **/
public interface StatusBO extends SuperBO {
    public void saveStatus(StatusDTO dto);

    public void updateStatus(StatusDTO dto);

    public void deleteStatus(int statusId);

    public List<StatusDTO> getAllStatuses();

    public StatusDTO getStatus(int statusId);
}

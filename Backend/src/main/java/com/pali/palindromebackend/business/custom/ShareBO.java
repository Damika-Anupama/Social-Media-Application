package com.pali.palindromebackend.business.custom;

import com.pali.palindromebackend.business.SuperBO;
import com.pali.palindromebackend.dto.ShareDTO;

import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 5/11/2022
 **/
public interface ShareBO extends SuperBO {
    public void saveShare(ShareDTO dto);

    public void updateShare(ShareDTO dto);

    public void deleteShare(int shareId);

    public List<ShareDTO> getAllShares();

    public ShareDTO getShare(int shareId);

}

package com.pali.palindromebackend.business.custom;

import com.pali.palindromebackend.business.SuperBO;
import com.pali.palindromebackend.dto.PageDTO;

import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 01/06/2021
 **/
public interface PageBO extends SuperBO {
    void savePage(PageDTO dto);

    void updatePage(PageDTO dto);

    void deletePage(int pageId);

    List<PageDTO> getAllPages();

    PageDTO getPage(int PageId);
}

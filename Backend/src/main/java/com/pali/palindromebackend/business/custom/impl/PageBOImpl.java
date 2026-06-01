package com.pali.palindromebackend.business.custom.impl;

import com.pali.palindromebackend.business.custom.PageBO;
import com.pali.palindromebackend.business.util.EntityDTOMapper;
import com.pali.palindromebackend.dao.PageDAO;
import com.pali.palindromebackend.dto.PageDTO;
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
public class PageBOImpl implements PageBO {

    private final PageDAO dao;

    private final EntityDTOMapper mapper;

    public PageBOImpl(PageDAO dao, EntityDTOMapper mapper) {
        this.dao = dao;
        this.mapper = mapper;
    }


    @Override
    public void savePage(PageDTO dto) {
        dao.save(mapper.getPage(dto));
    }

    @Override
    public void updatePage(PageDTO dto) {
        dao.save(mapper.getPage(dto));
    }

    @Override
    public void deletePage(int pageId) {
        dao.deleteById(pageId);
    }

    @Override
    public List<PageDTO> getAllPages() {
        return dao.findAll().stream().
                map(mapper::getPageDTO).collect(Collectors.toList());
    }

    @Override
    public PageDTO getPage(int pageId) {
        return dao.findById(pageId).map(mapper::getPageDTO).get();
    }
}

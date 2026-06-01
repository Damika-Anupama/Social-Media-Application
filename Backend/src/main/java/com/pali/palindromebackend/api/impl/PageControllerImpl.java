package com.pali.palindromebackend.api.impl;

import com.pali.palindromebackend.api.PageController;
import com.pali.palindromebackend.business.custom.PageBO;
import com.pali.palindromebackend.dto.PageDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.NoSuchElementException;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 8/16/2022
 **/
@RestController
@RequestMapping("/api/v1/page")
public class PageControllerImpl extends PageController {
    private final PageBO bo;

    public PageControllerImpl(PageBO bo) {
        this.bo = bo;
    }

    @Override
    public ResponseEntity<?> findAll() {
        try {
            return new ResponseEntity<>(bo.getAllPages(), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Page found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> findById(int PageId) {
        try {
            return new ResponseEntity<>(bo.getPage(PageId), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Page found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> savePage(PageDTO dto) {
        try {
            bo.savePage(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> deleteById(int PageId) {
        try {
            bo.deletePage(PageId);
            return new ResponseEntity<>("Successfully deleted the Page !!", HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Page is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong!!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> updatePage(PageDTO dto, int PageId) {
        if (dto.getPageId() != PageId) {
            return new ResponseEntity<>("Mismatch PageId !!", HttpStatus.BAD_REQUEST);
        }
        try {
            bo.updatePage(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Page is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

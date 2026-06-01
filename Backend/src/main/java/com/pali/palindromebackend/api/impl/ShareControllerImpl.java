package com.pali.palindromebackend.api.impl;

import com.pali.palindromebackend.api.ShareController;
import com.pali.palindromebackend.business.custom.ShareBO;
import com.pali.palindromebackend.dto.ShareDTO;
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
@RequestMapping("api/v1/shares")
public class ShareControllerImpl extends ShareController {
    private final ShareBO bo;

    public ShareControllerImpl(ShareBO bo) {
        this.bo = bo;
    }

    @Override
    public ResponseEntity<?> findAll() {
        try {
            return new ResponseEntity<>(bo.getAllShares(), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No friend found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> findById(int shareId) {
        try {
            return new ResponseEntity<>(bo.getShare(shareId), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No friend found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> saveShare(ShareDTO dto) {
        try {
            bo.saveShare(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No friend found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> deleteById(int shareId) {
        try {
            bo.deleteShare(shareId);
            return new ResponseEntity<>("Successfully deleted the com !!", HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No friend is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong!!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> updateShare(ShareDTO dto, int shareId) {
        if (dto.getId() != shareId) {
            return new ResponseEntity<>("Mismatch shareId !!", HttpStatus.BAD_REQUEST);
        }
        try {
            bo.updateShare(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No com is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

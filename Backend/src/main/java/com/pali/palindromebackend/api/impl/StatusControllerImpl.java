package com.pali.palindromebackend.api.impl;

import com.pali.palindromebackend.api.StatusController;
import com.pali.palindromebackend.business.custom.StatusBO;
import com.pali.palindromebackend.dto.StatusDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 8/16/2022
 **/
@RestController
@RequestMapping("/api/v1/status")
public class StatusControllerImpl extends StatusController {
    private final StatusBO bo;

    public StatusControllerImpl(StatusBO bo) {
        this.bo = bo;
    }

    @Override
    public ResponseEntity<?> findAll() {
        try {
            return new ResponseEntity<>(bo.getAllStatuses(), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Status found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> findById(int StatusId) {
        try {
            return new ResponseEntity<>(bo.getStatus(StatusId), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Status found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> saveStatus(StatusDTO dto) {
        try {
            bo.saveStatus(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> deleteById(int StatusId) {
        try {
            bo.deleteStatus(StatusId);
            return new ResponseEntity<>("Successfully deleted the Status !!", HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Status is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong!!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> updateStatus(StatusDTO dto, int StatusId) {
        if (dto.getId() != StatusId) {
            return new ResponseEntity<>("Mismatch StatusId !!", HttpStatus.BAD_REQUEST);
        }
        try {
            bo.updateStatus(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Status is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

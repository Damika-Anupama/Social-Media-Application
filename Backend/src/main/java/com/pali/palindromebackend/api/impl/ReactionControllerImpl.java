package com.pali.palindromebackend.api.impl;

import com.pali.palindromebackend.api.ReactionController;
import com.pali.palindromebackend.business.custom.ReactionBO;
import com.pali.palindromebackend.dto.ReactionDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.NoSuchElementException;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 8/16/2022
 **/
@RestController
@RequestMapping("/api/v1/reactions")
public class ReactionControllerImpl extends ReactionController {
    private final ReactionBO bo;

    public ReactionControllerImpl(ReactionBO bo) {
        this.bo = bo;
    }

    @Override
    public ResponseEntity<?> findAll() {
        try {
            return new ResponseEntity<>(bo.getAllReactions(), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Status found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !! \n" + e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> findById(int ReactionId) {
        try {
            return new ResponseEntity<>(bo.getReaction(ReactionId), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Status found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> saveReaction(ReactionDTO dto) {
        System.out.println(dto);
        //reaction time and updated time should be filled from the frontend
        if (bo.checkUniqueness(dto.getUserId(), dto.getLaunchId())) {
            return new ResponseEntity<>("Same user has already reacted to this launch." +
                    " So please update relevant data. You can't create another", HttpStatus.BAD_REQUEST);
        }
        try {
            Date date = new Date();
            dto.setReactionTime(date);
            dto.setUpdatedTime(date);
            bo.saveReaction(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> deleteById(int ReactionId) {
        try {
            bo.deleteReaction(ReactionId);
            return new ResponseEntity<>("Successfully deleted the Status !!", HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Status is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong!!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> updateReaction(ReactionDTO dto, int ReactionId) {
        if (dto.getId() != ReactionId) {
            return new ResponseEntity<>("Mismatch StatusId !!", HttpStatus.BAD_REQUEST);
        }
        try {
            bo.updateReaction(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Status is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

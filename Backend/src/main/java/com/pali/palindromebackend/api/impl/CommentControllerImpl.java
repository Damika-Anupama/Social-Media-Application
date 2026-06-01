package com.pali.palindromebackend.api.impl;

import com.pali.palindromebackend.api.CommentController;
import com.pali.palindromebackend.business.custom.CommentBO;
import com.pali.palindromebackend.dto.CommentDTO;
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
@RequestMapping("api/v1/comments")
public class CommentControllerImpl extends CommentController {
    private final CommentBO bo;

    public CommentControllerImpl(CommentBO bo) {
        this.bo = bo;
    }

    @Override
    public ResponseEntity<?> findAll() {
        try {
            return new ResponseEntity<>(bo.getAllComments(), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No comment found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> findById(int id) {
        try {
            return new ResponseEntity<>(bo.getComment(id), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No comment found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> saveComment(CommentDTO dto){
        try {
            dto.setCommentedDate(new Date());
            dto.setLastUpdatedDate(new Date());
            System.out.println(dto);
            bo.saveComment(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        }catch (Exception e) {
            return new ResponseEntity<>(
                    "Something went wrong when saving the comment!! " + e,
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Override
    public ResponseEntity<?> deleteById(int id) {
        try {
            bo.deleteComment(id);
            return new ResponseEntity<>("Successfully deleted the com !!", HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No comment is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong!!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> updateComment(CommentDTO dto, int comId){
        if (dto.getId() != comId) {
            return new ResponseEntity<>("Mismatch comId !!", HttpStatus.BAD_REQUEST);
        }
        try {
            bo.updateComment(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No com is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

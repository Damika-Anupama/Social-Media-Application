package com.pali.palindromebackend.api.impl;

import com.pali.palindromebackend.api.FriendController;
import com.pali.palindromebackend.business.custom.FriendBO;
import com.pali.palindromebackend.dto.FriendDTO;
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
@RequestMapping("api/v1/friends")
public class FriendControllerImpl extends FriendController {
    private final FriendBO bo;

    public FriendControllerImpl(FriendBO bo) {
        this.bo = bo;
    }

    @Override
    public ResponseEntity<?> findAll() {
        try {
            return new ResponseEntity<>(bo.getAllFriends(), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No friend found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> findById(int friendshipId) {
        try {
            return new ResponseEntity<>(bo.getFriend(friendshipId), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No friend found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> saveFriend(FriendDTO dto) {
        // TODO: 7/15/2022  check whether same friendship exists
        try {
            dto.setAskedDate(new Date());
            bo.saveFriend(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No friend found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !! " + e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> deleteById(int friendshipId) {
        try {
            System.out.println(friendshipId);
            bo.getFriend(friendshipId);
            bo.deleteFriend(friendshipId);
            return new ResponseEntity<>("Successfully deleted the friend !!", HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No friend is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong!!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> updateFriend(FriendDTO dto, int friendshipId) {
        try {
            bo.getFriend(friendshipId);
            bo.updateFriend(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No friend is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
/*
    Friend Logic

    * friend1 = first user who asked for the friendship
    * friend2 = second user who needs to confirm the friendship
    * askedDate = the date first user asked for the friendship
    * isConfirmed = True after second user accepts the friendship
    * friendshipDate = second user confirmed date
    * isBlocked = whether the friendship has blocked
    * blockedBy = friend1 or friend2 (requested person)
    * blockedDate
    * */
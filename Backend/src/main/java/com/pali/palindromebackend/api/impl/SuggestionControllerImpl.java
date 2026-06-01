package com.pali.palindromebackend.api.impl;

import com.pali.palindromebackend.api.SuggestionController;
import com.pali.palindromebackend.business.custom.SuggestionBO;
import com.pali.palindromebackend.dto.SuggestionDTO;
import com.pali.palindromebackend.dto.SuggestionUserDTO;
import com.pali.palindromebackend.model.ResponseSuggestionUser;
import com.pali.palindromebackend.service.FileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 8/16/2022
 **/
@RestController
@RequestMapping("/api/v1/suggestion")
public class SuggestionControllerImpl extends SuggestionController {
    private final SuggestionBO bo;
    private final FileService fileService;

    public SuggestionControllerImpl(SuggestionBO bo, FileService fileService) {
        this.bo = bo;
        this.fileService = fileService;
    }

    @Override
    public ResponseEntity<?> findAll(){
        try {
            return new ResponseEntity<>( bo.getAllSuggestions(), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Suggestion found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> getAllSuggestionsWithUsers(){
        try {
            List<SuggestionUserDTO> suggestionUserDTOS = bo.getAllSuggestionsWithUsers();
            ArrayList<ResponseSuggestionUser> list = new ArrayList<>();
            suggestionUserDTOS.forEach(dto ->{
                ResponseSuggestionUser rsu = new ResponseSuggestionUser();
                rsu.setProfilePicture(fileService.getMedia(dto.getProfilePicture()));
                rsu.setId(dto.getId());
                rsu.setMessage(dto.getMessage());
                rsu.setPriority(dto.getPriority());
                rsu.setFeeling(dto.getFeeling());
                rsu.setUsername(dto.getUsername());
                rsu.setUserId(dto.getUserId());
                list.add(rsu);
            });
            return new ResponseEntity<List<ResponseSuggestionUser>>(list, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Suggestion found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public ResponseEntity<Object> findById(int suggestionId) {
        try {
            return new ResponseEntity<>(bo.getSuggestion(suggestionId), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Suggestion found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> saveSuggestion(SuggestionDTO dto){
        try {
            bo.saveSuggestion(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Something went wrong when saving the suggestion",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Override
    public ResponseEntity<Object> deleteById(int suggestionId){
        try {
            bo.deleteSuggestion(suggestionId);
            return new ResponseEntity<>("Successfully deleted the Suggestion !!", HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Suggestion is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong!!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> updateSuggestion(SuggestionDTO dto, int suggestionId){
        if (dto.getId() != suggestionId) {
            return new ResponseEntity<>("Mismatch suggestionId !!", HttpStatus.BAD_REQUEST);
        }
        try {
            bo.updateSuggestion(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Suggestion is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

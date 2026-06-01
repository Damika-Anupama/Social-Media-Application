package com.pali.palindromebackend.api.impl;

import com.pali.palindromebackend.api.LaunchController;
import com.pali.palindromebackend.business.custom.LaunchBO;
import com.pali.palindromebackend.dto.LaunchDTO;
import com.pali.palindromebackend.entity.Launch;
import com.pali.palindromebackend.entity.custom.LaunchUserDetails;
import com.pali.palindromebackend.model.DashboardLaunchDetail;
import com.pali.palindromebackend.model.LaunchBody;
import com.pali.palindromebackend.model.ResponseLaunchBody;
import com.pali.palindromebackend.service.FileService;
import com.pali.palindromebackend.service.FullLaunchBodyPackager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 8/16/2022
 **/
@RestController
@RequestMapping("/api/v1/launches")
public class LaunchControllerImpl extends LaunchController {
    private final LaunchBO bo;

    private final FileService fileService;
    private final FullLaunchBodyPackager packager;

    public LaunchControllerImpl(LaunchBO bo, FileService fileService, FullLaunchBodyPackager packager) {
        this.bo = bo;
        this.fileService = fileService;
        this.packager = packager;
    }

    @Override
    public ResponseEntity<?> findAll() {
        List<LaunchUserDetails> launchUserDetails = bo.getAllLaunchesWithUserDetails();
        ArrayList<DashboardLaunchDetail> dashboardLaunchDetails = new ArrayList<>();
        launchUserDetails.forEach(detail -> dashboardLaunchDetails.add(packager.getLaunch(detail)));
        return new ResponseEntity<>(dashboardLaunchDetails, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getLaunchesByUserId(int userId){
        try {
            List<LaunchDTO> launches = bo.getLaunchesByUserId(userId);
            List<ResponseLaunchBody> launches1 = new ArrayList<>();
            launches.forEach(dto -> {
                ResponseLaunchBody launchBody = new ResponseLaunchBody();
                launchBody.setFile(fileService.getMedia(dto.getMedia()));
                launchBody.setDescription(dto.getDescription());
                launchBody.setFeeling(dto.getFeeling());
                launches1.add(launchBody);
            });
            return new ResponseEntity<>(launches1, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Launch Found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> findById(int launchId) {
        try {
            return new ResponseEntity<>(bo.getLaunch(launchId), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No Launch Found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Launch> saveLaunch(LaunchBody body){
        try {
            final String mediaPath = fileService.saveFile(body.getFile(), "media/");
            LaunchDTO dto = new LaunchDTO();
            Date date = new Date();

            dto.setDescription(body.getDescription());
            dto.setFeeling(body.getFeeling());
            dto.setMedia(mediaPath);
            dto.setMediaType(body.getFile().getContentType());
            dto.setUser(body.getUser());
            dto.setCreatedDate(date);
            dto.setUpdatedDate(date);
            Launch launch = bo.saveLaunch(dto);
            return new ResponseEntity<>(launch, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>((Launch) null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> deleteById(int launchId) {
        try {
            System.out.println(launchId);
            bo.getLaunch(launchId);
            bo.deleteLaunch(launchId);
            return new ResponseEntity<>("Successfully deleted the relevant launch :)", HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No launch is found!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> updateLaunch(LaunchBody body, int launchId){
        System.out.println("Hello");
        try {
            String filePath = null;
            LaunchDTO dto = bo.getLaunch(launchId);
            Date date = new Date();

            if (!(dto.getUser() == body.getUser())) {
                return new ResponseEntity<>("Mismatched User :(", HttpStatus.BAD_REQUEST);
            }

            if (body.getFile() != null) {
                // TODO: 5/26/2022  this must contain transaction method
                filePath = fileService.saveFile(body.getFile(), "media/");
                fileService.deleteFile(dto.getMedia());
            }
            dto.setMedia(filePath);
            dto.setDescription(body.getDescription());
            dto.setUpdatedDate(date);
            dto.setFeeling(body.getFeeling()); // user of the launch doesn't change
            bo.updateLaunch(dto);
            return new ResponseEntity<>("Successfully the launch was updated!", HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No such launch is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

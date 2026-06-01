package com.pali.palindromebackend.api.impl;

import com.pali.palindromebackend.api.CommunityController;
import com.pali.palindromebackend.api.LaunchController;
import com.pali.palindromebackend.business.custom.CommunityBO;
import com.pali.palindromebackend.business.custom.CommunityLaunchBO;
import com.pali.palindromebackend.business.custom.CommunityUserBO;
import com.pali.palindromebackend.dto.CommunityDTO;
import com.pali.palindromebackend.dto.CommunityLaunchDTO;
import com.pali.palindromebackend.dto.CommunityUserDTO;
import com.pali.palindromebackend.entity.Community;
import com.pali.palindromebackend.entity.ExistingStatus;
import com.pali.palindromebackend.entity.Launch;
import com.pali.palindromebackend.entity.Role;
import com.pali.palindromebackend.entity.custom.LaunchUserDetails;
import com.pali.palindromebackend.model.*;
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
@RequestMapping("api/v1/community")
public class CommunityControllerImpl extends CommunityController {
    private final CommunityBO bo;
    private final CommunityUserBO bo1;
    private final CommunityLaunchBO bo2;
    private final FileService fileService;
    private final LaunchController launchController;
    private final FullLaunchBodyPackager packager;

    public CommunityControllerImpl(CommunityBO bo, CommunityUserBO bo1,
                                   CommunityLaunchBO bo2, FileService fileService,
                                   LaunchController launchController, FullLaunchBodyPackager packager) {
        this.bo = bo;
        this.bo1 = bo1;
        this.bo2 = bo2;
        this.fileService = fileService;
        this.launchController = launchController;
        this.packager = packager;
    }

    @Override
    public ResponseEntity<?> findAll() {
        try {
            List<CommunityDTO> allCommunityDTOs = bo.getAllCommunities();
            ArrayList<ResponseCommunityBody> responseCommunityBodies = new ArrayList<>();
            allCommunityDTOs.forEach(detail -> {
                byte[] groupIcon = fileService.getMedia(detail.getGroupIcon());
                byte[] wallPaper = fileService.getMedia(detail.getWallpaper());
                ResponseCommunityBody responseCommunityBody = new ResponseCommunityBody(
                        detail.getCommunityId(),
                        detail.getTitle(),
                        detail.getDescription(),
                        detail.getCreatedDate(),
                        groupIcon,
                        wallPaper
                );
                responseCommunityBodies.add(responseCommunityBody);
            });
            return new ResponseEntity<List<ResponseCommunityBody>>(responseCommunityBodies, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No friend found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> findById(int id){
        try {
            List<MiniUserCom> miniUserComArrayList = new ArrayList<>();
            List<CommunityDashboardLaunchDetail> dashboardLaunchDetails = new ArrayList<>();
            CommunityDTO dto = bo.getCom(id);
            List<MiniUserComDTO> communityUsers = bo1.getCommunityUsers(id);
            // converting the whole miniUserCommunityDTO array
            // into miniUserCommunity array
            communityUsers.forEach(value -> miniUserComArrayList.add(new MiniUserCom(
                    value.getUserId(),
                    value.getUsername(),
                    value.getShortDescription(),
                    fileService.getMedia(value.getProfilePicture()),
                    value.getOnlineStatus(),
                    value.getJoinedDate(),
                    value.getUpdatedDate(),
                    value.getRole()
            )));
            List<CommunityLaunchDetail> communityLaunches = bo2.getCommunityLaunches(id);
            communityLaunches.forEach(value -> {
                DashboardLaunchDetail launch = packager.getLaunch(
                        new LaunchUserDetails(
                                value.getId(),
                                value.getMedia(),
                                value.getMediaType(),
                                value.getDescription(),
                                value.getFeeling(),
                                value.getUserId(),
                                value.getUserName(),
                                value.getShortDescription(),
                                value.getProfilePicture(),
                                value.getUserOnlineStatus(),
                                value.getUpdatedDate(),
                                value.getCreatedDate()
                        )
                );
                CommunityDashboardLaunchDetail communityDashboardLaunchDetail = new CommunityDashboardLaunchDetail(
                        launch.getLaunchId(),
                        launch.getFile(),
                        launch.getMediaType(),
                        launch.getDescription(),
                        launch.getFeeling(),
                        launch.getUserId(),
                        launch.getUserName(),
                        launch.getShortDescription(),
                        launch.getProfilePicture(),
                        launch.getUserOnlineStatus(),
                        launch.getUpdatedTime(),
                        launch.getCreatedDate(),
                        launch.getReactType(),
                        launch.getReactions(),
                        launch.getComments(),
                        value.getExistingStatus(),
                        value.getSharedPersonId(),
                        value.getSharedTime()
                );
                dashboardLaunchDetails.add(communityDashboardLaunchDetail);
            });

            CommunityFullDetails communityFullDetails = new CommunityFullDetails(
                    id,
                    dto.getTitle(),
                    dto.getDescription(),
                    dto.getCreatedDate(),
                    this.fileService.getMedia(dto.getGroupIcon()),
                    this.fileService.getMedia(dto.getWallpaper()),
                    miniUserComArrayList,
                    dashboardLaunchDetails
            );
            return new ResponseEntity<>(communityFullDetails, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No friend found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> saveCommunity(CommunityUserBody body) {
        try {
            CommunityDTO dto = new CommunityDTO();
            CommunityUserDTO dto1 = new CommunityUserDTO();
            FileService service = new FileService();

            //setting the community dto object
            dto.setTitle(body.getTitle());
            dto.setDescription(body.getDescription());
            dto.setCreatedDate(new Date());
            dto.setGroupIcon(service.saveFile(body.getGroupIcon(),"community/groupIcon/"));
            dto.setWallpaper(service.saveFile(body.getWallpaper(),"community/wallpaper/"));
            Community community = bo.saveCom(dto);
            //setting the userCommunity object
            dto1.setUserId(body.getUserId());
            dto1.setCommunityId(community.getCommunityId());
            dto1.setJoinedDate(new Date()); // User's joined date is equals to community created date.
            // TODO: 7/12/2022 updated date not saving in the database
            dto1.setUpdatedDate(new Date());
            dto1.setRole(Role.OWNER); // When a community creation,  the user should definitely be the owner.
            System.out.println(dto1);
            bo1.saveCommunityUser(dto1);
            return new ResponseEntity<>(dto1, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !! " + e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> deleteById(int id){
        try {
            bo.getCom(id);
            bo.deleteCom(id);
            return new ResponseEntity<>("Successfully deleted the com !!", HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No friend is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong!!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> updateCommunity(CommunityDTO dto, int comId){
        if (dto.getCommunityId() != comId) {
            return new ResponseEntity<>("Mismatch comId !!", HttpStatus.BAD_REQUEST);
        }
        try {
            bo.getCom(comId);
            bo.updateCom(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No com is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> createCommunityLaunch(CommunityLaunchCreate body) {
        try {
            ResponseEntity<Launch> launchResponseEntity = launchController.saveLaunch(body.getLaunchBody());
            CommunityLaunchDTO dto = new CommunityLaunchDTO(
                    launchResponseEntity.getBody().getId(),
                    body.getCommunityId(),
                    ExistingStatus.CREATED,
                    body.getSharedPersonId(),
                    new Date()
            );

            bo2.save(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !! " + e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> shareCommunityLaunch(CommunityLaunchDTO dto) {
        try {
            bo2.save(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !! " + e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

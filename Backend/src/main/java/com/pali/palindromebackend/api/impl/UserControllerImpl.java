package com.pali.palindromebackend.api.impl;

import com.pali.palindromebackend.api.UserController;
import com.pali.palindromebackend.business.custom.*;
import com.pali.palindromebackend.dto.*;
import com.pali.palindromebackend.entity.custom.LaunchUserDetails;
import com.pali.palindromebackend.model.*;
import com.pali.palindromebackend.service.DateDescendentObjectCreator;
import com.pali.palindromebackend.service.FileService;
import com.pali.palindromebackend.service.FullLaunchBodyPackager;
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
@RequestMapping("/api/v1/users")
public class UserControllerImpl extends UserController {
    private final UserBO userBO;
    private final CommunityUserBO communityUserBO;
    private final CommunityBO communityBO;
    private final FriendBO friendBO;
    private final LaunchBO launchBO;
    private final FileService fileService;
    private final FullLaunchBodyPackager packager;
    private final DateDescendentObjectCreator creator;

    public UserControllerImpl(FileService fileService, UserBO userBO, CommunityUserBO communityUserBO,
                              CommunityBO communityBO, FriendBO friendBO, LaunchBO launchBO,
                              FullLaunchBodyPackager packager, DateDescendentObjectCreator creator) {
        this.userBO = userBO;
        this.communityUserBO = communityUserBO;
        this.communityBO = communityBO;
        this.friendBO = friendBO;
        this.launchBO = launchBO;
        this.fileService = fileService;
        this.packager = packager;
        this.creator = creator;
    }

    @Override
    public ResponseEntity<?> findAll() {
        try {
            return new ResponseEntity<>(userBO.getAllUsers(), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No user found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> getUserInfoForProfilePage(int userId) {
        System.out.println("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n"+userId+"\\\\\\\\\\\\\\\\\\\\\\\\\\n");
        try {
            UserDTO user = userBO.getUser(userId);

            List<LaunchDTO> launchesByUserId = launchBO.getLaunchesByUserId(userId);
            ArrayList<DashboardLaunchDetail> launches = new ArrayList<>();
            launchesByUserId.forEach(dto -> {
                UserDTO user1 = null;
                try {
                    user1 = userBO.getUser(dto.getUser());
                } catch (Exception e) {
                    e.printStackTrace();
                }
                DashboardLaunchDetail launch = packager.getLaunch(
                        new LaunchUserDetails(
                                dto.getId(),
                                dto.getMedia(),
                                dto.getMediaType(),
                                dto.getDescription(),
                                dto.getFeeling(),
                                user1.getId(),
                                user1.getUsername(),
                                user1.getShortDescription(),
                                user1.getProfilePicture(),
                                user1.getOnlineStatus(),
                                dto.getUpdatedDate(),
                                dto.getCreatedDate()
                        )
                );
                launches.add(launch);
            });

            List<CommunityUserDTO> communitiesUsers = communityUserBO.getAllCommunitiesByUserId(userId);
            ArrayList<ResponseCommunityBody> communities = new ArrayList<>();
            communitiesUsers.forEach(c -> {
                CommunityDTO com = null;
                try {
                    com = communityBO.getCom(c.getCommunityId());
                } catch (Exception e) {
                    e.printStackTrace();
                }
                ResponseCommunityBody body = new ResponseCommunityBody(
                        com.getCommunityId(),
                        com.getTitle(),
                        com.getDescription(),
                        com.getCreatedDate(),
                        fileService.getMedia(com.getGroupIcon()),
                        fileService.getMedia(com.getWallpaper())
                );
                communities.add(body);
            });

            List<FriendDTO> friendsByUserId = friendBO.getAllFriendsByUserId(userId);
            ArrayList<RequiredFriendDetailObject> friends = new ArrayList<>();
            friendsByUserId.forEach(friend -> {
                UserDTO user1 = null;
                RequiredFriendDetailObject object = new RequiredFriendDetailObject();
                int friendId;
                if (userId == friend.getFriend1()) {
                    friendId = friend.getFriend2();
                    object.setAsked(false);
                } else {
                    friendId = friend.getFriend1();
                    object.setAsked(true);
                }
                object.setFriendId(friendId);
                object.setCreatedDate(friend.getFriendshipDate());
                try {
                    user1 = userBO.getUser(friendId);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                object.setUsername(user1.getUsername());
                object.setProfilePicture(fileService.getMedia(user1.getProfilePicture()));
                friends.add(object);
            });

            List<DateDescendObject> dateDescendObjects = creator.giveDateDescendentObjet(launches, communities, friends);

            UserProfileBody userProfileBody = new UserProfileBody(
                    userId,
                    user.getCreatedAt(),
                    user.getIsActive(),
                    user.getRole(),
                    user.getUpdatedAt(),
                    user.getLastLogin(),
                    user.getOnlineStatus(),
                    user.getUsername(),
                    user.getFullName(),
                    user.getGender(),
                    user.getEmail(),
                    user.getShortDescription(),
                    fileService.getMedia(user.getProfilePicture()),
                    user.getContactNum(),
                    user.getLocation(),
                    user.getEducation(),
                    user.getSkills(),
                    user.getDob(),
                    user.getRelationship(),
                    communitiesUsers.size(),
                    friendsByUserId.size(),
                    launchesByUserId.size(),
                    dateDescendObjects
            );


            return new ResponseEntity<>(userProfileBody, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No user found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!\n" + e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> findById(int userId) {
        try {
            UserDTO user = userBO.getUser(userId);
            SendingUserBody body = new SendingUserBody(
                    fileService.getMedia(user.getProfilePicture()),
                    user.getShortDescription(), user.getUsername(),
                    user.getEmail(),
                    user.getContactNum(),
                    user.getPassword(),
                    user.getFullName(),
                    user.getDob(),
                    user.getEducation(),
                    user.getSkills(),
                    user.getGender(),
                    user.getRelationship()
            );
            return new ResponseEntity<>(body, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No user found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> getUserProfilePicture(int id) {
        try {
            HomePageLoading hpl = new HomePageLoading(fileService.getMedia(userBO.getUserProfilePicture(id)));
            return new ResponseEntity<>(hpl, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No user found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> getUserByName(String userName) {
        System.out.println("getUserByName");
        try {
            UserDTO user = userBO.getUserByName(userName);
            UserDTO copy = new UserDTO();
            copy.setUsername(user.getUsername());
            return new ResponseEntity<>(copy, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No user found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> getUserByEmail(String email) {
        System.out.println("getUserByEmail");
        try {
            UserDTO user = userBO.getUserByEmail(email);
            UserDTO copy = new UserDTO();
            copy.setEmail(user.getEmail());
            return new ResponseEntity<>(copy, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No user found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> verifyUser(VerifyObject obj) {
        try {
//            boolean b = emailService.sendVerificationObject(obj);
//            if (b) {
//                return new ResponseEntity<>(obj, HttpStatus.CREATED);
//            } else {
            return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
//            }
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> saveUser(UserDTO dto) {
        try {
            userBO.saveUser(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> deleteById(int userId) {
        try {
            System.out.println(userId);
            userBO.getUser(userId);
            userBO.deleteUser(userId);
            return new ResponseEntity<>("Successfully deleted the user !!", HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No user is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong!!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> updateUser(UserBody body, int userid) {
        if (body.getId() != userid) {
            return new ResponseEntity<>("Mismatch userId !!", HttpStatus.BAD_REQUEST);
        } else if (true) {
            // TODO: 5/26/2022   handle the multi part file size from this stage before save it
        }
        try {
            String filePath = null;
            if (body.getProfilePic() != null) {
                filePath = fileService.saveFile(body.getProfilePic(), "users/");
                UserDTO user = userBO.getUser(userid);
                fileService.deleteFile(user.getProfilePicture());
            }
            UserDTO dto = new UserDTO();
            dto.setId(body.getId());
            dto.setUsername(body.getUsername());
            dto.setEmail(body.getEmail());
            dto.setShortDescription(body.getShortDes());
            dto.setProfilePicture(filePath);
            dto.setContactNum(body.getPhoneNum());
//            dto.setOnlineStatus(true);
            userBO.updateUserNormalDetails(dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No user is found !!", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong !!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void logoutUser(int userId) {
        userBO.setLogOut(userId);
    }

    @Override
    public void updateUserLastLogin(UserBody body, int id) {
        try {
            UserDTO dto = new UserDTO();
            dto.setLastLogin(body.getLastLogin());
            userBO.updateUserNormalDetails(dto);
            System.out.println("Successfully changed " + id + "'s last login.");
        } catch (NoSuchElementException e) {
            System.out.println("No user is found !!");
        } catch (Exception e) {
            System.out.println("Something went wrong !! " + e);
        }
    }
}

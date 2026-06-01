package com.pali.palindromebackend.api.impl;

import com.pali.palindromebackend.api.AdController;
import com.pali.palindromebackend.api.AuthenticateController;
import com.pali.palindromebackend.business.util.MyUserDetailsService;
import com.pali.palindromebackend.dao.UserDAO;
import com.pali.palindromebackend.dto.LoginDTO;
import com.pali.palindromebackend.entity.User;
import com.pali.palindromebackend.model.AuthenticateBody;
import com.pali.palindromebackend.model.UserBody;
import com.pali.palindromebackend.service.FileService;
import com.pali.palindromebackend.util.JWTUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 8/16/2022
 **/
@RestController
@RequestMapping("/api/v1/authenticate")
public class AuthenticationControllerImpl extends AuthenticateController {
    private final AuthenticationManager authenticationManager;

    private final MyUserDetailsService myUserDetailsService;

    private final JWTUtil jwtUtil;

    private final UserDAO userDAO;


    private final FileService fileService;

    private final UserControllerImpl userControllerImpl;

    public AuthenticationControllerImpl(AuthenticationManager authenticationManager, MyUserDetailsService myUserDetailsService, JWTUtil jwtUtil, UserDAO userDAO, FileService fileService, UserControllerImpl userControllerImpl) {
        this.authenticationManager = authenticationManager;
        this.myUserDetailsService = myUserDetailsService;
        this.jwtUtil = jwtUtil;
        this.userDAO = userDAO;
        this.fileService = fileService;
        this.userControllerImpl = userControllerImpl;
    }

    @Override
    public ResponseEntity<?> createAuthenticationToken(LoginDTO loginDTO) {
        UserBody userBody = new UserBody();
        java.util.Date date = new java.util.Date();
        userBody.setLastLogin(date);
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword())
            );

        } catch (DisabledException e) {
            return new ResponseEntity<>("You are deactivated! please contact the admin", HttpStatus.FORBIDDEN);
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>("Incorrect username or password", HttpStatus.UNAUTHORIZED);
        } catch (Throwable e) {
            throw new Error(e);
        }
        Optional<User> user = userDAO.findUserByUsername(loginDTO.getUsername());
        final UserDetails userDetails = myUserDetailsService.loadUserByUsername(loginDTO.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        byte[] media = new byte[0];
        if (user.get().getProfilePicture() != null) {
            media = fileService.getMedia(user.get().getProfilePicture());
        }
        AuthenticateBody body = new AuthenticateBody(jwt, user.get().getId(), media, user.get().getUsername());
        userControllerImpl.updateUserLastLogin(userBody, user.get().getId());// update the last login time of the user
        return ResponseEntity.ok(body);
    }
}

package com.pali.palindromebackend.filter;

import com.pali.palindromebackend.business.util.MyUserDetailsService;
import com.pali.palindromebackend.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 29/04/2021
 **/
@Component
public class JWTRequestFilter extends OncePerRequestFilter {

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Autowired
    private JWTUtil jwtUtil;
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain){
        final String authorizationHeader = req.getHeader("Authorization");

        String userName = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer")){
            jwt = authorizationHeader.substring(7);
            userName = jwtUtil.extractUsername(jwt);
        }
        if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = this.myUserDetailsService.loadUserByUsername(userName);
            if(jwtUtil.validateToken(jwt,userDetails)){
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        try {
            super.doFilter(req, res, chain);
        } catch (IOException | ServletException e) {
            System.out.println("Error in JWTRequestFilter!");
            e.printStackTrace();
        }
    }
}

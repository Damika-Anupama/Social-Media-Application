package com.pali.palindromebackend.filter;
/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 28/04/2021
 **/

import org.springframework.stereotype.Component;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CORSFilter extends HttpFilter {
    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
        response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTION");
        response.setHeader("Access-Control-Allow-Headers", "Content-type,Origin,Authorization");
        try {
            chain.doFilter(request, response);
        } catch (IOException | ServletException e) {
            System.out.println("Error in CORSFilter!");
            e.printStackTrace();
        }
    }
}

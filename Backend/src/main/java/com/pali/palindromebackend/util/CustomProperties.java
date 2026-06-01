package com.pali.palindromebackend.util;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 8/17/2022
 **/
@Configuration
@ConfigurationProperties(prefix = "com.palindrome")
public class CustomProperties {

    /**
     * The url to connect to.
     */
    String url;

    /**
     * The time to wait for the connection.
     */
    private int timeoutInMilliSeconds = 1000;

    // Getters and Setters

}
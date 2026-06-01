package com.pali.palindromebackend.api;


import com.pali.palindromebackend.model.EmailDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/30/2022
 **/


public abstract class EmailController {


    // Sending a simple Email
    @PostMapping("/sendMail")
    public abstract String sendMail(@RequestBody EmailDetails details);


    // Sending email with attachment
    @PostMapping(value = "/sendMailWithAttachment")
    public abstract String sendMailWithAttachment(@RequestBody EmailDetails details);

}

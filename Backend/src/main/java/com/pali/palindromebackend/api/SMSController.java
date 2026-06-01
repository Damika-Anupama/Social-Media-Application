package com.pali.palindromebackend.api;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 8/17/2022
 **/
@RestController
@RequestMapping(value = "/api/v1/sendSMS")
public class SMSController {

    private final Environment env;

    public SMSController(Environment env) {
        this.env = env;
    }


    @GetMapping
    public ResponseEntity<String> sendSMS() {

        Twilio.init(env.getProperty("com.palindrome.twilio.Account.SID"),
                env.getProperty("com.palindrome.twilio.AUTH.TOKEN"));

        Message.creator(new com.twilio.type.PhoneNumber("+94764189999"),
                new com.twilio.type.PhoneNumber(""), "Hello from Palindrome 🐧").create();

        return new ResponseEntity<String>("Message sent successfully", HttpStatus.OK);
    }
}

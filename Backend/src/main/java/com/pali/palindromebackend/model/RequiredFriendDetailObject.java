package com.pali.palindromebackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/17/2022
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RequiredFriendDetailObject implements Serializable {
    private int friendId;
    private String username;
    private boolean asked; // whether the friend requested and you accepted or you asked friend accepted
    private Date createdDate; // friendship created date
    private byte[] profilePicture;

    public boolean getAsked() {
        return asked;
    }

    public void setAsked(boolean asked) {
        this.asked = asked;
    }
}

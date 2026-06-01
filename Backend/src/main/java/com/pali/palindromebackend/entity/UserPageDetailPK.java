package com.pali.palindromebackend.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Embeddable;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 17/06/2021
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
@Embeddable
public class UserPageDetailPK implements SuperEntity{
    @Column(name = "user_id")
    private int userId;
    @Column(name = "page_id")
    private int pageId;
}

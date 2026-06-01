package com.pali.palindromebackend.dao;

import com.pali.palindromebackend.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 17/06/2021
 **/
public interface CommunityDAO extends JpaRepository<Community,Integer> {

}

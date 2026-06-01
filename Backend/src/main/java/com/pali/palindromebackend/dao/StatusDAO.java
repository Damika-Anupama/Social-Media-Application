package com.pali.palindromebackend.dao;


import com.pali.palindromebackend.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 18/06/2021
 **/
public interface StatusDAO extends JpaRepository<Status, Integer> {

}

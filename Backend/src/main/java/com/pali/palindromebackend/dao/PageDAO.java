package com.pali.palindromebackend.dao;

import com.pali.palindromebackend.entity.Page;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 18/06/2021
 **/
public interface PageDAO extends JpaRepository<Page, Integer> {
}

package com.pali.palindromebackend.dao;

import com.pali.palindromebackend.entity.CommunityLaunch;
import com.pali.palindromebackend.entity.CommunityLaunchPK;
import com.pali.palindromebackend.model.CommunityLaunchDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/17/2022
 **/
public interface CommunityLaunchDAO extends JpaRepository<CommunityLaunch, CommunityLaunchPK> {
    @Query("select new com.pali.palindromebackend.model.CommunityLaunchDetail (" +
            "l.id," +
            "l.media," +
            "l.mediaType," +
            "l.description," +
            "l.feeling," +
            "u.id," +
            "u.username," +
            "u.shortDescription," +
            "u.profilePicture," +
            "u.onlineStatus," +
            "l.updatedDate," +
            "l.createdDate," +
            "cu.existingStatus," +
            "cu.sharedPersonId," +
            "cu.sharedTime" +
            ") " +
            "from CommunityLaunch cu join cu.pk.launch l join cu.pk.launch.user u " +
            "where cu.pk.community.communityId like ?1")
    List<CommunityLaunchDetail> findAllByCommunityId(int comId);
}

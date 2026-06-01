package com.pali.palindromebackend.business.util;

import com.pali.palindromebackend.dao.UserDAO;
import com.pali.palindromebackend.entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 29/04/2021
 **/
@Service
public class MyUserDetailsService implements UserDetailsService {
    private final UserDAO userDAO;

    public MyUserDetailsService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userDAO.findUserByUsername(username);
        return user.map(MyUserDetail::new)
                .orElseThrow(() -> new UsernameNotFoundException(username+" cannot find"));
    }
}

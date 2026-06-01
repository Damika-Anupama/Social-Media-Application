package com.pali.palindromebackend.business.util;

import com.pali.palindromebackend.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 29/05/2021
 **/
public class MyUserDetail implements UserDetails {

    private final String username;
    private final String password;
    private final boolean isActive;
    private final int id;
    private final List<GrantedAuthority> authorities;

    public MyUserDetail(User user) {
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.isActive = user.getIsActive();
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority(user.getRole().toString()));
        this.id = user.getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public int getId() {
        return id;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }
}

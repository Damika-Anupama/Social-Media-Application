package com.pali.palindromebackend.util;

import com.pali.palindromebackend.business.util.MyUserDetailsService;
import com.pali.palindromebackend.filter.JWTRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 29/04/2021
 **/
@EnableWebSecurity
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final MyUserDetailsService myUserDetailsService;
    private final JWTRequestFilter jwtRequestFilter;

    public SecurityConfig(MyUserDetailsService myUserDetailsService, JWTRequestFilter jwtRequestFilter) {
        this.myUserDetailsService = myUserDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(myUserDetailsService);
    }

    @Override
    protected void configure(HttpSecurity http){
        try {
            http.csrf().disable().authorizeRequests()
                    .antMatchers("/api/v1/authenticate").permitAll()
                    .antMatchers(HttpMethod.POST,"/api/v1/users").permitAll()
                    .antMatchers(HttpMethod.GET,"/api/v1/users/name/**").permitAll()
                    .antMatchers(HttpMethod.GET,"/api/v1/sendSMS").permitAll()
                    .antMatchers(HttpMethod.GET,"/api/v1/users/email/**").permitAll()
                    .antMatchers(HttpMethod.OPTIONS,"/**").permitAll()
                    .anyRequest().authenticated()
                    .and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        } catch (Exception e) {
            System.out.println("Error in SecurityConfig.java");
            e.printStackTrace();
        }
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    @Bean
    protected AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}

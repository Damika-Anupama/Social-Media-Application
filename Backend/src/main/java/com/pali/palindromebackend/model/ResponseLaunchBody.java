package com.pali.palindromebackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.core.io.ByteArrayResource;

import java.io.Serializable;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 08/06/2021
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseLaunchBody implements Serializable {
    private byte[] file;
    private String description;
    private String feeling;
}

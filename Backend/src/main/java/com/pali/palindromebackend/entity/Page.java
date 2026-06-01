package com.pali.palindromebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import net.bytebuddy.implementation.bind.annotation.Super;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.Date;
import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 18/06/2021
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "page")
public class Page implements SuperEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "page_id")
    private int PageId;
    @NotEmpty(message = "This shouldn't be empty and this should be unique")
    private String name;
    private String description;
    @Column(name = "created_date")
    private Date createdDate;
    @Column(name = "last_updated")
    private Date lastUpdated;

    @Setter(AccessLevel.NONE)
    @ManyToMany
    @JoinTable(name = "user_page",
            joinColumns = @JoinColumn(name = "page_id", referencedColumnName = "page_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"))
    private List<User> users;

    public Page(int pageId, String name, String description, Date createdDate, Date lastUpdated) {
        PageId = pageId;
        this.name = name;
        this.description = description;
        this.createdDate = createdDate;
        this.lastUpdated = lastUpdated;
    }
}

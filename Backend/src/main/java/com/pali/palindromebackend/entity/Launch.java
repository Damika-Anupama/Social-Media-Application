package com.pali.palindromebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 01/06/2021
 **/
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Entity
@Table(name = "launch")
public class Launch implements SuperEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String media;
    @Column(name = "media_type")
    private String mediaType;
    private String description;
    private String feeling;
    @Column(name = "created_date")
    private Date createdDate;
    @Column(name = "updated_date")
    private Date updatedDate;

    @JsonIgnoreProperties("launches")
    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "user_id",referencedColumnName = "id",nullable = false)
    private User user;

    @OneToMany(mappedBy = "launch")
    @JsonIgnoreProperties("launch")
    @Setter(AccessLevel.NONE)
    private List<Comment> comments;

    @OneToMany(mappedBy = "launch")
    @JsonIgnoreProperties("launch")
    @Setter(AccessLevel.NONE)
    private List<Share> shares;

    @Setter(AccessLevel.NONE)
    @JsonIgnoreProperties("launch")
    @OneToMany(mappedBy = "launch")
    private List<Reaction> reactions;

    public Launch(int id, String media, String mediaType, String description, String feeling, Date createdDate, Date updatedDate, User user) {
        this.id = id;
        this.media = media;
        this.mediaType = mediaType;
        this.description = description;
        this.feeling = feeling;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.user = user;
    }
}

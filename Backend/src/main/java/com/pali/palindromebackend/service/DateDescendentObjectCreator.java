package com.pali.palindromebackend.service;

import com.pali.palindromebackend.entity.ObjectType;
import com.pali.palindromebackend.model.DashboardLaunchDetail;
import com.pali.palindromebackend.model.DateDescendObject;
import com.pali.palindromebackend.model.RequiredFriendDetailObject;
import com.pali.palindromebackend.model.ResponseCommunityBody;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/17/2022
 **/
@Service
public class DateDescendentObjectCreator {
    public void sort(List<DateDescendObject> list)
    {
        int n = list.size();

        // Build heap (rearrange array)
        for (int i = n / 2 - 1; i >= 0; i--)
            heapify(list, n, i);

        // One by one extract an element from heap
        for (int i = n - 1; i > 0; i--) {
            // Move current root to end
            DateDescendObject temp = list.get(0);
            list.set(0,list.get(i));
            list.set(i,temp);

            // call max heapify on the reduced heap
            heapify(list, i, 0);
        }
    }
    // To heapify a subtree rooted with node i which is
    // an index in arr[]. n is size of heap
    void heapify(List<DateDescendObject> list, int n, int i)
    {
        int latest = i; // Initialize latest as root
        int l = 2 * i + 1; // left = 2*i + 1
        int r = 2 * i + 2; // right = 2*i + 2

        // If left child is larger than root
        if (l < n && list.get(l).getCreatedDate().before(list.get(latest).getCreatedDate()))
            latest = l;

        // If right child is larger than latest so far
        if (r < n && list.get(r).getCreatedDate().before(list.get(latest).getCreatedDate()))
            latest = r;

        // If latest is not root
        if (latest != i) {
            DateDescendObject swap = list.get(i);
            list.set(i,list.get(latest));
            list.set(latest,swap);

            // Recursively heapify the affected subtree
            heapify(list, n, latest);
        }
    }

    public List<DateDescendObject> giveDateDescendentObjet(
            ArrayList<DashboardLaunchDetail> launches,
            ArrayList<ResponseCommunityBody> communities,
            ArrayList<RequiredFriendDetailObject> friends
    ) {
        List<DateDescendObject> dateDescendObjects = new ArrayList<>();

        // converting all the launch, community, friend objects in to
        // DateDescendingObjects and add to the DateDescendObject Arraylist
        communities.forEach(community -> {
            DateDescendObject dateDescendObject = new DateDescendObject();

            dateDescendObject.setCreatedDate(community.getCreatedDate());
            dateDescendObject.setType(ObjectType.COMMUNITY);
            dateDescendObject.setId(community.getCommunityId());

            dateDescendObject.setTitle(community.getTitle());
            dateDescendObject.setCommunityDescription(community.getDescription());
            dateDescendObject.setGroupIcon(community.getGroupIcon());
            dateDescendObject.setWallpaper(community.getWallpaper());

            dateDescendObjects.add(dateDescendObject);
        });
        friends.forEach(friend -> {
            DateDescendObject dateDescendObject = new DateDescendObject();

            dateDescendObject.setCreatedDate(friend.getCreatedDate());
            dateDescendObject.setId(friend.getFriendId());
            dateDescendObject.setType(ObjectType.FRIEND);

            dateDescendObject.setFriendUsername(friend.getUsername());
            dateDescendObject.setAsked(friend.getAsked());
            dateDescendObject.setProfilePicture(friend.getProfilePicture());

            dateDescendObjects.add(dateDescendObject);
        });
        launches.forEach(launch -> {
            DateDescendObject object = new DateDescendObject();

            object.setCreatedDate(launch.getCreatedDate());
            object.setType(ObjectType.LAUNCH);
            object.setId(launch.getLaunchId());

            object.setFile(launch.getFile());
            object.setMediaType(launch.getMediaType());
            object.setLaunchDescription(launch.getDescription());
            object.setFeeling(launch.getFeeling());
            object.setUserId(launch.getUserId());
            object.setFriendUsername(launch.getUserName());
            object.setShortDescription(launch.getShortDescription());
            object.setUserprofilePicture(launch.getProfilePicture());
            object.setUpdatedTime(launch.getUpdatedTime());
            object.setReactions(launch.getReactions());
            object.setComments(launch.getComments());

            dateDescendObjects.add(object);
        });

        // Use heap sort algorithm to sort all the objects in dateDescendantObject arraylist

        dateDescendObjects.forEach(o -> {
                    System.out.print(o.getCreatedDate());
                    System.out.print(" - ");
                    System.out.println(o.getType());
                }
        );
        System.out.println("---------------------------------------");
        DateDescendentObjectCreator creator = new DateDescendentObjectCreator();
        creator.sort(dateDescendObjects);
        dateDescendObjects.forEach(o -> {
                    System.out.print(o.getCreatedDate());
                    System.out.print(" - ");
                    System.out.println(o.getType());
                }
        );
//        return null;
        return dateDescendObjects;
    }
}

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 07/18/2022
 **/

import { LaunchComment } from "./LaunchComment";
import { LaunchReaction } from "./LaunchReaction";
import { onlineStatus } from "./OnlineStatus";
import { ProfileObjectType } from "./ProfileObjectType";

export interface DateDescendObject {
    createdDate: string;
    type: string;
    id: number;
    // from community
    title: string;
    communityDescription: string;
    groupIcon: File;
    wallpaper: File;
    //from friend
    friendusername: string;
    asked: boolean; // whether the friend requested and you accepted or you asked friend accepted
    profilePicture: File;
    //from launch
    file: File;
    mediaType: string;
    launchDescription: string;
    feeling: string;
    userId: Number;
    userName: string;
    shortDescription: string;
    userprofilePicture: File;
    userOnlineStatus:onlineStatus;
    updatedTime: Date;
    reactions: LaunchReaction[];
    comments: LaunchComment[];
}

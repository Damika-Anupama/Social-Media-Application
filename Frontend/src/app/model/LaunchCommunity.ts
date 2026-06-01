/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 07/17/2022
 **/

 import { LaunchComment } from "./LaunchComment";
 import { LaunchReaction } from "./LaunchReaction";
import { onlineStatus } from "./OnlineStatus";
 
 export interface LaunchCommunity {
   launchId: Number;
   file: File;
   mediaType: string;
   description: string;
   feeling: string;
   userId: number;
   userName: string;
   shortDescription: string;
   profilePicture: string;
   userOnlineStatus: onlineStatus;
   updatedTime: Date;
   createdDate: Date;
   reactType: string;
   reactions: LaunchReaction[];
   comments: LaunchComment[];
   // details relevant to the community
   existingStatus: string,
   sharedPersonId: Number,
   sharedTime: Date
 }
 
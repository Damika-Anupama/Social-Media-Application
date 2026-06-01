/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 13/07/2022
 **/

 export interface LaunchReaction {
    id: Number;
    ReactionType: string;
    reactionTime: Date;
    updatedTime: Date;
    userId: number;
    userName: string;
    userImage: File;
    userOnlineStatus: boolean;
  }
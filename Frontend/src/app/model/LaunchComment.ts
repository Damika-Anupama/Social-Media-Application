/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 13/07/2022
 **/

 export interface LaunchComment {
    id: Number;
    comment: string;
    commentedDate: Date;
    lastUpdatedDate: Date;
    userId: number;
    userName: string;
    userImage: File;
    userOnlineStatus: boolean;
  }
  
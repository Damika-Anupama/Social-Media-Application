/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 07/17/2022
 **/

import { onlineStatus } from "./OnlineStatus";

 export interface miniUserCom {
    userId: number;
    username: string;
    shortDescription: string;
    profilePicture: File;
    onlineStatus: onlineStatus;
    joinedDate: Date;
    updatedDate: Date;
    role: string;
  }
  
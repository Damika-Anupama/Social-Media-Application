/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 18/06/2021
 **/

export class Suggestion {
  constructor(
  public feeling: string,
  public id: number,
  public message: string,
  public priority: string,
  public profilePicture: string,
  public userId: number,
  public username: string
  ) {
  }


}

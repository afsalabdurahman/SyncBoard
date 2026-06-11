

export const dataMap=(data)=>{
    const status=data.status=="InActive"?true:false
    return {
        name:data.name,
        role:"Admin",
        isBlock:status,
        isDelete:status,
        imageUrl:data.avatar,
       // address:data.address,
       // title:data.title,
        //location:data.location,
        email:data.email,
      
        phone:data.phone,
        about:data.bio


    }
}
export interface UserDetailsResponseDto {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  phone: string;
  location: string;
  joinedAt: Date;

  workspaces: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    status: string;
    isOwner: boolean;
    membersCount: number;
  }[];
}
import { useEffect, useState } from "react";
import { MembersInterface } from "../ChannelMembers";
import { ChannelInterface } from "../../../../Context/user";



export default function useGetMembers({chat}:{chat: ChannelInterface}) {
    const [members, setMembers] = useState<MembersInterface[]>([]);
    const [bannedMembers, setBannedMembers] = useState<{ username: string, image: string }[]>([]);
    const [muteMembers, setMuteMembers] = useState<{ username: string, image: string }[]>([]);

    const fetchMembers = async () => {
        try {
          const response = await fetch(`http://localhost:4000/groups/members/${chat.id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
              }
            })
          const data = await response.json();
          // setMembers(data.members);
          // setAdmins(data.admins);
          // setOwner(data.owner);
          setBannedMembers(data.banned);
          setMuteMembers(data.muted);
          const mem: MembersInterface[] = data.members.map((member: MembersInterface) => {
            return {
              username: member.username,
              image: member.image,
              role: data.owner.username === member.username ? 'Owner' : data.admins.find((admin: any) => admin.username === member.username) ? 'Admin' : 'Member'
            }
          }
          );
          mem.sort((a, b) => {
            if (a.role === 'Owner') {
              return -1;
            }
            if (a.role === 'Admin' && b.role === 'Member') {
              return -1;
            }
            if (a.role === 'Member' && b.role === 'Admin') {
              return 1;
            }
            return 0;
          }
          );
          //console.log("members : ", mem);
          setMembers(mem);
        } catch (error) {
          //console.log('error:', error);
        }
      }

      useEffect(() => {
        fetchMembers();
      }
        , []);

      return { fetchMembers, members, bannedMembers, muteMembers, setBannedMembers, setMuteMembers, setMembers };

}
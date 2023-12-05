import { makeAutoObservable } from 'mobx';
import MessageService from '../service/MessageService';
import ProfileService from '../service/ProfileService';
import UserService from '../service/UserService';
import { IUser } from '../models/IUser';
import { FriendsResponse } from '../models/response/FriendsResponse';
import { Friend } from '../models/Friend';

export default class UserStore {
    user: IUser | null = null
    users: IUser[] = []
    friends: FriendsResponse[] = [] 
    userSearch: string = ''
    usersImg: string[] = []
    loading: boolean = true

   constructor() {
    makeAutoObservable(this);
  }

  setUser(user: IUser) {
    this.user = user
  }

  setUsers(users: IUser[]) {
    this.users = users
  }

  setUserSearch(userSearch: string) {
    this.userSearch = userSearch
  }

  setUsersImg(usersImg: string[]) {
    this.usersImg = usersImg
  }

  setFriends(friends: FriendsResponse[]) {
    this.friends = friends
  }

  setLoading(loading: boolean) {
    this.loading = loading
  }

  async getUser(userId: string) {
    try {
      const userData = await UserService.getUser(userId)
      this.setUser(userData.data)
    } catch(e){}
  }

  async usersSearch(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      this.setLoading(true)
      const searchValue = e.target.value;
          this.setUserSearch(searchValue);
          if (searchValue) {
              const response = await UserService.searchUsers(searchValue);
              const profileData = response.data.map(async (user: IUser) => {
                const profile = await ProfileService.getProfile(user.id)
                return profile.data.img
              })

              const profile = await Promise.all(profileData)

              this.setUsersImg(profile)
              this.setUsers(response.data);
          }
          else this.setUsers([]);
          this.setLoading(false)
    } catch(e) {}
  }

  async FriendsData(senderId: any) {
    try {
      const receiver = await MessageService.getFriend(senderId);
      const promises = receiver?.data?.map(async (user: string) => {
        const lastMessage = await MessageService.getMessage(user, senderId)
        return lastMessage
      })

      const lastMessages = await Promise.all(promises)

      const friends = await UserService.getUsers(receiver)
      const friendsPromises = friends.data.map(async (friend: Friend) => {
        const lastMessageFriend = lastMessages.filter((last, index) => (friend.id === receiver.data[index])  ).map((last) => last)

        const profileFriend = await ProfileService.getProfile(friend.id)
        const active = profileFriend.data.active
        const img = profileFriend.data.img

        return {
          active,
          ...friend,
          lastMessageFriend: lastMessageFriend.length > 0 ? lastMessageFriend : null,
          img: img === undefined ? null : img,
        }
      });

      const formattedFriends = await Promise.all(friendsPromises);

      this.setLoading(false)
      this.setFriends(formattedFriends)
    } catch (e) { }
  }

}
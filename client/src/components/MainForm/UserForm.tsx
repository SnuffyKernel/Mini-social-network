import {FC, useContext, useEffect, useState} from "react"
import { Context } from "../../index"
import { observer } from 'mobx-react-lite'
import style from '../../css/MainForm.module.css'
import LoadingFriend from "./Loading/LoadingFriend"
import avatar from "../../img/mqdefault.jpg"
import editing from "../../img/editing.svg"

interface UserFormProps {
  handleDialogToggle: (userNick: string, userImg: string, userId: string) => void;
  showOptions: boolean
  setScroll: React.Dispatch<React.SetStateAction<boolean>>;
  setGetMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setShowOptions:React.Dispatch<React.SetStateAction<boolean>>;
}

const UserForm: FC<UserFormProps> = ({ handleDialogToggle, setScroll, setGetMessage, showOptions, setShowOptions }) => {
    const [isDelChatHovered, setIsDelChatHovered] = useState(false);

    const {store, userStore, profileStore, messageStore} = useContext(Context)
    const senderId = store.user.id; 
    const myImg = profileStore.myImg

    useEffect(() => {
      const handleBeforeUnload = async (userId: string, active: boolean) => {
        await profileStore.checkActive(userId, active);
      };

      handleBeforeUnload(senderId, true);

      window.addEventListener("beforeunload", () =>
        handleBeforeUnload(senderId, false)
      );

      return () => {
        window.removeEventListener("beforeunload", () =>
          handleBeforeUnload(senderId, false)
        );
      };
    });

    useEffect(() => {
      userStore.setLoading(true);
      userStore.FriendsData(senderId);
      const intervalId = setInterval(async () => {
        await profileStore.checkBan(senderId);
        if (!showOptions) {
          userStore.FriendsData(senderId);
        }
      }, 5000);

      return () => clearInterval(intervalId);
    }, [showOptions, senderId]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const profile = await profileStore.getProfile(senderId);
          if(profile) {
            profileStore.setMyImg(profile.img);
            profileStore.setMyStatus(profile.status)
            if (!profileStore.myImg || !profileStore.myStatus) {
              setTimeout(async () => {
                const replayProfile = await profileStore.getProfile(senderId);
                if (replayProfile) {
                  profileStore.setMyImg(replayProfile.img);
                  profileStore.setMyStatus(replayProfile.status);                 
                }
              }, 500)
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };

      fetchData();
    }, [senderId]);

    return (
            <div className={style.ButtonContainer}>
                <div className={style.aroundUser}>
                    {myImg ? (
                            <img className={style.avatar} src={myImg}/>
                        ) : (
                            <img className={style.avatar} src={avatar}/>
                        )
                    }   
                    <div className={style.columnUser}>
                        <h1 className={style.UserAuth}>{store.isAuth ? `${store.user.nickname}`: 'Авторизуйтесь'}</h1>
                        <div className={style.EditingWrapper}>
                            <div className={style.Editing} onClick={() => { setShowOptions(true); setScroll(true)}}>
                                <img src={editing}></img>
                            </div>
                        </div>
                        <h1 className={style.MyStatus}>{profileStore.myStatus 
                          ? profileStore.myStatus.length > 26 
                            ? `${profileStore.myStatus.slice(0, 26)}...`
                            : profileStore.myStatus 
                          : (`Статус пользователя`)}</h1>
                    </div>
                </div>
                <div>
                    <input className={style.SearchUser} placeholder="Поиск..." value={userStore.userSearch} maxLength={25} onChange={(e) =>userStore.usersSearch(e)}/>
                </div>
                <div className={style.aroundSearchUsers}>
                    {!userStore.loading ? (userStore.userSearch ? (
                        Array.isArray(userStore.users) && userStore &&
                        userStore.users.map((user, index) => (
                            <div className={style.aroundSearch} onClick={() => 
                              {
                                handleDialogToggle(
                                  user.nickname,
                                  userStore.usersImg[index] ? userStore.usersImg[index] : avatar, 
                                  user.id
                                ); 
                                setScroll(true);
                              }} 
                              key={index}
                            >
                                <img className={style.avatar} src={userStore.usersImg[index] ? userStore.usersImg[index] : avatar}/>
                                <div className={style.columnSearch}>
                                    <div className={style.UserAuth} key={user.nickname}>{user.nickname}</div>
                                    <h1 className={style.Status}>#{user.login}</h1>
                                </div>
                            </div>
                        ))) : (
                        userStore.friends.map((friend: any, index: number) => {
                            return (
                                <div  
                                    className={`${style.aroundSearch} ${isDelChatHovered ? style.aroundSearchNonHover : style.aroundSearchHover}`} 
                                    onClick={() => { 
                                        handleDialogToggle(friend.nickname, friend.img, friend.id); 
                                        setScroll(true); 
                                        setGetMessage(true) 
                                    }} 
                                    key={index}>

                                    {friend.img ? (
                                        <img className={style.avatar} src={friend.img}/>
                                    ) : (
                                        <img className={style.avatar} src={avatar}/>
                                    )}
                                    <div className={style.columnSearch}>
                                        <div className={style.UserAuth} key={friend.nickname}>{friend.nickname}</div>
                                        <div className={style.activeIndicator + (friend.active ? ' ' + style.online : ' ' + style.offline)}></div>
                                        <div className={`${style.delChatWrapper} ${isDelChatHovered ? style.delChatWrapperHovered : ''}`} 
                                            onMouseEnter={() => setIsDelChatHovered(true)}
                                            onMouseLeave={() => setIsDelChatHovered(false)}
                                            onClick={async () => 
                                                { 
                                                    await messageStore.delChat(friend.id, senderId); 
                                                    userStore.setLoading(true); 
                                                    await userStore.FriendsData(senderId); 
                                                }
                                            }>
                                            <div className={style.delChat}>✖</div>
                                        </div>
                                        <h1 className={style.Status}>
                                        {friend?.lastMessageFriend 
                                          ? friend.lastMessageFriend[0]?.data?.text?.length > 26
                                            ? `${friend.lastMessageFriend[0]?.data?.text.slice(0, 26)}...`
                                            : friend.lastMessageFriend[0]?.data?.text
                                          : "No messages"}
                                        </h1>
                                    </div>
                                </div>
                            )
                        })
                    )) : (
                         <div>
                            <LoadingFriend/>
                        </div>
                    )}
                </div> 
            </div>
    )
}

export default observer(UserForm)
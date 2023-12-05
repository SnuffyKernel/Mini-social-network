import { FC, useContext, useState, useEffect } from "react";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";
import backArrow from "../../img/backArrow.svg"
import style from "../../css/EditingFor.module.css"
import avatar from "../../img/mqdefault.jpg"
import FileUtils from "../../utils/fileUtils";
import pencil from "../../img/pencil.svg"
import checkMark from "../../img/checkMark.svg"
import Loading from "./Loading/Loading"

interface EditingFormProps {
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  receiverId: string
} 

const EditingForm: FC<EditingFormProps> = ({setShowOptions, receiverId}) => {

  const [status, setStatus] = useState<string>("")
  const [showButton, setShowButton] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { store, userStore, profileStore } = useContext(Context);

  const userId = store.user.id
  const myImg = profileStore.myImg
  const friendProfile = profileStore.friendProfile

  const fileUtils = new FileUtils(setShowButton, profileStore)

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
       try {
        if (friendProfile) {
          await userStore.getUser(receiverId);
          const profile = await profileStore.getProfile(receiverId);
          if(profile) {
            profileStore.setUserImg(profile.img)
            profileStore.setUserStatus(profile.status);
            setLoading(false);
          }
        } else {
          const profile = await profileStore.getProfile(userId);
          if (profile) {
            profileStore.setMyStatus(profile.status);
            setLoading(false);
          }
        }
       } catch (error) {
         console.error("Error fetching profile:", error);
       }
    };    
    fetchData();
  }, [userId]);

  return (
    <div>
      {!loading ? (
        <div>
        <div className={style.EditingWrapper}>
          <div className={style.Editing} onClick={() =>{setShowOptions(false); profileStore.setFriendProfile(false)}}>
            <img src={backArrow} alt="backArrow"></img>
          </div>
        </div>
        <div className={style.avatar}>
          { !friendProfile ? (
            <img className={style.avatarImg}  src={myImg ? myImg : avatar} alt="myImg"/>
          ) : (
            <img className={style.avatarImg}  src={profileStore.userImg ? profileStore.userImg : avatar} alt="userImg"/>
          )}
        </div>
        <div className={style.photoEditing}>
          <input
            type="file"
            accept="image/*"
            onChange={fileUtils.handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
            ref={(fileInput) => fileInput && fileInput.setAttribute("multiple", "false")}
          />
          {!friendProfile && 
            <div>
              {showButton ? (
                  <button className={style.photo} onClick={() => {document?.getElementById("fileInput")?.click();}} >Редактировать фото</button>
                ) : (
                  <button className={style.photo} onClick={async () => {await profileStore.uploadImg(userId) ; setShowButton(true);}}>Загрузить</button>
                )
              }
            </div> }
        </div>
        <div className={style.UserData}>
          <h1 className={style.UserNick}>{!friendProfile ? store.user.nickname : userStore.user?.nickname}</h1>
          <h1 className={style.UserLogin}>#{!friendProfile ? store.user.login : userStore.user?.login}</h1>
          {isEditing ? (
            <input
              className={style.inputStatus}
              type="text"
              onChange={(e) => setStatus(e.target.value)}
              maxLength={80}
              onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                  await profileStore.updateStatus(userId, status)
                  setIsEditing(false)
                }
              }} 
            />
          ) : (
            !friendProfile ? (
              <h1 className={style.UserStatus}>{profileStore.myStatus ? profileStore.myStatus : (`Статус пользователя`) }</h1>
            ) : (
              <h1 className={style.UserStatus}>{profileStore.userStatus ? profileStore.userStatus : (`Статус пользователя`) }</h1>
            )
          )}
          {!friendProfile &&
            <div className={style.buttons}>
              {isEditing ? (
                <div className={style.edit} onClick={async () => {await profileStore.updateStatus(userId, status); setIsEditing(false);}}>
                  <img className={style.pencil} src={checkMark} alt="checkMark"/>
                </div>
              ) : (
                <div className={style.edit} onClick={() =>setIsEditing(true)} >
                  <img className={style.pencil} src={pencil} alt="pencil"/>
                </div>
              )}
            </div>
          }

          <div className={style.buttons}>
            {!friendProfile && 
              <button className={style.exit} onClick={async () => { await profileStore.checkActive(userId, false); store.logout()} }>Выйти</button>
            }
          </div>
        </div>
      </div>) : (
        <div>
          <Loading/>
        </div>
      )}
    </div>
  );
};

export default observer(EditingForm);

import {FC, useContext, useEffect, useRef} from "react";
import { Context } from "../../index";
import { observer } from 'mobx-react-lite';
import Loading from "./Loading/Loading"
import style from '../../css/MainForm.module.css'
import sendSvg from "../../img/send.svg"
import { format } from "date-fns";
import avatar from "../../img/mqdefault.jpg";

interface MessageFormProps {
  selectedUser: string;
  receiverId: string;
  img: string;
  showDialog: boolean;
  scroll: boolean;
  getMessage: boolean;
  setGetMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setScroll: React.Dispatch<React.SetStateAction<boolean>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessageForm: FC<MessageFormProps> = ({ selectedUser, showDialog, receiverId, img, scroll, setScroll, getMessage, setGetMessage, setShowOptions}) => {
    const {store, messageStore, userStore, profileStore} = useContext(Context)

    const senderId = store.user.id

    const messageContainerRef = useRef<HTMLDivElement>(null);
    let countUndefind = 0
    useEffect(() => {
    if (getMessage) {
        messageStore.setLoading(true);
        messageStore.setCheckChat(false);

        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await messageStore.getMessage(receiverId, senderId);
                countUndefind++;
                if (!response && countUndefind >= 2) {
                    messageStore.setCheckChat(false);
                }
                if (isMounted && response?.data && Array.isArray(response.data) ) {
                    await profileStore.getActiveProfile(receiverId);
                    messageStore.setMessages(response.data);
                    messageStore.setCheckChat(true);
                    countUndefind = 0
                }
            }
            finally {

                if (isMounted) {
                    messageStore.setLoading(false);
                    setTimeout(fetchData, 1000);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }

    }, [getMessage, receiverId, senderId]);

    useEffect(() => {    
        if (messageContainerRef.current) {
            if (messageContainerRef.current.scrollTop >=  messageContainerRef.current.scrollHeight - 810 || scroll) {
                messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
                setScroll(false)
            }
        }
    }, [messageStore.messages]);
  
    return (
            <div className={style.Dialog}>
                {showDialog && 
                <div>
                    {!messageStore.loading ? 
                    (
                        <div className={style.DialogForm}>
                            <div className={style.aroundMessage}>
                                <div className={style.profileUser} onClick={() => {profileStore.setFriendProfile(true); setShowOptions(true)}}>
                                    <img className={style.avatar} src={img ? img : avatar} />
                                    <div className={style.columnSearch}>
                                        <div className={style.UserAuth}>{selectedUser && selectedUser}</div>
                                        <h1 className={style.Status}>{profileStore.active ? "В сети" : "Не в сети"}</h1>
                                    </div>
                                </div>
                            {messageStore.checkChat ? (
                                <div>
                                    {Array.isArray(messageStore.messages) && messageStore && (
                                        <div ref={messageContainerRef} className={style.messageContainer}>
                                            {messageStore.messages.map((mess, index) =>
                                                <div  className={`${style.message} ${mess.sender === senderId ? style.sender : style.data}`} key={index}>
                                                    <div className={style.messageText}>{mess.text}</div>
                                                    <div className={style.messageTime}>{format(new Date(mess.createdAt), 'HH:mm')}</div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className={style.inputContainer}>
                                        <input 
                                            className={style.inputMessage} 
                                            value={messageStore.value} 
                                            onChange={e => messageStore.setValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    messageStore.sendMessage(receiverId, senderId);
                                                }
                                            }} 
                                            type="text" 
                                            placeholder="Введите ваше сообщение" 
                                            maxLength={100}
                                        />
                                        <button className={style.sendMessage} onClick={() =>messageStore.sendMessage(receiverId, senderId)}> 
                                            <img src={sendSvg} alt="Send" /> 
                                        </button>
                                    </div>
                                </div>
                                ) : (
                                <div>
                                    <button 
                                        className={style.createChat} 
                                        onClick={async () => 
                                        { 
                                            setGetMessage(true); 
                                            await messageStore.createChat(receiverId, senderId); 
                                            await userStore.FriendsData(senderId);
                                        }}
                                    >
                                        Начать диалог
                                    </button>
                                </div>
                            )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Loading/>
                        </div>
                    )}
                </div>
                }
            </div>
    )
}

export default observer(MessageForm)
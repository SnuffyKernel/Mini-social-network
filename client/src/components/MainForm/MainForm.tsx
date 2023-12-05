import {FC, useState} from "react";
import { observer } from 'mobx-react-lite';
import style from '../../css/MainForm.module.css'
import UserForm from "./UserForm";
import MessageForm from "./MessageForm";
import EditingForm from "./EditingForm";

const MainForm: FC = () => {
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [receiverId, setReceiverId] = useState<string>('');
    const [img, setImg] = useState<string>('')
    const [scroll, setScroll] = useState<boolean>(true);
    const [getMessage, setGetMessage] = useState<boolean>(false)
    const [showOptions, setShowOptions] = useState<boolean>(false)

    const handleDialogToggle = (userNick:string, userImg:string, receiverId: string) => {
        if (!showDialog) setShowDialog(!showDialog)
        setSelectedUser(userNick)
        setReceiverId(receiverId)
        setImg(userImg)
    };

    return (
        <div className={style.MainContainer}>
            {!showOptions ? (
                <>
                    <UserForm 
                        handleDialogToggle={handleDialogToggle} 
                        setScroll={setScroll} 
                        setGetMessage={setGetMessage} 
                        showOptions={showOptions} 
                        setShowOptions={setShowOptions}
                    />

                    <MessageForm 
                        selectedUser = {selectedUser} 
                        showDialog = {showDialog} 
                        receiverId = {receiverId} 
                        img = {img}
                        scroll={scroll} 
                        setScroll={setScroll} 
                        getMessage={getMessage} 
                        setGetMessage={setGetMessage}
                        setShowOptions={setShowOptions} 
                    />
                </>
            ) : (
                <EditingForm 
                    setShowOptions={setShowOptions}
                    receiverId={receiverId}
                />
            )}
        </div>
    )
}

export default observer(MainForm)
import {FC} from 'react'
import style from '../css/EmailActivForm.module.css'

const EmailActivForm: FC = () => {
    return(
        <div className={style.email_container}>
            <div className={style.isActivated}>
                <div className={style.activate_mail}><p>Подтвердите email</p></div>
                <div className={style.activate_mail_text}><p>Для продолжения, пожалуйста, подтвердите email.</p></div>
            </div>
        </div>
    )
}

export default EmailActivForm
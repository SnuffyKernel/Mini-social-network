import {FC, useState, useContext} from "react";
import { Context } from "../index";
import { observer } from 'mobx-react-lite';
import style from '../css/LoginForm.module.css';
import loginIco from "../img/loginIco.svg"
import passIco from "../img/passIco.svg"
import nickIco from "../img/nickIco.svg"
import mailIco from "../img/mailIco.svg"

const LoginForm: FC = () => {
    const [login, setLogin] = useState<string>('')
    const [nickname, setNickname] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [repeatPassword, setRepeatPassword] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [isLoginFormVisible, setLoginFormVisible] = useState<boolean>(true)
    const {store, profileStore} = useContext(Context)

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(e.target.value);
    }

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(e.target.value)
    }

    const handleLogin = async () => {
       try{ 
        await store.login(login, password);
       } catch(e){
        setErrorMessage('Неверный логин или пароль')
       }
    }

    const handleRegistration = async () => {
       try{ 
        if (!nickname) throw { response: { data: { message: 'Придумайте Никнейм' } } }
        if (!login) throw { response: { data: { message: 'Придумайте Логин' } } }
        if (!email) throw { response: { data: { message: 'Напишите почту' } } }
        if (password !== repeatPassword) throw { response: { data: { message: 'Пароли не совпадают' } } }
        else {
            await store.registration(login, nickname, email, password);
            const userId = store.user.id
            console.log(userId)
            await profileStore.createProfile(userId)
        }
       } catch(e:any){
        setErrorMessage(e.response?.data?.message)
       }
    }
    
    const toggleForms = () => {
        setLoginFormVisible(!isLoginFormVisible);
        setErrorMessage('')
    }

    return (
        <div className={style.login_registration_container}>
            <form id="login-form" style={{ display: isLoginFormVisible ? 'block' : 'none' }}>
                <div className={style.text_welcome}>
                    <div className={style.welcome_registration}><p>Добро пожаловать!</p></div>
                </div>
                <div className={style.form_group}>
                    <input
                        type="text"
                        placeholder="Логин"
                        value={login}
                        onChange={handleLoginChange}
                        maxLength={25}
                        required
                    />
                    <div className={style.block_icon}><img src={loginIco} alt=""/></div>
                </div>
                <div className={style.form_group}>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        maxLength={40}
                    />
                    <div className={style.block_icon}><img src={passIco} alt=""/></div>
                </div>
                <div className={style.form_group}><button type="button" onClick={handleLogin}>Войти</button></div>
                <div className={style.form_group}><button type="button" onClick={toggleForms}>Зарегистрироваться</button></div>
            </form>

            <form id="registration-form"  style={{ display: isLoginFormVisible ? 'none' : 'block' }}>
                 <div className={style.text_welcome}>
                    <div className={style.welcome_registration}><p>Добро пожаловать!</p></div>
                </div>
                <div className={style.form_group}>
                    <input 
                        type="text" 
                        placeholder="Придумай никнейм" 
                        value={nickname}
                        onChange={handleNicknameChange}
                        maxLength={25}
                        required/>
                    <div className={style.block_icon}><img src={nickIco} alt=""/></div>
                </div>
                <div className={style.form_group}>
                    <input 
                        type="text"
                        placeholder="Придумай логин" 
                        value={login} 
                        onChange={handleLoginChange} 
                        maxLength={25}
                        required/>
                    <div className={style.block_icon}><img src={loginIco} alt=""/></div>
                </div>
                <div className={style.form_group}>
                    <input
                        type="text"
                        placeholder="Введите свою почту"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        maxLength={40}
                    />
                    <div className={style.block_icon}><img src={mailIco} alt=""/></div>
                </div>
                <div className={style.form_group}>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        maxLength={40}
                    />
                    <div className={style.block_icon}><img src={passIco} alt=""/></div>
                </div>
                <div className={style.form_group}>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={repeatPassword}
                        onChange={handleRepeatPasswordChange}
                        required
                        maxLength={40}
                    />
                    <div className={style.block_icon}><img src={passIco}alt=""/></div>
                </div>
                <div className={style.form_group}><button type="button" id="register-button" onClick={handleRegistration}>Зарегистрироваться</button></div>
                <div className={style.form_group}><button type="button" id="login-form-button" onClick={toggleForms}>Войти</button></div>
            </form>     
            {errorMessage && <div className={style.error_message}>{`${errorMessage}`}</div>}
        </div>
    )
}

export default observer(LoginForm)
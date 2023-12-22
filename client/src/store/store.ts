import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../service/AuthService";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http/index";

export default class Store {
    user = {} as IUser
    isAuth = false
    isLoading = false

    constructor() {
        makeAutoObservable(this)
    }

    setAuth(bool: boolean){
        this.isAuth = bool
    }

    setUser(user: IUser){
        this.user = user
    }

    setLoading(bool: boolean){
        this.isLoading = bool
    }
    
    async login(login: string, password: string) {
        try{
            const response = await AuthService.login(login, password)
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            throw e
        }
    }

    async registration(login: string, nickname:string, email: string, password: string) {
        try{
            const response = await AuthService.registration(login, nickname, email, password)
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) { 
            throw e
        }
    }

    async logout() {
        try{
            await AuthService.logout()
            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUser({} as IUser)
        } catch (e) {}
    }

    async checkAuth(){
        this.setLoading(true)
        try{
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch(e){

        } finally {
            this.setLoading(false)
        }
    }
}
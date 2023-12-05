import {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Store from './store/store'
import MessageStore from './store/messageStore';
import UserStore from './store/userStore';
import ProfileStore from './store/profileStore'

interface State {
  store: Store
  messageStore: MessageStore
  userStore: UserStore
  profileStore: ProfileStore
}

const store = new Store()
const messageStore = new MessageStore()
const userStore = new UserStore()
const profileStore = new ProfileStore()

export const Context = createContext<State>({
  store, messageStore, userStore, profileStore
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Context.Provider value={{
    store, messageStore, userStore, profileStore
  }}>
    <App />
  </Context.Provider>
);


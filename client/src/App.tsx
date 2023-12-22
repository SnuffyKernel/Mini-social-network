import { useContext, useEffect} from 'react';
import { Context } from './index';
import { observer } from 'mobx-react-lite';

import LoginForm from './components/LoginForm';
import MainForm from './components/MainForm/MainForm';
import LoadingForm from './components/LoadingForm'
import EmailActivForm from './components/EmailActivForm';
import BanForm from './components/BanForm';

function App() {
  const {store, profileStore} = useContext(Context)

  useEffect(() => {
    if (localStorage.getItem("token")) {
    
      const fetchData = async () => { 
        await store.checkAuth();
        await profileStore.checkBan(store.user.id);
      }
      fetchData()
    }
  }, []);

  if (store.isLoading){
    return (
      <div>
        <LoadingForm/>
      </div>
    )
  }

  if(!store.isAuth){
    return (
      <div>
        <LoginForm/>
      </div>
    )
  }
  
  if(!store.user.isActivated){
    return (
      <div>
        <EmailActivForm/>
      </div>
    )
  }

  if(profileStore.ban) {
    return (
      <div>
        <BanForm />
      </div>
    );
  }

  return (
    <div>
      <MainForm/>
    </div>
  )
}


export default observer(App);

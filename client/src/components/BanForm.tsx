import { FC } from "react";
import style from "../css/EmailActivForm.module.css";

const BanForm: FC = () => {
  return (
    <div className={style.email_container}>
      <div className={style.isActivated}>
        <div className={style.activate_mail}>
          <p>БАН</p>
        </div>
        <div className={style.activate_mail_text}>
          <p>Вы забанены за спам!!!</p>
        </div>
      </div>
    </div>
  );
};

export default BanForm;

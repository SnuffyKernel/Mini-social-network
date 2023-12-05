import {FC} from 'react'
import style from "../css/LoadingForm.module.css"

const LoadingForm: FC = () => {
    return(
        <div className={style.loader}>
            <div className={style.loader_inner}>
                <div className={style.loader_line_wrap}>
                    <div className={style.loader_line}></div>
                </div>
                <div className={style.loader_line_wrap}>
                    <div className={style.loader_line}></div>
                </div>
                <div className={style.loader_line_wrap}>
                    <div className={style.loader_line}></div>
                </div>
                <div className={style.loader_line_wrap}>
                    <div className={style.loader_line}></div>
                </div>
                <div className={style.loader_line_wrap}>
                    <div className={style.loader_line}></div>
                </div>
            </div>
        </div>
    )
}

export default LoadingForm
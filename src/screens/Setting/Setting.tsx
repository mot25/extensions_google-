import React, { useState } from 'react';

import { SimpleButton } from '../../componets/simple/SimpleButton';
import styles from './Setting.module.scss';
import ArrowBack from '../../assets/icon/Icon_arrowLeft.svg'
import { AllowUrl } from '../AllowUrl';
type Props = {}

const Setting = (props: Props) => {
    const pageRoute = {
        'addPortal': <AllowUrl />
    }
    type keyPageType = keyof typeof pageRoute | ''
    const [selectPage, setSelectPage] = useState<keyPageType>('')
    return (
        <div className={styles.wrapper}>
            <div className={styles.head}>
                {selectPage && <div
                    className={styles.left}
                    onClick={() => setSelectPage('')}
                >
                    <ArrowBack />
                </div>}
                <h1>Настройки</h1>
            </div>
            {selectPage ?
                pageRoute[selectPage] || <AllowUrl />
                :
                <div>
                    <SimpleButton
                        onClick={() => setSelectPage('addPortal')}
                        text='Посмотреть настройки расширения'
                    />
                </div>}

        </div>
    )
}

export default Setting
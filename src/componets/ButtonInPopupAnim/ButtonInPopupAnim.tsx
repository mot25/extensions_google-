// import { createElementNode } from '../../utils/components';
import classNames from 'classnames';
import React from 'react';

import styles from './ButtonInPopupAnim.module.scss';

type Props = { text: string, onClick: VoidFunction }

const ButtonInPopupAnim = ({ onClick, text }: Props) => {
    return (
        <div onClick={onClick} className={classNames(styles.buttonActions, 'buttonActions', styles.reverse, styles.dark)}>
            <div>
                <span>
                    {text.trim().split('').join('</span><span>')}
                </span>
            </div>
        </div>
    )
}

export default ButtonInPopupAnim
// import { createElementNode } from '../../utils/components';
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

import styles from './ButtonInPopupAnim.module.scss';

type Props = { text: string, onClick: VoidFunction }
// const ButtonInPopupAnim = ({ text, onClick }: { text: string, onClick: VoidFunction }) => {
//     const $button = createElementNode('div', [styles.buttonActions, 'buttonActions', styles.reverse, styles.dark])
//     $button.innerHTML = '<div><span>' + text.trim().split('').join('</span><span>') + '</span></div>'
//     // button actions
//     // button actions
//     $button.onclick = onClick
//     return $button
// }

const ButtonInPopupAnim = ({ onClick, text }: Props) => {
    const refPlaceText = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        if (!refPlaceText.current) return
        refPlaceText.current.innerHTML = text.trim().split('').join('</span><span>')
    }, [text])
    return (
        <div onClick={onClick} className={classNames(styles.buttonActions, 'buttonActions', styles.reverse, styles.dark)}>
            <div>
            {text}
            </div>
        </div>
    )
}

export default ButtonInPopupAnim
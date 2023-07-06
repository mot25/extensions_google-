import React from 'react';
import { createElementNode } from '../../utils/components';
import styles from './SimpleButton.module.scss';

type Props = {
    onClick: VoidFunction
    text: string
}
const SimpleButton = ({ onClick, text }: Props) => {
    // const $button = createElementNode('div', [styles.button])
    // $button.innerHTML = `<span>${text}</span>`
    // $button.onclick = onClick
    // return $button
    return (
        <div onClick={onClick} className={styles.button}>
            <span>{text}</span>
        </div>
    )
}

export default SimpleButton
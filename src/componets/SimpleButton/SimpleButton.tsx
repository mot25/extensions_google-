import React, { CSSProperties, MouseEvent } from 'react';
import { createElementNode } from '../../utils/components';
import styles from './SimpleButton.module.scss';
import classNames from 'classnames';

type Props = {
    onClick: (e:MouseEvent) => void
    text: string
    wd?: string
    bg?: string
    addStyle?: CSSProperties,
    addClassName?: string,
}
const SimpleButton = ({
    onClick,
    text,
    wd = '100%',
    bg = '#31556f',
    addStyle,
    addClassName
}: Props) => {
    return (
        <div
        style={{
            width: wd,
            backgroundColor: bg,
            ...addStyle
        }}
            onClick={(event) => onClick(event)}
            className={classNames(styles.button, addClassName)}
        >
            <span>{text}</span>
        </div>
    )
}

export default SimpleButton
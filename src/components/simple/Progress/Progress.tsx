import React, { useEffect, useState } from 'react'
import styles from './Progress.module.scss'
type Props = {}

const Progress = ({ done }: { done: number }) => {
    const [style, setStyle] = useState({});

    useEffect(() => {
            const newStyle = {
                opacity: 1,
                width: `${done}%`
            }

            setStyle(newStyle);
    }, [done])

    return (
        <div className={styles.progress}>
            <div className={styles.progressDone} style={style}>
                {done}%
            </div>
        </div>
    )
}

export default Progress
import React, { useEffect, useState } from 'react';
import styles from './Progress.module.scss';
type Props = { done: number };

const Progress = ({ done }: Props) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const newStyle = {
      width: `${done}%`
    };

    setStyle(newStyle);
  }, [done]);

  return (
    <div className={styles.progress}>
      <div
        className={styles.progressDone}
        style={style}
      >
        {done}%
      </div>
    </div>
  );
};

export default Progress;

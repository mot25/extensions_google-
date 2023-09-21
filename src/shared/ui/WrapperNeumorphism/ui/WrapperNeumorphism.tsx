import React, { PropsWithChildren } from 'react';
import styles from './WrapperNeumorphism.module.scss';
type Props = PropsWithChildren;

const WrapperNeumorphism = ({ children }: Props) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default WrapperNeumorphism;

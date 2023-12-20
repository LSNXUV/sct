'use client'
import React from "react";

import styles from './balldance.module.scss'
import { useTheme } from "@/context/Theme/Theme";
import { CLayout } from "../Layout/Layout";

interface BalldanceParams {
}

const BalldanceLoading: React.FC<BalldanceParams> = ({ }) => {
    const Theme = useTheme()

    return (
        <CLayout>
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.circle}></div>
                    <div className={styles.circle}></div>
                    <div className={styles.circle}></div>
                    <div className={styles.shadow} style={{
                        ...(Theme.CurTheme === 'dark' ? { backgroundColor: '#85ACF3' } : {})
                    }}></div>
                    <div className={styles.shadow}
                        style={{
                            ...(Theme.CurTheme === 'dark' ? { backgroundColor: '#84FAB1' } : {})
                        }}
                    ></div>
                    <div className={styles.shadow}
                        style={{
                            ...(Theme.CurTheme === 'dark' ? { backgroundColor: '#8ED4F1' } : {})
                        }}
                    ></div>
                    <div className={styles.text}></div>
                </div>
            </div>
        </CLayout>
    );
}
export default BalldanceLoading;

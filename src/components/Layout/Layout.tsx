import { Layout as ALayout } from "antd"
import styles from './layout.module.scss'

/**
 * 自定义Layout容器，基于antd的Layout
 * 水平垂直居中
 */
export const CLayout: RFWC = ({ children }) => {
    return (
        <ALayout className={styles.center}>
            {children}
        </ALayout>
    )
}

/**
 * 自定义Layout容器，基于antd的Layout
 * 
 */

export const FLayout: RFWC = ({ children }) => {
    return (
        <ALayout className={styles.full}>
            {children}
        </ALayout>
    )
}
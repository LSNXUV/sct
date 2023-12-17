
/**
 * React.FC with children
 * React函数组件，带有children
 */
type RFWC = React.FC<React.PropsWithChildren<{}>>;

/**
 * React.FC with children and props
 * React函数组件，带有children和props
 */
type RFWCP<P> = React.FC<React.PropsWithChildren<P>>;

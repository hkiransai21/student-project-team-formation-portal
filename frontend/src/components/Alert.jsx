export default function Alert({ type = 'error', children }) {
  return children ? <div className={`alert ${type}`} role="alert">{children}</div> : null;
}

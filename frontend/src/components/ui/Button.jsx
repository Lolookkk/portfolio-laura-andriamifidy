export default function Button({
  variant = 'outline',
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const variants = {
    outline: 'admin-btn',
    solid: 'admin-btn admin-btn--solid',
    danger: 'admin-btn admin-btn--danger',
    ghost: 'admin-btn admin-btn--ghost',
  };
  const classes = `${variants[variant] || variants.outline} ${className}`.trim();
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

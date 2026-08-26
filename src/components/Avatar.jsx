import { initials } from '../utils/normalize';

export default function Avatar({ src, name, className = '', style = {} }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'User avatar'}
        className={className}
        style={{ ...style, width: style.width ?? '100%', height: style.height ?? '100%' }}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        fontSize: '0.85rem',
        ...style,
      }}
    >
      {initials(name) || '?'}
    </div>
  );
}

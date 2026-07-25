import packageIcon from '@/assets/icons/package.svg';

function formatTimestamp(ts) {
  if (!ts) return '';
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NotificationItem({ notification, onMarkRead }) {
  const { id, message, created_at, is_read } = notification;

  function handleMarkRead() {
    if (!is_read && onMarkRead) {
      onMarkRead(id);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        backgroundColor: is_read ? '#fff' : '#f0f4ff',
        transition: 'background-color 0.2s',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: '36px',
          height: '36px',
          borderRadius: '9999px',
          backgroundColor: '#e0e7ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={packageIcon} alt="" width={18} height={18} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: '#111827',
            fontWeight: is_read ? 400 : 600,
            lineHeight: 1.4,
            wordBreak: 'break-word',
          }}
        >
          {message}
        </p>
        <span
          style={{
            display: 'block',
            marginTop: '0.25rem',
            fontSize: '0.75rem',
            color: '#9ca3af',
          }}
        >
          {formatTimestamp(created_at)}
        </span>
      </div>

      {!is_read && (
        <button
          type="button"
          aria-label="Mark notification as read"
          onClick={handleMarkRead}
          title="Mark as read"
          style={{
            flexShrink: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '9999px',
              backgroundColor: '#6366f1',
              display: 'block',
            }}
          />
        </button>
      )}
    </div>
  );
}

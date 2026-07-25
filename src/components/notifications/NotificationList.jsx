import NotificationItem from './NotificationItem';

export default function NotificationList({ notifications = [], onMarkRead }) {
  if (notifications.length === 0) {
    return (
      <div
        style={{
          padding: '2rem 1rem',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.875rem',
        }}
      >
        You have no notifications.
      </div>
    );
  }

  return (
    <ul
      role="list"
      aria-label="Notification list"
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        maxHeight: '400px',
        overflowY: 'auto',
      }}
    >
      {notifications.map((notification) => (
        <li key={notification.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
          <NotificationItem notification={notification} onMarkRead={onMarkRead} />
        </li>
      ))}
    </ul>
  );
}

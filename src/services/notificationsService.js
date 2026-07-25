import api from './api';

/**
 * GET /notifications
 */
export async function getNotifications(params) {
  const response = await api.get('/notifications', { params });
  return response.data;
}

/**
 * POST /notifications/:notificationId/read
 */
export async function markNotificationRead(notificationId) {
  const response = await api.post(`/notifications/${notificationId}/read`);
  return response.data;
}

/**
 * POST /notifications/read-all
 */
export async function markAllNotificationsRead() {
  const response = await api.post('/notifications/read-all');
  return response.data;
}

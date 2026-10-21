export class SuperAdminService {
  static async censorUser(userId: string, action: string, reason: string): Promise<any> {
    try {
      const response = await fetch('/api/super-admin/user/censor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ userId, action, reason })
      });
      return await response.json();
    } catch (error) {
      console.error('Error in censorUser:', error);
      throw error;
    }
  }

  static async resetPassword(userId: string, newPassword?: string): Promise<any> {
    try {
      const response = await fetch('/api/super-admin/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ userId, newPassword })
      });
      return await response.json();
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw error;
    }
  }

  static async manageContent(contentId: string, contentType: string, action: string): Promise<any> {
    try {
      const response = await fetch('/api/super-admin/content/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ contentId, contentType, action })
      });
      return await response.json();
    } catch (error) {
      console.error('Error in manageContent:', error);
      throw error;
    }
  }

  static async manageRoles(userId: string, role: string): Promise<any> {
    try {
      const response = await fetch('/api/super-admin/roles/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ userId, role })
      });
      return await response.json();
    } catch (error) {
      console.error('Error in manageRoles:', error);
      throw error;
    }
  }

  static async manageMicroservice(serviceName: string, action: string): Promise<any> {
    try {
      const response = await fetch('/api/super-admin/services/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ serviceName, action })
      });
      return await response.json();
    } catch (error) {
      console.error('Error in manageMicroservice:', error);
      throw error;
    }
  }
}

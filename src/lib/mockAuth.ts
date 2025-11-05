export type UserRole = 'customer' | 'barber';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export const mockAuth = {
  login: (email: string, password: string, role: UserRole): User | null => {
    // Mock authentication - in real app this would call backend
    if (password.length < 6) return null;
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role,
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  signup: (email: string, password: string, role: UserRole, name: string): User | null => {
    // Mock signup - in real app this would call backend
    if (password.length < 6) return null;
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role,
      name,
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

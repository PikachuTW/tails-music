import { atom, map } from 'nanostores';

export interface User {
  id: string;
  username: string;
  email: string;
}

export const isLoggedIn = atom<boolean>(false);

export const userInfo = map<Partial<User>>({});

export function login(user: User) {
  isLoggedIn.set(true);
  userInfo.set(user);
}

export function logout() {
  isLoggedIn.set(false);
  userInfo.set({});
} 
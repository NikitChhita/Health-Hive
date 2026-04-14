const AUTH_KEYS = ['token', 'user'];

const getStorageWithUser = () => {
  if (localStorage.getItem('user')) return localStorage;
  if (sessionStorage.getItem('user')) return sessionStorage;
  return null;
};

const getStorageWithToken = () => {
  if (localStorage.getItem('token')) return localStorage;
  if (sessionStorage.getItem('token')) return sessionStorage;
  return null;
};

export const getStoredUser = () => {
  const storage = getStorageWithUser();
  const storedUser = storage?.getItem('user');

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    storage.removeItem('user');
    return null;
  }
};

export const getStoredToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

export const persistAuth = ({ token, user, remember }) => {
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;

  otherStorage.removeItem('token');
  otherStorage.removeItem('user');

  storage.setItem('token', token);
  storage.setItem('user', JSON.stringify(user));
};

export const updateStoredUser = (user) => {
  const storage = getStorageWithUser() || getStorageWithToken();

  if (!storage) return;

  storage.setItem('user', JSON.stringify(user));
};

export const clearStoredAuth = () => {
  AUTH_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

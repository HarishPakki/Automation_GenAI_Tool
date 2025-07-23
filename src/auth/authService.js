export const loginUser = (username, password) => {
  if (username === 'a' && password === 'a') {
    sessionStorage.setItem('username', username);
    return true;
  }
  return false;
};

export const logoutUser = () => {
  sessionStorage.clear();
};

export const getLoggedInUser = () => {
  return sessionStorage.getItem('username');
};


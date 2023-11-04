export const checkUserAuthenticate = (setUserToken) => {
  const token = localStorage.getItem("user");
  if (token) {
    setUserToken(token);
  }
};

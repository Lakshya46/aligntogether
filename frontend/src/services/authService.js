import API from "./api";


export const registerUser = (userData) => {
  return API.post("/auth/register", userData);
};

export const loginUser = (credentials) => {
  return API.post("/auth/login", credentials);
};


export const logoutUser = () => {
  localStorage.removeItem("token");
};

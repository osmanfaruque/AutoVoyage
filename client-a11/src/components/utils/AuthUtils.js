import axios from "axios";

export const getAuthHeaders = async (currentUser) => {
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const token = await currentUser.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "x-user-email": currentUser.email,
  };
};

export const authAxios = async (
  url,
  method = "GET",
  data = null,
  currentUser
) => {
  const headers = await getAuthHeaders(currentUser);

  const config = {
    method,
    url,
    headers,
    withCredentials: true,
  };

  if (data) {
    config.data = data;
  }

  return axios(config);
};

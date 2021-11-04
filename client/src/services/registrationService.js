import axios from 'axios';

const baseUrl = '/api/users';

const signup = async (userinfo) => {
  const response = await axios.post(baseUrl, userinfo);
  return response.data;
};

export default {
  signup,
};

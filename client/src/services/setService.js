import axios from 'axios';

const baseUrl = '/api/sets';

const create = async (set) => {
  const response = await axios.post(baseUrl, set);
  return response.data;
};

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
};

export default {
  create,
  remove,
};

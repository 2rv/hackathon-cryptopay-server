import HttpRequest from 'axios';

export const getTransaction = async (url: string, id: string) => {
  const api = `${url}/rest/tx/${id}.json`;
  try {
    const response = await HttpRequest.get(api);
    return response.data;
  } catch (error) {
    throw error;
  }
};

import HttpRequest from 'axios';

export const RequestHanlder = async (
  url: string,
  method: string,
  params: any[] = null,
) => {
  const body = {
    jsonrpc: '1.0',
    method,
    ...(params ? { params } : {}),
  };

  try {
    const response = await HttpRequest.post(url, body);
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

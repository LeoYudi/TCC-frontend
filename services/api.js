const api_url =
  'https://southamerica-east1-teste-functions-d849f.cloudfunctions.net/tcc_functions';

async function fetch_api(method, route, body = undefined) {
  return new Promise((res, rej) => {
    fetch(`${api_url}${route}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(data => res(data.json()))
      .catch(error => rej(error));
  });
}

const api = {
  get: async route => await fetch_api('GET', route),
  post: async (route, body) => await fetch_api('POST', route, body),
  delete: async route => await fetch_api('DELETE', route),
};

export default api;

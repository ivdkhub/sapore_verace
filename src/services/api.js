// Client per il backend PHP (cartella /api sul server GoDaddy).

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(path, { method = 'GET', body, formData } = {}) {
  const headers = { 'X-SV-Request': '1' };
  let payload;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`/api/${path}`, {
      method,
      headers,
      body: payload,
      credentials: 'same-origin',
    });
  } catch {
    throw new ApiError('Connessione al server non riuscita. Controlla la rete e riprova.', 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // risposta non JSON (es. pagina di errore dell'hosting)
  }

  if (!res.ok || !data || data.ok === false) {
    throw new ApiError(data?.error || `Errore del server (${res.status}). Riprova tra poco.`, res.status, data);
  }
  return data;
}

export const api = {
  get: (path) => apiRequest(path),
  post: (path, body) => apiRequest(path, { method: 'POST', body }),
  put: (path, body) => apiRequest(path, { method: 'PUT', body }),
  patch: (path, body) => apiRequest(path, { method: 'PATCH', body }),
  del: (path) => apiRequest(path, { method: 'DELETE' }),
  upload: (path, file) => {
    const fd = new FormData();
    fd.append('image', file);
    return apiRequest(path, { method: 'POST', formData: fd });
  },
};

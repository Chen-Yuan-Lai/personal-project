const host = import.meta.env.VITE_HOST;

const headers = {
  'Content-Type': 'application/json',
};

export const signin = async (email, password) => {
  const body = JSON.stringify({
    email,
    password,
  });
  const res = await fetch(`${host}user/signin`, {
    method: 'POST',
    headers,
    body,
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
};

export const getUser = async jwt => {
  headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(`${host}user/userProfile`, { headers });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
};

export const getIssues = async (jwt, projectId = '', status = '', statsPeriod = '', sort = '') => {
  headers.Authorization = `Bearer ${jwt}`;
  const url =
    `${host}issues?` +
    `status=${status || 'unhandled'}&` +
    `statsPeriod=${statsPeriod || '30d'}&` +
    `sort=${sort || 'latest_seen'}&` +
    `project=${projectId || ''}`;
  const res = await fetch(url, { headers });
  if (!res.ok && `${res.status}`.startsWith('4')) {
    return {};
  }
  return await res.json();
};

export const getProjects = async jwt => {
  headers.Authorization = `Bearer ${jwt}`;
  const res = await fetch(`${host}projects`, { headers });
  if (!res.ok && `${res.status}`.startsWith('4')) {
    return null;
  }
  return await res.json();
};

export const getProject = async (jwt, projectId, bin, interval) => {
  headers.Authorization = `Bearer ${jwt}`;
  const url =
    `${host}project?` + `projectId=${projectId}&` + `bin=${bin}&` + `interval=${interval}`;
  const res = await fetch(url, { headers });
  if (!res.ok && `${res.status}`.startsWith('4')) {
    return null;
  }
  return await res.json();
};

export const getEvent = async (jwt, eventIds) => {
  headers.Authorization = `Bearer ${jwt}`;
  const query = eventIds.map(el => `id=${el}`).join('&');
  const url = `${host}/issue?${query}`;
  const res = await fetch(url, { headers });
  if (!res.ok && `${res.status}`.startsWith('4')) {
    return null;
  }
  return await res.json();
};

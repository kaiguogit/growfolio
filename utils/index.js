const queryParams = (params) => {
  const esc = encodeURIComponent;
  return Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&');
};

exports.makeUrl = (url, params) => {
  url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(params);
  return url;
};

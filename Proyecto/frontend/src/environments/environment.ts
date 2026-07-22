const getGatewayUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:9000';
    }
  }
  return '';
};

export const environment = {
  production: false,
  gatewayUrl: getGatewayUrl(),
  sseUrl: `${getGatewayUrl()}/sse/espacios`
};

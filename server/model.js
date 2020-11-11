const _config = {
  clientCredentials: [
    {
      clientId: "dare",
      clientSecret: "s3cr3t",
      grants: ["password", "client_credentials"],
      redirectUris: [],
    },
  ],
  tokens: [],
};

const getAccessToken = function (token) {
  const tokens = _config.tokens.filter(function (savedToken) {
    return savedToken.accessToken === token;
  });

  return tokens[0];
};

const getClient = (clientId, clientSecret) => {
  const _client = _config.clientCredentials.filter((client) => {
    return client.clientId === clientId && client.clientSecret === clientSecret;
  });
  return _client[0];
};

const saveToken = function (token, client, user) {
  token.client = client.clientId;
  token.user = user;
  _config.tokens.push(token);
  return token;
};

const getUserFromClient = (client) => {
  const _clients = _config.clientCredentials.filter((savedClient) => {
    return (
      savedClient.clientId === client.clientId &&
      savedClient.clientSecret === client.clientSecret
    );
  });

  return _clients.length;
};

const revokeToken = (token) => {
  _config.tokens = _config.tokens.filter((savedToken) => {
    return savedToken.refreshToken !== token.refreshToken;
  });
  const _revokedToken = _config.tokens.filter((savedToken) => {
    return savedToken.refreshToken === token.refreshToken;
  });

  return !_revokedToken.length;
};

module.exports = {
  getAccessToken: getAccessToken,
  getClient: getClient,
  saveToken: saveToken,
  getUserFromClient: getUserFromClient,
  revokeToken: revokeToken,
};

const bodyParser = require("body-parser");
const express = require("express");
const OAuthServer = require("oauth2-server");
const Request = OAuthServer.Request;
const Response = OAuthServer.Response;

const HOST = "127.0.0.1";
const PORT = 8080;

const app = express();
app.oauth = new OAuthServer({
  debug: true,
  model: require("./model"),
  allowBearerTokensInQueryString: true,
  accessTokenLifetime: 4 * 60 * 60,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/login", (req, res) => {
  const _req = new Request(req);
  const _res = new Response(res);
  return app.oauth
    .token(_req, _res)
    .then((token) => {
      res.json(token);
    })
    .catch((err) => {
      res.status(err.code).json(err);
    });
});

app.get("/api/clients", (req, res, next) => {
  const _req = new Request(req);
  const _res = new Response(res);
  return app.oauth
    .authenticate(_req, _res)
    .then((token) => {
      res.send({ client_id: token.client, token });
      next();
    })
    .catch((err) => {
      res.status(err.code).json(err);
    });
});

app.listen(PORT, () => {
  const clientId = "dare";
  const clientSecret = "s3cr3t";
  const encodedData = Buffer.from(clientId + ":" + clientSecret).toString(
    "base64"
  );
  const authorizationHeaderString = "Authorization: Basic " + encodedData;
  console.log(
    "\x1b[32m\x1b[36m%s\x1b[0m",
    `App running at: http://${HOST}:${PORT}/ ${authorizationHeaderString}`
  );
  console.log(
    "\x1b[45m\x1b[37m%s\x1b[0m",
    `${authorizationHeaderString} for ${clientId + ":" + clientSecret}`
  );
});

const fs = require('fs').promises;
const jose = require('jose');

const keyLocation = './utils/jwtUtil/key.json';
const jwkAlg = 'RSA-OAEP';
// const jwkHeader = { alg: jwkAlg };

const makeJwk = async () => {
  const { publicKey, privateKey } = await jose.generateKeyPair(jwkAlg);
  const exportedPublicKey = await jose.exportJWK(publicKey);
  const exportedPrivateKey = await jose.exportJWK(privateKey);
  await fs.writeFile(
    keyLocation,
    JSON.stringify({ u: exportedPublicKey, i: exportedPrivateKey })
  );
  return null;
};

const getPublicJwk = async () => {
  const keys = require('./key.json');
  if (!keys.u) return false;
  const key = await jose.importJWK(keys.u, jwkAlg);
  return key;
};

const getPrivateJwk = async () => {
  const keys = require('./key.json');
  if (!keys.i) return false;
  const key = await jose.importJWK(keys.i, jwkAlg);
  return key;
};

module.exports = { makeJwk, getPublicJwk, getPrivateJwk };

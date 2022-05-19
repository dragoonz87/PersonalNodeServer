const jose = require('jose');
const { getPublicJwk } = require('./utils/jwtUtil');

const data = {
  username: 'sambers',
  password: Buffer.from('th1s1ss4msp4ssw0rd').toString('base64')
};

(async () => {
  const key = await getPublicJwk();
  console.log(key);

  console.log(
    await new jose.EncryptJWT(data)
      .setProtectedHeader({ alg: 'RSA1_5', enc: 'A256GCM' })
      .setIssuedAt()
      .setIssuer('sb:spa.base')
      .encrypt(key)
  );
})();

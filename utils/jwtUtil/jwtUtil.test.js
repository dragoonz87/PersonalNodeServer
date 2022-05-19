const fs = require('fs').promises;

jest.mock('jose', () => ({
  generateKeyPair: jest.fn().mockReturnValue({
    publicKey: 'public',
    privateKey: 'private'
  }),
  exportJWK: jest.fn().mockImplementation((key) => `${key}-exported`),
  importJWK: jest.fn().mockImplementation((key) => 'imported')
}));
jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn()
  }
}));

const jwtUtil = require('./index');

describe('JWT util', () => {
  it('should call fs.writeFile when makeJwk is called', async () => {
    await jwtUtil.makeJwk();

    expect(fs.writeFile).toHaveBeenCalledWith(
      './utils/jwtUtil/key.json',
      JSON.stringify({ u: 'public-exported', i: 'private-exported' })
    );
  });

  describe('Get public JWK tests', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it('should return false when public key does not exist', async () => {
      jest.mock('./key.json', () => ({}));

      const key = await jwtUtil.getPublicJwk();

      expect(key).toBeFalsy();
    });

    it('should return the public key when it exists', async () => {
      jest.mock('./key.json', () => ({ u: true }));

      const key = await jwtUtil.getPublicJwk();

      expect(key).toEqual('imported');
    });
  });

  describe('Get private JWK tests', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it('should return false when private key does not exist', async () => {
      jest.mock('./key.json', () => ({}));

      const key = await jwtUtil.getPrivateJwk();

      expect(key).toBeFalsy();
    });

    it('should return the private key when it exists', async () => {
      jest.mock('./key.json', () => ({ i: true }));

      const key = await jwtUtil.getPrivateJwk();

      expect(key).toEqual('imported');
    });
  });
});

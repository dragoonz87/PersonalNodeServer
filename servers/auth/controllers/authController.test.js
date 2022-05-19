const { makeResp } = require('../../../utils/testUtil');
const passport = require('passport');

jest.mock('../../../utils/jwtUtil', () => ({
  ...jest.requireActual('../../../utils/jwtUtil'),
  getPublicJwk: jest.fn().mockReturnValue({ key: 'key' }),
  getPrivateJwk: jest.fn()
}));
jest.mock('jose', () => ({
  jwtDecrypt: jest.fn().mockImplementation((tkn) => {
    const token = JSON.parse(tkn);
    return {
      payload: {
        username: token.username,
        name: token.name,
        password: token.password
      }
    };
  }),
  exportSPKI: jest.fn().mockImplementation((key) => key)
}));
jest.mock('passport', () => ({
  authenticate: jest.fn().mockReturnValue(jest.fn())
}));

const authController = require('./index');

const HTTP_STATUS_INVALID_AUTHORIZATION = 401;
const user = {
  username: 'Username',
  name: 'Name',
  password: Buffer.from('Password').toString('base64')
};
const reqGet = jest.fn().mockReturnValue(`JWT ${JSON.stringify(user)}`);

describe('Auth controller', () => {
  describe('Basic tests', () => {
    it('should return authEnabled', () => {
      const req = {};
      const resp = makeResp();

      authController.isEnabled(req, resp);

      expect(resp.data).toStrictEqual({
        authEnabled: true
      });
    });

    it('should return message with auth running', () => {
      const req = {};
      const resp = makeResp();

      authController.getHealth(req, resp);

      expect(resp.send).toHaveBeenCalled();
      expect(resp.message).toEqual('Auth is running');
    });

    it('should logout profile', () => {
      const req = {
        logout: jest.fn()
      };
      const resp = makeResp();

      authController.logoutProfile(req, resp);

      expect(resp.url).toEqual('/');
    });
  });

  describe('Get user tests', () => {
    it('should return username and name if user exists', () => {
      const req = {
        user
      };
      const resp = makeResp();

      authController.getUser(req, resp);

      expect(resp.json).toHaveBeenCalled();
      expect(resp.data).toStrictEqual({
        username: user.username,
        name: user.name
      });
    });

    it('should return null if user does not exist', () => {
      const req = {};
      const resp = makeResp();

      authController.getUser(req, resp);

      expect(resp.json).toHaveBeenCalled();
      expect(resp.data).toBeNull();
    });
  });

  describe('Authorize tests', () => {
    it('should call next if user exists', () => {
      const req = {
        user
      };
      const resp = makeResp();
      const next = jest.fn();

      authController.authorize(req, resp, next);

      expect(next).toHaveBeenCalled();
    });

    it('should add url to session.tp and redirect to "/auth/signin" if user does not exist', () => {
      const req = {
        session: {},
        originalUrl: '/profile'
      };
      const resp = makeResp();

      authController.authorize(req, resp);

      expect(resp.url).toEqual('/signin');
      expect(req.session.tp).toEqual('/profile');
    });
  });

  describe('Sign in tests', () => {
    it('should return invalid when authorization is invalid', async () => {
      const req = {};
      const resp = makeResp();

      await authController.signIn(req, resp);

      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
      expect(resp.statusCode).toEqual(HTTP_STATUS_INVALID_AUTHORIZATION);
      expect(resp.data).toStrictEqual({
        error: HTTP_STATUS_INVALID_AUTHORIZATION,
        message: 'Invalid authorization'
      });
    });

    it('should return json data when test is true', async () => {
      const req = {
        get: reqGet,
        body: {
          test: true
        }
      };
      const resp = makeResp();

      await authController.signIn(req, resp);

      expect(resp.json).toHaveBeenCalled();
      expect(resp.data).toStrictEqual({
        username: user.username,
        password: true
      });
    });

    it('should call authenticate when authorization is valid', async () => {
      const req = {
        get: reqGet,
        body: {}
      };
      const resp = makeResp();

      await authController.signIn(req, resp);

      expect(passport.authenticate).toHaveBeenCalled();
    });
  });

  describe('Sign up tests', () => {
    it('should return invalid when authorization is invalid', async () => {
      const req = {};
      const resp = makeResp();

      await authController.signUp(req, resp);

      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
      expect(resp.statusCode).toEqual(HTTP_STATUS_INVALID_AUTHORIZATION);
      expect(resp.data).toStrictEqual({
        error: HTTP_STATUS_INVALID_AUTHORIZATION,
        message: 'Invalid authorization'
      });
    });

    it('should return json data when test is true', async () => {
      const req = {
        get: reqGet,
        body: {
          test: true
        }
      };
      const resp = makeResp();

      await authController.signUp(req, resp);

      expect(resp.json).toHaveBeenCalled();
      expect(resp.data).toStrictEqual({
        username: user.username,
        name: user.name,
        password: true
      });
    });

    it('should call authenticate when authorization is valid', async () => {
      const req = {
        get: reqGet,
        body: {}
      };
      const resp = makeResp();

      await authController.signUp(req, resp);

      expect(passport.authenticate).toHaveBeenCalled();
    });
  });

  describe('Handle passport authenticate tests', () => {
    let req = {};
    let resp = {};

    beforeEach(() => {
      req = {
        get: reqGet,
        body: {}
      };
      resp = makeResp();
    });

    it('should call next when there is an error in the authentication', async () => {
      passport.authenticate.mockImplementation(
        (type, func) => (req, res, next) => {
          func(true, null, null);
        }
      );

      const next = jest.fn();

      await authController.signUp(req, resp, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return json with sign up message when user is false', async () => {
      passport.authenticate.mockImplementation(
        (type, func) => (req, res, next) => {
          func(false, false, null);
        }
      );

      await authController.signUp(req, resp);

      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
      expect(resp.statusCode).toEqual(HTTP_STATUS_INVALID_AUTHORIZATION);
      expect(resp.data).toStrictEqual({
        message: 'Account already exists'
      });
    });

    it('should return json with sign in message when user is false', async () => {
      passport.authenticate.mockImplementation(
        (type, func) => (req, res, next) => {
          func(false, false, null);
        }
      );

      await authController.signIn(req, resp);

      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
      expect(resp.statusCode).toEqual(HTTP_STATUS_INVALID_AUTHORIZATION);
      expect(resp.data).toStrictEqual({
        message: 'Incorrect login or account does not exist'
      });
    });

    it('should call next when there is an error in the login', async () => {
      passport.authenticate.mockImplementation(
        (type, func) => (req, res, next) => {
          func(false, true, null);
        }
      );

      req.logIn = jest.fn().mockImplementation((user, func) => {
        func(true);
      });
      const next = jest.fn();

      await authController.signUp(req, resp, next);

      expect(req.logIn).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should send 204 NO CONTENT when there is no login error', async () => {
      passport.authenticate.mockImplementation(
        (type, func) => (req, res, next) => {
          func(false, true, null);
        }
      );

      req.logIn = jest.fn().mockImplementation((user, func) => {
        func(false);
      });

      await authController.signUp(req, resp);

      expect(resp.sendStatus).toHaveBeenCalled();
      expect(resp.statusCode).toEqual(204);
    });
  });

  describe('Get public key tests', () => {
    it('should return 403 FORBIDDEN with message when issuer is invalid', async () => {
      const req = {};
      const resp = makeResp();

      await authController.getPublicKey(req, resp);

      expect(resp.status).toHaveBeenCalled();
      expect(resp.send).toHaveBeenCalled();
      expect(resp.statusCode).toEqual(403);
      expect(resp.message).toEqual('You cannot make this request');
    });

    it('should return the public key when issuer is valid', async () => {
      const req = {
        body: {
          issuer: 'sb:valid'
        }
      };
      const resp = makeResp();

      await authController.getPublicKey(req, resp);

      expect(resp.json).toHaveBeenCalled();
      expect(resp.data).toStrictEqual({
        key: {
          key: 'key'
        }
      });
    });
  });
});

const config = require('../../../config');
const { makeResp } = require('../../../utils/testUtil');

const proxyController = require('./index');

describe('Proxy controller', () => {
  describe('Basic tests', () => {
    it('should return json with proxyEnabled', () => {
      const req = {};
      const resp = makeResp();

      proxyController.getProxyEnabled(req, resp);

      expect(resp.json).toHaveBeenCalled();
      expect(resp.data).toStrictEqual({ proxyEnabled: true });
    });

    it('should render base SPA', () => {
      const req = {};
      const resp = makeResp();

      proxyController.getBase(req, resp);

      expect(resp.render).toHaveBeenCalled();
      expect(resp.page).toStrictEqual({
        template: 'index',
        config: { CDN_URL: `${config.cdnUrl}/spas/basespa` }
      });
    });

    it('should render error SPA on not found', () => {
      const req = {};
      const resp = makeResp();

      proxyController.getNotFound(req, resp);

      expect(resp.render).toHaveBeenCalled();
      expect(resp.page).toStrictEqual({
        template: 'index',
        config: {
          CDN_URL: `${config.cdnUrl}/spas/errorspa`
        }
      });
    });
  });

  describe('Get grades tests', () => {
    it('should redirect to classes page when c exists', () => {
      const req = { query: { c: '1' } };
      const resp = makeResp();

      proxyController.getGrades(req, resp);

      expect(resp.redirect).toHaveBeenCalled();
      expect(resp.url).toEqual(`${config.baseUrl}/gradecheck/view?c=1`);
    });

    it('should redirect to class page when classId exists', () => {
      const req = { query: { classId: '0' } };
      const resp = makeResp();

      proxyController.getGrades(req, resp);

      expect(resp.redirect).toHaveBeenCalled();
      expect(resp.url).toEqual(`${config.baseUrl}/gradecheck/view?classId=0`);
    });

    it('should redirect to student page when classId and studentId exist', () => {
      const req = { query: { classId: '0', studentId: '0' } };
      const resp = makeResp();

      proxyController.getGrades(req, resp);

      expect(resp.redirect).toHaveBeenCalled();
      expect(resp.url).toEqual(
        `${config.baseUrl}/gradecheck/view?classId=0&studentId=0`
      );
    });

    it('should redirect to not-found when no valid parameters are given', () => {
      const req = { query: {} };
      const resp = makeResp();

      proxyController.getGrades(req, resp);

      expect(resp.redirect).toHaveBeenCalled();
      expect(resp.url).toEqual(`${config.baseUrl}/not-found`);
    });
  });
});

const config = require('../../../config');
const { makeResp } = require('../../../utils/testUtil');

const gradesController = require('./gradesController');

describe('Grades controller', () => {
  it('should return a json with gradesEnabled', () => {
    const req = {};
    const resp = makeResp();

    gradesController.getGradeCheckEnabled(req, resp);

    expect(resp.json).toHaveBeenCalled();
    expect(resp.data).toStrictEqual({
      gradeCheckEnabled: config.gradeCheck.isEnabled
    });
  });

  it('should return message with grades working', () => {
    const req = {};
    const resp = makeResp();

    gradesController.getHealth(req, resp);

    expect(resp.send).toHaveBeenCalled();
    expect(resp.message).toEqual('Grades is running');
  });

  it('should render index with config', () => {
    const req = {
      path: '/1/70'
    };
    const resp = makeResp();

    gradesController.renderSpa(req, resp);

    expect(resp.render).toHaveBeenCalled();
    expect(resp.page).toStrictEqual({
      template: 'index',
      config: {
        CDN_URL: `${config.cdnUrl}/spas/gradecheckspa`,
        WINDOW_PATH: req.path
      }
    });
  });
});

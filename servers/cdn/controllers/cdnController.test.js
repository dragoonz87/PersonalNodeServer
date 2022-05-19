const { makeResp } = require('../../../utils/testUtil');

const cdnController = require('./index');

describe('CDN controller', () => {
  it('should send json with cdn enabled', () => {
    const req = {};
    const resp = makeResp();

    cdnController.getCdnEnabled(req, resp);

    expect(resp.json).toHaveBeenCalled();
    expect(resp.data).toStrictEqual({
      cdnEnabled: true
    });
  });

  it('should send message with cdn working', () => {
    const req = {};
    const resp = makeResp();

    cdnController.getHealth(req, resp);

    expect(resp.send).toHaveBeenCalled();
    expect(resp.message).toEqual('CDN is running');
  });

  it('should send message when a non-static file is requested', () => {
    const req = {};
    const resp = makeResp();

    cdnController.getNonStatic(req, resp);

    expect(resp.status).toHaveBeenCalled();
    expect(resp.send).toHaveBeenCalled();
    expect(resp.statusCode).toEqual(400);
    expect(resp.message).toEqual('File does not exist');
  });
});

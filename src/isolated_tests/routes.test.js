const request = require('supertest');

jest.mock('dotenv');

process.env.PORT = 7357;

const { app, server } = require('../app');
const HTTP_STATUS_OK = 200;

describe('App tests', () => {
  it('should return a 200 OK with a title when given a request to "/"', async () => {
    const response = await request(app).get('/').redirects(1);
    expect(response.statusCode).toEqual(HTTP_STATUS_OK);
    expect(response.text).toContain("<title>Sam's Page</title>");
  });

  it('should return a 200 OK with a title when given a request to any route', async () => {
    const response = await request(app).get('/somerandomroute');
    expect(response.statusCode).toEqual(HTTP_STATUS_OK);
    expect(response.text).toContain("<title>Sam's Page</title>");
  });

  it('should return a 200 OK with cdn message when given a request to "/cdn"', async () => {
    const response = await request(app).get('/cdn').redirects(1);
    expect(response.statusCode).toEqual(HTTP_STATUS_OK);
    expect(response.body).toStrictEqual({ cdnEnabled: true });
  });

  it('should return a 200 OK with authEnabled when given a request to "/auth"', async () => {
    const response = await request(app).get('/auth');
    expect(response.statusCode).toEqual(HTTP_STATUS_OK);
    expect(response.body).toStrictEqual({ authEnabled: true });
  });

  it('should return a 200 OK with grades message when given a request to "/gradecheck"', async () => {
    const response = await request(app).get('/gradecheck');
    expect(response.statusCode).toEqual(HTTP_STATUS_OK);
    expect(response.body).toStrictEqual({ gradeCheckEnabled: true });
  });

  it('should return a 200 OK with proxy message when given a request to "/proxy"', async () => {
    const response = await request(app).get('/proxy');
    expect(response.statusCode).toEqual(HTTP_STATUS_OK);
    expect(response.body).toStrictEqual({ proxyEnabled: true });
  });
});

afterAll(() => {
  server.close();
});

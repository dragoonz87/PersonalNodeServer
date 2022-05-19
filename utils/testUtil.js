/* eslint-disable no-param-reassign */
const possibleResponseProperties = (resp) => ({
  json: jest.fn((data) => {
    resp.data = data;
  }),
  redirect: jest.fn((url) => {
    resp.url = url;
  }),
  render: jest.fn((template, config) => {
    resp.page = { template, config };
  }),
  send: jest.fn((msg) => {
    resp.message = msg;
  }),
  sendStatus: jest.fn((statusCode) => {
    resp.statusCode = statusCode;
  }),
  status: jest.fn((statusCode) => {
    resp.statusCode = statusCode;
    return resp;
  })
});

const responseProperties = {
  sendStatus: 'sendStatus',
  status: 'status',
  send: 'send',
  json: 'json',
  redirect: 'redirect'
};

const makeResp = () => {
  const resp = {};
  const possibilities = possibleResponseProperties(resp);
  Object.keys(possibilities).forEach((prop) => {
    resp[prop] = possibilities[prop];
  });
  return resp;
};

module.exports = { responseProperties, makeResp };

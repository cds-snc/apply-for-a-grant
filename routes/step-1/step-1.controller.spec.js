const request = require('supertest')
const app = require('../../app.js')
const cheerio = require('cheerio')
const { getRouteByName } = require('../../utils/route.helpers')

const session = require('supertest-session');

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $('[name=_csrf]').val();
}

test('Can send get request step-1 route ', async () => {
  const route = getRouteByName('step-1')
  const response = await request(app).get(route.path)
  expect(response.statusCode).toBe(200)
})

// @todo test sending a form request
test('Can send post request step-1 route ', async () => {
  const route = getRouteByName('step-1')

  // to test form with csrf token, need a session, and a token from a get request
  const testSession = session(app);
  const getresp = await testSession.get(route.path);
  const csrfToken = extractCsrfToken(getresp);

  const postresp = await testSession.post(route.path).send({ _csrf: csrfToken });
  expect(postresp.statusCode).toBe(422);
})

jest.mock('../../utils/flash.message.helpers', () => ({
  getFlashMessage: jest.fn(req => {
    return { fieldname: { value: '', msg: 'caught this error', param: 'testerror', location: 'body' } }
  }),
}))

test('Display errors on the page', async () => {
  const route = getRouteByName('step-1')
  const response = await request(app).get(route.path)
  expect(response.statusCode).toBe(200)
  expect(response.text).toContain('caught this error')
})

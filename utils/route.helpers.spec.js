<<<<<<< HEAD
const {
  getRouteWithIndexByName,
  getRouteByName,
  getPreviousRoute,
  getNextRoute,
  doRedirect,
  getDefaultMiddleware,
  routeUtils,
  routeHasIndex,
} = require('./index')

const testRoutes = [
  { name: 'start', path: '/start' },
  { name: 'step-1', path: '/step-1' },
  { name: 'confirmation', path: '/confirmation' },
]

describe('Routes', () => {
  test('finds route index by name', () => {
    const obj = getRouteWithIndexByName('step-1', testRoutes)
    expect(obj.index).toEqual(1)
  })

  test('finds route path by name', () => {
    const obj = getRouteByName('step-1', testRoutes)
    expect(obj.path).toEqual('/step-1')
=======
const { makeRoutingTable } = require('./index')

const testRoutes = makeRoutingTable(
  [
    { name: 'start', path: { en: '/start', fr: '/debut' } },
    { name: 'personal', path: { en: '/personal', fr: '/personnel' }, otherKey: 42 },
    { name: 'confirmation', path: '/confirmation' },
  ],
  ['en', 'fr'],
  { directory: '/tmp' },
)

const start = testRoutes.get('start')
const personal = testRoutes.get('personal')
const confirmation = testRoutes.get('confirmation')

describe('Routes', () => {
  test('finds route by name', () => {
    expect(start.index).toEqual(0)
    expect(personal.index).toEqual(1)
    expect(confirmation.index).toEqual(2)
  })

  test('prefixes paths', () => {
    expect(start.path.fr).toEqual('/fr/debut')
    expect(confirmation.path.en).toEqual('/en/confirmation')
>>>>>>> 452b896a038f648ebccc68df59e65fbf08cb8306
  })

  test('preserves custom keys', () => {
    expect(personal.otherKey).toEqual(42)
  })

<<<<<<< HEAD
  test('finds previous route path by name', () => {
    const obj = getPreviousRoute('step-1', testRoutes)
    expect(obj.path).toEqual('/start')
=======
  test("return undefined for previous route that doesn't exist", () => {
    expect(start.prev).toBeUndefined()
>>>>>>> 452b896a038f648ebccc68df59e65fbf08cb8306
  })

  test('finds previous route', () => {
    expect(start.prev).toBeUndefined()
    expect(personal.prev).toEqual(start)
    expect(confirmation.prev).toEqual(personal)
  })

<<<<<<< HEAD
  test('finds next route path by name', () => {
    const obj = getNextRoute('step-1', testRoutes)
    expect(obj.path).toEqual('/confirmation')
=======
  test('finds next route', () => {
    expect(start.next).toEqual(personal)
    expect(personal.next).toEqual(confirmation)
    expect(confirmation.next).toBeUndefined()
>>>>>>> 452b896a038f648ebccc68df59e65fbf08cb8306
  })
})

describe('doRedirect', () => {
  const req = { body: {}, locale: 'fr' }
  const next = jest.fn()
  const redirectMock = jest.fn()
  const res = {
    query: {},
    headers: {},
    data: null,
    redirect: redirectMock,
  }

  test('Calls redirect if it finds the next route', () => {
    personal.doRedirect()(req, res, next)
    expect(next.mock.calls.length).toBe(0)
    expect(redirectMock.mock.calls.length).toBe(1)
    expect(redirectMock.mock.calls[0][0]).toEqual('/fr/confirmation')
  })

  test('Calls next if json is requested', () => {
    const jsonReq = { ...req, body: { json: true } }
    confirmation.doRedirect()(jsonReq, res, next)
    expect(next.mock.calls.length).toBe(1)
  })
})

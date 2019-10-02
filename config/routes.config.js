// 1) add your route(s) here ⬇️
const routes = [
  { name: 'start', path: '/start' },
  { name: 'step-1', path: '/step-1' },
  { name: 'payment', path: '/payment' },
  { name: 'book', path: '/book-appointment' },
  { name: 'confirmation', path: '/confirmation' },
  { name: 'test_db', path: '/db' },
]

// note: you can define and export a custom configRoutes function here
// see route.helpers.js which is where the default one is defined
// if configRoutes is defined here it will be used in pacle of the default

module.exports = {
  routes,
}

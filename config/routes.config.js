// 1) add your route(s) here ⬇️
const routes = [
  { name: 'start', path: { en: '/start', fr: '/debut' } },
  { name: 'step-1', path: {en: '/step-1', fr: '/etape-1'} },
  { name: 'book', path: {en: '/book-appointment', fr: '/fixer-un-rendez-vous'} },
  { name: 'payment', path: {en: '/payment', fr: '/paiement'} },
  { name: 'confirmation', path: {en: '/confirmation', fr: '/confirmation'} },
]

const locales = ['en', 'fr']

// note: you can define and export a custom configRoutes function here
// see route.helpers.js which is where the default one is defined
// if configRoutes is defined here it will be used in pacle of the default

module.exports = {
  routes,
  locales,
}

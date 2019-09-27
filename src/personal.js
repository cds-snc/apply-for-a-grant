import accessibleAutocomplete from 'accessible-autocomplete'

const grants = [
  'Federal Innovation Grant',
  'Low Income Stability Grant',
  'French First Grant',
]

accessibleAutocomplete({
  element: document.querySelector('#grant-type-container'),
  id: 'grant-type', // To match it to the existing <label>.
  source: grants,
})

const path = require('path')
const { routeUtils } = require('./../../utils')
const dynamoose = require('dynamoose')

module.exports = app => {
  const name = 'test_db'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  dynamoose.AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ca-central-1',
  })

  
  const Submissions = dynamoose.model('Submissions', {
    id: Number,
    fullname: String,
  })
  

  const entry = new Submissions({
    id: 1,
    fullname: 'Mr. Test 2',
  })

  entry.save()

  app.get(route.path, (req, res) => {
    res.render(name)
  })
}

const expect = require('expect')
const filterApi = require('./../api/apiController')
const request = require('request')
const server = require('./server.js')

describe('People Like You API', function () {
  before(function () {
    server.listen(8000)
  })

  it('should return 200', function (done) {
    var options = {
      url: 'http://localhost:8000/people-like-you?age=23&latitude=40.71667&longitude=19.56667&monthlyIncome=5500&experienced=false',
      headers: {
        'Content-Type': 'text/plain'
      }
    }
    request.get(options, function (err, res, body) {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual('correct header')
      done()
    })
  })

  after(function () {
    server.close()
  })

  it('should return score for Age', async () => {
    const age = 20
    const reqAge = 23
    const ageLimit = [3, 6, 9, 12]
    const response = filterApi.getScore(age, reqAge, ageLimit)
    expect(response.status).toEqual(false)
    expect(response.score).toEqual(0.05)
  })

  it('should return score for Latitude', async () => {
    const latitude = 40.71667
    const reqLatitude = 35.2322
    const latitudeLimit = [20, 40, 60, 80]
    const response = filterApi.getScore(latitude, reqLatitude, latitudeLimit)
    expect(response.status).toEqual(true)
    expect(response.score).toEqual(0.1)
  })

  it('should return score for Longitude', async () => {
    const longitude = 45.23212
    const reqLongitude = 23.43232
    const longitudeLimit = [20, 40, 60, 80]
    const response = filterApi.getScore(longitude, reqLongitude, longitudeLimit)
    expect(response.status).toEqual(false)
    expect(response.score).toEqual(0.05)
  })

  it('should return score Monthly income', async () => {
    const monthlyIncome = 5432
    const reqMonthlyIncome = 5400
    const monthlyIncomeLimit = [1000, 3000, 5000, 8000]
    const response = filterApi.getScore(monthlyIncome, reqMonthlyIncome, monthlyIncomeLimit)
    expect(response.status).toEqual(true)
    expect(response.score).toEqual(0.1)
  })

  it('should return score Experience', async () => {
    const experience = true
    const reqExperience = false
    const response = filterApi.getExpreienced(experience, reqExperience)
    expect(response.status).toEqual(false)
    expect(response.score).toEqual(0)
  })
})

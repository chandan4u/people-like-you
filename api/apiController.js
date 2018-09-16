const fs = require('fs')
const util = require('util')
const _api = function (req, res) {
  const arrayObj = JSON.parse(fs.readFileSync(__basedir + '/data/records.json', 'utf8'))
  let resultArr = []
  const ageLimit = [3, 6, 9, 12]
  const latitudeLongitudeLimit = [20, 40, 60, 80]
  const monthlyIncomeLimit = [1000, 3000, 5000, 8000]
  req.check('age', 'Age must be an integer').isInt()
  req.check('latitude', 'Latitude must be an float').isFloat()
  req.check('longitude', 'Longitude must be an float').isFloat()
  req.check('monthlyIncome', 'Monthly income must be an integer').isInt()
  req.check('experienced', 'Experience must be an boolean').isBoolean()
  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return res.status(400).send('There have been validation errors: ' + util.inspect(result.array()))
    } else {
      arrayObj.forEach(function (elements) {
        const _ageStatus = _getScore(elements.age, req.query.age, ageLimit)
        const _latitudeStatus = _getScore(elements.latitude, req.query.latitude, latitudeLongitudeLimit)
        const _longitudeStatus = _getScore(elements.longitude, req.query.longitude, latitudeLongitudeLimit)
        const _monthlyStatus = _getScore(elements.monthlyIncome, req.query.monthlyIncome, monthlyIncomeLimit)
        const _experiencedStatus = _getExperiencedScore(elements.experienced, req.query.experienced)

        if (_ageStatus.status || _latitudeStatus.status || _longitudeStatus.status || _monthlyStatus.status || _experiencedStatus.status) {
          let score = _ageStatus.score + _latitudeStatus.score + _longitudeStatus.score + _monthlyStatus.score + _experiencedStatus.score
          elements.score = parseFloat(score).toFixed(1)
          resultArr.push(elements)
        }
      })
      const sortedResult = resultArr.sort(function (a, b) {
        return (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0)
      })
      res.status(200).send({ 'peopleLikeYou': sortedResult }).end()
    }
  })
}

const _getScore = function (age, reqAge, limit) {
  switch (true) {
    case (reqAge === age):
      return { score: 0.2, status: true }
    case (reqAge < age + limit[0] && reqAge > age - limit[0]):
      return { score: 0.1, status: true }
    case (reqAge < age + limit[1] && reqAge > age - limit[1]):
      return { score: 0.05, status: false }
    case (reqAge < age + limit[2] && reqAge > age - limit[2]):
      return { score: 0.03, status: false }
    case (reqAge < age + limit[3] && reqAge > age - limit[3]):
      return { score: 0.02, status: false }
    default:
      return { score: 0, status: false }
  }
}

const _getExperiencedScore = function (experienced, reqExperienced) {
  if (reqExperienced === experienced) {
    return { score: 0.2, status: true }
  }
  return { score: 0, status: false }
}

module.exports = {
  api: _api,
  getScore: _getScore,
  getExpreienced: _getExperiencedScore
}

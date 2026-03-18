const { getMockStore } = require('../mock/store')

function attachMockData(req, _res, next) {
  const useMock =
    !process.env.MONGO_URI ||
    String(process.env.USE_MOCK || '').toLowerCase() === 'true'

  req.useMock = useMock
  req.mock = useMock ? getMockStore() : null
  next()
}

module.exports = { attachMockData }


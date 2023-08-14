let dateNowSpy
let currentTime

const TestDate = {
  freeze: () => {
    currentTime = Date.now()
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => currentTime)
  },
  advanceTime: (seconds) => (currentTime += seconds * 1000),
  unfreeze: () => {
    dateNowSpy.mockRestore()
  },
}
module.exports = TestDate

let dateNowSpy;

const TestDate = {
  freeze: () => {
    const now = Date.now();
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => now)
  },
  unfreeze: () => {
    dateNowSpy.mockRestore()
  },
};
module.exports = TestDate;
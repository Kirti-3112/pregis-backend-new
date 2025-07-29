const { sumTimes } = require('../../../src/utils/common');

describe('sumTimes', () => {
  it('correctly sums an array of time strings', () => {
    const times = ['12:30:15', '05:45:40', '02:10:30'];
    const result = sumTimes(times);
    expect(result).toBe('20:26:25');
  });

  it('correctly handles single-digit hours, minutes, and seconds', () => {
    const times = ['01:02:03', '04:05:06', '07:08:09'];
    const result = sumTimes(times);
    expect(result).toBe('12:15:18');
  });

  it('correctly handles input with hours exceeding 24', () => {
    const times = ['25:30:45', '05:45:40', '02:10:30'];
    const result = sumTimes(times);
    expect(result).toBe('33:26:55');
  });
  it('correctly handles empty input', () => {
    const times = [];
    const result = sumTimes(times);
    expect(result).toBe('00:00:00');
  });
  it('correctly handles input with negative values', () => {
    const times = ['-01:30:15', '05:45:40', '02:10:30'];
    const result = sumTimes(times);
    expect(result).toBe('07:26:25');
  });
});

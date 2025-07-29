const { EXTENSIONS } = require('../../../src/config/constants');
const {
  setHeadersInResponse,
  convertDateToTimeRange,
  formatDateAndTime,
  covertStringToDate,
  timeToDecimal,
  pick,
  exportTableData,
  computeShiftHours,
  computeNearestShiftBoundary,
  computeShiftBoundaries,
  computeIntermediateShiftBoundaries,
  clockOutPreviousShift,
  computeIntermediateShiftActivityData,
  groupByClockInDate,
} = require('../../../src/utils/common');

describe('setHeadersInResponse', () => {
  it('should set headers in the response object', () => {
    const res = {
      statusCode: undefined,
      setHeader: jest.fn(),
    };

    const fileName = 'exampleFile';

    setHeadersInResponse(res, fileName);
    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledTimes(3);

    expect(res.setHeader.mock.calls[0][0]).toBe('Content-Disposition');
    expect(res.setHeader.mock.calls[0][1]).toMatch(
      /^attachment; filename="exampleFile_\d+\.xlsx"$/
    );
    expect(res.setHeader.mock.calls[1][0]).toBe('Content-Type');
    expect(res.setHeader.mock.calls[1][1]).toBe('application/vnd.ms-excel');
  });
});
describe('covertStringToDate', () => {
  it('should convert an array of duration strings to a total time string', () => {
    const duration = [
      { duration: '01:30:15' },
      { duration: '00:45:30' },
      { duration: '02:15:45' },
    ];
    const result = covertStringToDate(duration);
    expect(result).toBe('04:31:30');
  });

  it('should handle edge cases with zero durations', () => {
    const duration = [
      { duration: '00:00:00' },
      { duration: '00:00:00' },
      { duration: '00:00:00' },
    ];

    const result = covertStringToDate(duration);

    expect(result).toBe('00:00:00');
  });
  it('should handle single-digit hours, minutes, and seconds', () => {
    const duration = [{ duration: '9:8:7' }, { duration: '1:2:3' }];

    const result = covertStringToDate(duration);

    expect(result).toBe('10:10:10');
  });
});
describe('timeToDecimal', () => {
  it('should convert a time string to decimal format', () => {
    const result = timeToDecimal('02:30:45');
    expect(result).toBe(2.5125);
  });

  it('should handle a time string with zero hours and minutes', () => {
    const result = timeToDecimal('00:00:45');
    expect(result).toBe(0.0125);
  });

  it('should handle a time string with zero hours, minutes, and non-zero seconds', () => {
    const result = timeToDecimal('00:00:30');
    expect(result).toBe(0.008333333333333333);
  });

  it('should handle a time string with single-digit hours, minutes, and seconds', () => {
    const result = timeToDecimal('1:2:3');
    expect(result).toBe(1.0341666666666667);
  });
});
describe('convertDateToTimeRange', () => {
  it('should convert a date to a time range with start and end times', () => {
    const inputDate = new Date('2022-02-15T00:00:00.000Z');
    const result = convertDateToTimeRange(inputDate);
    expect(result).toBeDefined();
    expect(result.startTime).toBe('2022-02-15T00:00:00.000Z');
    expect(result.endTime).toBe('2022-02-15T23:59:59.999Z');
  });
});
describe('formatDateAndTime', () => {
  it('should format date and time properties in jobDetails using dayjs', () => {
    const dateTimes = {
      _doc: {
        ImportedTime: '2022-01-01T12:34:56.789Z',
        CreatedTime: '2022-02-15T08:30:00.000Z',
        CompletedTime: '2022-02-15T16:45:00.000Z',
        CreatedAt: '2022-03-20T18:00:00.000Z',
        date: '2022-04-25T21:15:00.000Z',
      },
    };
    const result = formatDateAndTime(dateTimes);
    expect(result).toEqual({
      CompletedTime: '02/15/2022 22:15:00',
      CreatedAt: '03/20/2022 23:30:00',
      CreatedTime: '02/15/2022 14:00:00',
      ImportedTime: '01/01/2022 18:04:56',
      date: '04/26/2022 02:45:00',
    });
  });
});
describe('pick', () => {
  it('should pick specified keys from the object', () => {
    const inputObject = {
      name: 'John',
      age: 30,
      gender: 'male',
      country: 'USA',
    };
    const keysToPick = ['name', 'age', 'country'];
    const result = pick(inputObject, keysToPick);
    expect(result).toEqual({
      name: 'John',
      age: 30,
      country: 'USA',
    });
  });

  it('should handle undefined or null object gracefully', () => {
    const inputObject = null;
    const keysToPick = ['name', 'age', 'country'];
    const result = pick(inputObject, keysToPick);
    expect(result).toEqual({});
  });

  it('should handle missing keys in the object', () => {
    const inputObject = {
      name: 'John',
      age: 30,
    };
    const keysToPick = ['name', 'age', 'country'];
    const result = pick(inputObject, keysToPick);
    expect(result).toEqual({
      name: 'John',
      age: 30,
      country: undefined,
    });
  });
});

describe('exportTableData', () => {
  // The function should apply a custom style to the first row of the worksheet, setting the font color to EXTENSIONS.FONTCOLOR, the background color to EXTENSIONS.BGCOLOR, and making the text bold.
  it('should apply a custom style to the first row of the worksheet', () => {
    // Arrange
    const result = {
      headers: ['Name', 'Age', 'Gender'],
      records: [
        { Name: 'John', Age: 25.0, Gender: 'Male' },
        { Name: 'Jane', Age: 30.0, Gender: 'Female' },
      ],
      sheetName: 'Sheet1',
    };

    // Act
    const workbook = exportTableData(result);
    // Assert
    const worksheet = workbook.worksheets[0];
    const firstRow = worksheet.getRow(1);
    expect(firstRow.getCell(1).font.color.argb).toBe(EXTENSIONS.FONTCOLOR);
    expect(firstRow.getCell(1).font.size).toBe(13);
    expect(firstRow.getCell(1).font.bold).toBe(true);
    expect(firstRow.getCell(1).fill.type).toBe('pattern');
    expect(firstRow.getCell(1).fill.pattern).toBe('solid');
    expect(firstRow.getCell(1).fill.fgColor.argb).toBe(EXTENSIONS.BGCOLOR);
  });
});
describe('computeShiftHours function', () => {
  it('should return correct shift hours when clockIn and clockOut fall within the same shift', () => {
    const result = computeShiftHours(
      '2024-05-02T09:00:00Z',
      '2024-05-02T13:00:00Z'
    );
    expect(result).toEqual({ morning: 4, evening: 0, night: 0 });
  });

  it('should return correct shift hours when duration is less than 8 hours', () => {
    const result = computeShiftHours(
      '2024-05-02T12:00:00Z',
      '2024-05-02T15:00:00Z'
    );
    expect(result).toEqual({ morning: 3, evening: 0, night: 0 });
  });
});

describe('computeNearestShiftBoundary function', () => {
  it('should return correct shift boundary for Fri, 07 May 2024 01:40:09 GMT', () => {
    const result = computeNearestShiftBoundary('Tue, 07 May 2024 01:40:09 GMT');
    expect(result).toEqual('Tue, 07 May 2024 00:00:00 GMT');
  });
  it('should return correct shift boundary for Fri, 07 May 2024 09:40:09 GMT', () => {
    const result = computeNearestShiftBoundary('Tue, 07 May 2024 09:40:09 GMT');
    expect(result).toEqual('Tue, 07 May 2024 08:00:00 GMT');
  });
  it('should return correct shift boundary for Fri, 07 May 2024 19:40:09 GMT', () => {
    const result = computeNearestShiftBoundary('Tue, 07 May 2024 19:40:09 GMT');
    expect(result).toEqual('Tue, 07 May 2024 16:00:00 GMT');
  });
});

describe('computeShiftBoundaries function', () => {
  it('should return correct shift boundary for Fri, 07 May 2024 01:40:09 GMT', () => {
    const result = computeShiftBoundaries('Tue, 07 May 2024 01:40:09 GMT');
    expect(result).toEqual([
      'Tue, 07 May 2024 00:00:00 GMT',
      'Tue, 07 May 2024 08:00:00 GMT',
      'Tue, 07 May 2024 16:00:00 GMT',
      'Wed, 08 May 2024 00:00:00 GMT',
    ]);
  });
});

describe('computeIntermediateShiftBoundaries function', () => {
  it('should return correct shift boundary for Fri, 07 May 2024 01:40:09 GMT and Tue, 07 May 2024 19:40:09 GMT', () => {
    const result = computeIntermediateShiftBoundaries(
      'Tue, 07 May 2024 01:40:09 GMT',
      'Tue, 07 May 2024 19:40:09 GMT'
    );
    expect(result).toEqual([
      'Tue, 07 May 2024 08:00:00 GMT',
      'Tue, 07 May 2024 16:00:00 GMT',
    ]);
  });
  it('should return correct shift boundary for Fri, 07 May 2024 01:40:09 GMT and Wed, 08 May 2024 09:40:09 GMT', () => {
    const result = computeIntermediateShiftBoundaries(
      'Tue, 07 May 2024 01:40:09 GMT',
      'Tue, 08 May 2024 09:40:09 GMT'
    );
    expect(result).toEqual([
      'Tue, 07 May 2024 08:00:00 GMT',
      'Tue, 07 May 2024 16:00:00 GMT',
      'Wed, 08 May 2024 00:00:00 GMT',
      'Wed, 08 May 2024 08:00:00 GMT',
    ]);
  });
});

describe('computeIntermediateShiftActivityData function', () => {
  it('should return an empty array when intermediateShiftBoundaries array has less than 2 elements', () => {
    const intermediateShiftBoundaries = ['Fri, 03 May 2024 08:00:00 GMT'];
    const machineGroupId = 'Group2';
    const result = computeIntermediateShiftActivityData(
      intermediateShiftBoundaries,
      machineGroupId
    );

    expect(result).toEqual([]);
  });

  it('should return an empty array when intermediateShiftBoundaries array is empty', () => {
    const intermediateShiftBoundaries = [];
    const machineGroupId = 'Group3';
    const result = computeIntermediateShiftActivityData(
      intermediateShiftBoundaries,
      machineGroupId
    );

    expect(result).toEqual([]);
  });
});

describe('groupByClockInDate', () => {
  it('should return an empty object when input is an empty array', () => {
    const input = [];
    const output = groupByClockInDate(input);
    expect(output).toEqual({});
  });

  it('should group items by the same clockIn date', () => {
    const date = new Date('2023-05-14T12:00:00Z');
    const input = [
      { clockIn: date, otherData: 'data1' },
      { clockIn: new Date('2023-05-14T15:00:00Z'), otherData: 'data2' },
    ];
    const output = groupByClockInDate(input);
    expect(output).toEqual({
      '2023-05-14': [
        { clockIn: date, otherData: 'data1' },
        { clockIn: new Date('2023-05-14T15:00:00Z'), otherData: 'data2' },
      ],
    });
  });

  it('should group items by different clockIn dates', () => {
    const input = [
      { clockIn: new Date('2023-05-14T12:00:00Z'), otherData: 'data1' },
      { clockIn: new Date('2023-05-15T15:00:00Z'), otherData: 'data2' },
    ];
    const output = groupByClockInDate(input);
    expect(output).toEqual({
      '2023-05-14': [
        { clockIn: new Date('2023-05-14T12:00:00Z'), otherData: 'data1' },
      ],
      '2023-05-15': [
        { clockIn: new Date('2023-05-15T15:00:00Z'), otherData: 'data2' },
      ],
    });
  });

  it('should handle multiple items with multiple dates correctly', () => {
    const input = [
      { clockIn: new Date('2023-05-14T12:00:00Z'), otherData: 'data1' },
      { clockIn: new Date('2023-05-14T15:00:00Z'), otherData: 'data2' },
      { clockIn: new Date('2023-05-15T09:00:00Z'), otherData: 'data3' },
      { clockIn: new Date('2023-05-15T18:00:00Z'), otherData: 'data4' },
    ];
    const output = groupByClockInDate(input);
    expect(output).toEqual({
      '2023-05-14': [
        { clockIn: new Date('2023-05-14T12:00:00Z'), otherData: 'data1' },
        { clockIn: new Date('2023-05-14T15:00:00Z'), otherData: 'data2' },
      ],
      '2023-05-15': [
        { clockIn: new Date('2023-05-15T09:00:00Z'), otherData: 'data3' },
        { clockIn: new Date('2023-05-15T18:00:00Z'), otherData: 'data4' },
      ],
    });
  });

  it('should handle items with times on different days correctly', () => {
    const input = [
      { clockIn: new Date('2023-05-14T23:59:59Z'), otherData: 'data1' },
      { clockIn: new Date('2023-05-15T00:00:00Z'), otherData: 'data2' },
    ];
    const output = groupByClockInDate(input);
    expect(output).toEqual({
      '2023-05-14': [
        { clockIn: new Date('2023-05-14T23:59:59Z'), otherData: 'data1' },
      ],
      '2023-05-15': [
        { clockIn: new Date('2023-05-15T00:00:00Z'), otherData: 'data2' },
      ],
    });
  });
});

describe('clockOutPreviousShift function', () => {
  it('should correctly update the shiftActivity array when there is a previous shift without clockOut value', () => {
    const userShiftData = {
      shiftActivity: [
        { clockIn: '2024-05-02T19:00:00Z', clockOut: null },
        { clockIn: '2024-05-02T17:00:00Z', clockOut: '2024-05-02T20:00:00Z' },
      ],
    };
    const clockOut = '2024-05-02T20:30:00Z';
    clockOutPreviousShift(userShiftData, clockOut);

    expect(userShiftData.shiftActivity).toEqual([
      {
        clockIn: '2024-05-02T19:00:00Z',
        clockOut: new Date('2024-05-02T20:30:00.000Z'),
        morning: 0,
        evening: 1.5,
        night: 0,
      },
      { clockIn: '2024-05-02T17:00:00Z', clockOut: '2024-05-02T20:00:00Z' },
    ]);
  });

  it('should not modify the shiftActivity array if all shifts already have a clockOut value', () => {
    const userShiftData = {
      shiftActivity: [
        { clockIn: '2024-05-02T09:00:00Z', clockOut: '2024-05-02T12:00:00Z' },
        { clockIn: '2024-05-02T13:00:00Z', clockOut: '2024-05-02T16:00:00Z' },
        { clockIn: '2024-05-02T17:00:00Z', clockOut: '2024-05-02T20:00:00Z' },
      ],
    };
    const clockOut = '2024-05-02T20:30:00Z';
    clockOutPreviousShift(userShiftData, clockOut);

    expect(userShiftData.shiftActivity).toEqual([
      { clockIn: '2024-05-02T09:00:00Z', clockOut: '2024-05-02T12:00:00Z' },
      { clockIn: '2024-05-02T13:00:00Z', clockOut: '2024-05-02T16:00:00Z' },
      { clockIn: '2024-05-02T17:00:00Z', clockOut: '2024-05-02T20:00:00Z' },
    ]);
  });

  it('should handle empty shiftActivity array gracefully', () => {
    const userShiftData = { shiftActivity: [] };
    const clockOut = '2024-05-02T20:30:00Z';
    clockOutPreviousShift(userShiftData, clockOut);

    expect(userShiftData.shiftActivity).toEqual([]);
  });
});

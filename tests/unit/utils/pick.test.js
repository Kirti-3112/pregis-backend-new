const { pick } = require('../../../src/utils/pick');

describe('pick', () => {
  it('should pick specified keys from an object', () => {
    const inputObject = {
      id: 1,
      name: 'John',
      age: 25,
      email: 'john@example.com',
    };
    const keysToPick = ['id', 'name', 'age'];
    const result = pick(inputObject, keysToPick);
    expect(result).toEqual({
      id: 1,
      name: 'John',
      age: 25,
    });
    expect(inputObject).toEqual({
      id: 1,
      name: 'John',
      age: 25,
      email: 'john@example.com',
    });
  });

  it('should handle cases where inputObject is null or undefined', () => {
    const keysToPick = ['id', 'name', 'age'];
    const resultNull = pick(null, keysToPick);
    const resultUndefined = pick(undefined, keysToPick);
    expect(resultNull).toEqual({});
    expect(resultUndefined).toEqual({});
  });

  it('should handle cases where keysToPick is an empty array', () => {
    const inputObject = {
      id: 1,
      name: 'John',
      age: 25,
      email: 'john@example.com',
    };
    const keysToPick = [];
    const result = pick(inputObject, keysToPick);
    expect(result).toEqual({});
  });
});

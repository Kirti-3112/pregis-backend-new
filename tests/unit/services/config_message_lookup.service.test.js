const mockingoose = require('mockingoose');
const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid');

jest.mock('uuid', () => ({ v4: jest.fn() }));

const {
  createMessageLookup,
  deleteMessageLookup,
  findById,
  getAllMessageLookup,
  updateMessageLookup,
  uploadExcelMessageLookup,
  reportBufferMap,
} = require('../../../src/services/config_message_lookup.service');
const { MessageLookup } = require('../../../src/models');

describe('MessageLookup Service', () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  describe('getAllMessageLookup', () => {
    it('should return paginated message list', async () => {
      mockingoose(MessageLookup).toReturn(2, 'countDocuments');
      mockingoose(MessageLookup).toReturn(
        [{ id: '1', Message: 'Test' }],
        'find'
      );

      const result = await getAllMessageLookup({
        pagination: { page: 1, limit: 10 },
      });

      expect(result.messages).toHaveLength(1);
      expect(result.totalPages).toBe(1);
      expect(result.totalRecords).toBe(2);
    });
  });

  describe('findById', () => {
    it('should return a message by ID', async () => {
      const mockData = { _id: '1', Message: 'Found' };
      mockingoose(MessageLookup).toReturn(mockData, 'findOne');

      const result = await findById('1');
      expect(result.Message).toBe('Found');
    });
  });

  describe('createMessageLookup', () => {
    it('should create a new message lookup', async () => {
      const input = {
        Area: 'AREA001',
        Message: 'Message001',
        MessageBitString: 'MBStr001',
      };
      mockingoose(MessageLookup).toReturn(input, 'save');

      const result = await createMessageLookup(input);
      expect(result.Message).toBe('Message001');
    });
  });

  describe('updateMessageLookup', () => {
    it('should update and return the updated message', async () => {
      const updated = { _id: '1', Message: 'Updated' };
      mockingoose(MessageLookup).toReturn(updated, 'findOneAndUpdate');

      const result = await updateMessageLookup({ id: '1', Message: 'Updated' });
      expect(result.Message).toBe('Updated');
    });

    it('should throw an error if not found', async () => {
      mockingoose(MessageLookup).toReturn(null, 'findOneAndUpdate');

      await expect(
        updateMessageLookup({ id: '1', Message: 'x' })
      ).rejects.toThrow('Message with ID 1 not found');
    });
  });

  describe('deleteMessageLookup', () => {
    it('should delete and return the deleted message', async () => {
      const deleted = { _id: '1', Message: 'Deleted' };
      mockingoose(MessageLookup).toReturn(deleted, 'findOneAndDelete');

      const result = await deleteMessageLookup('1');
      expect(result.Message).toBe('Deleted');
    });

    it('should throw if no message found', async () => {
      mockingoose(MessageLookup).toReturn(null, 'findOneAndDelete');
      await expect(deleteMessageLookup('1')).rejects.toThrow(
        'Message with ID 1 not found'
      );
    });
  });

  describe('uploadExcelMessageLookup', () => {
    it('should process excel buffer and return result summary', async () => {
      const mockBuffer = Buffer.from('');
      const sampleRows = [
        {
          Area: 'Area1',
          Message: 'Hello',
          MessageBitString: '1010',
          AreaNumber: 'A1',
          MessageNumber: 1,
          Expression: 'Expr1',
        },
        {
          Area: '', // incomplete
          Message: '',
          MessageBitString: '',
        },
      ];

      XLSX.read = jest.fn(() => ({
        Sheets: { Sheet1: {} },
        SheetNames: ['Sheet1'],
      }));
      XLSX.utils.sheet_to_json = jest.fn(() => sampleRows);
      XLSX.utils.book_new = jest.fn(() => ({}));
      XLSX.utils.book_append_sheet = jest.fn();
      XLSX.utils.json_to_sheet = jest.fn(() => ({}));
      XLSX.write = jest.fn(() => Buffer.from('excel-content'));
      uuidv4.mockReturnValue('mock-report-id');

      mockingoose(MessageLookup).toReturn([sampleRows[0]], 'insertMany');

      const result = await uploadExcelMessageLookup(mockBuffer);

      expect(result.insertedCount).toBe(1);
      expect(result.duplicateCount).toBe(0);
      expect(result.incompleteCount).toBe(1);
      expect(result.reportId).toBe('mock-report-id');
      expect(reportBufferMap.has('mock-report-id')).toBe(true);
    });

    it('should handle duplicate error from MongoDB insertMany', async () => {
      const sampleRow = {
        Area: 'Area1',
        Message: 'Duplicate',
        MessageBitString: '0001',
      };

      XLSX.read = jest.fn(() => ({
        Sheets: { Sheet1: {} },
        SheetNames: ['Sheet1'],
      }));
      XLSX.utils.sheet_to_json = jest.fn(() => [sampleRow]);
      XLSX.utils.book_new = jest.fn(() => ({}));
      XLSX.utils.book_append_sheet = jest.fn();
      XLSX.utils.json_to_sheet = jest.fn(() => ({}));
      XLSX.write = jest.fn(() => Buffer.from('excel-content'));
      uuidv4.mockReturnValue('report-dup');

      // Mock insertMany to throw a MongoDB duplicate key error
      const error = new Error('Mock duplicate key error');
      error.code = 11000;
      error.writeErrors = [{ index: 0 }];

      jest.spyOn(MessageLookup, 'insertMany').mockRejectedValue(error);

      const result = await uploadExcelMessageLookup(Buffer.from(''));

      expect(result.insertedCount).toBe(0);
      expect(result.duplicateCount).toBe(1);
      expect(result.incompleteCount).toBe(0);
      expect(result.reportId).toBe('report-dup');
    });
  });
});

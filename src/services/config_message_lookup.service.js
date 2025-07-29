/* eslint-disable no-restricted-syntax */
const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid');
const { MessageLookup } = require('../models');

const reportBufferMap = new Map();

const getAllMessageLookup = async (options) => {
  const { page, limit } = options.pagination;
  const count = await MessageLookup.countDocuments();

  const messages = await MessageLookup.find()
    .select()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();

  return {
    messages,
    rowsPerPage: limit,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalRecords: count,
  };
};

const findById = async (id) => {
  const message = await MessageLookup.findById(id).exec();
  return message;
};

const createMessageLookup = async (messageData) => {
  const messageLookup = new MessageLookup(messageData);
  return messageLookup.save();
};

const updateMessageLookup = async (messageData) => {
  const { id, ...updateData } = messageData;
  const updated = await MessageLookup.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new Error(`Message with ID ${id} not found`);
  }

  return updated;
};

const deleteMessageLookup = async (id) => {
  const deleted = await MessageLookup.findByIdAndDelete(id);
  if (!deleted) {
    throw new Error(`Message with ID ${id} not found`);
  }
  return deleted;
};

const uploadExcelMessageLookup = async (excelBuffer) => {
  const { Sheets, SheetNames } = XLSX.read(excelBuffer, { type: 'buffer' });
  const rawRows = XLSX.utils.sheet_to_json(Sheets[SheetNames[0]], {
    defval: '',
  });

  const validRows = [];
  const duplicateRows = [];
  const incompleteRows = [];

  for (const row of rawRows) {
    if (!row.Area || !row.Message || !row.MessageBitString) {
      incompleteRows.push(row);
      // eslint-disable-next-line no-continue
      continue;
    }

    const formatted = {
      Expression: row.Expression || '-',
      Area: row.Area,
      Message: row.Message,
      AreaNumber: row.AreaNumber || '-',
      MessageNumber: row.MessageNumber || 0,
      MessageBitString: row.MessageBitString,
    };
    validRows.push(formatted);
  }

  let insertedCount = 0;
  const inserted = [];
  try {
    inserted.push(
      ...(await MessageLookup.insertMany(validRows, { ordered: false }))
    );
    insertedCount = inserted.length;
  } catch (error) {
    if (error.code === 11000 && Array.isArray(error.writeErrors)) {
      const dupIndexes = error.writeErrors.map((e) => e.index);
      duplicateRows.push(...dupIndexes.map((i) => validRows[i]));
      insertedCount = validRows.length - duplicateRows.length;
    } else {
      throw new Error(`Error inserting rows: ${error.message}`, error);
    }
  }

  // Prepare Excel report
  const wb = XLSX.utils.book_new();

  if (duplicateRows.length > 0) {
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(duplicateRows),
      'Duplicates'
    );
  }

  if (incompleteRows.length > 0) {
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(incompleteRows),
      'Incomplete'
    );
  }

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet([
      {
        Inserted: insertedCount,
        Duplicates: duplicateRows.length,
        Incomplete: incompleteRows.length,
      },
    ]),
    'Summary'
  );

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  const reportId = uuidv4();
  reportBufferMap.set(reportId, buffer);

  // To remove the report after 5 minutes, helps manage memory and storage usage
  setTimeout(() => {
    reportBufferMap.delete(reportId);
  }, 5 * 60 * 1000);

  return {
    insertedCount,
    duplicateCount: duplicateRows.length,
    incompleteCount: incompleteRows.length,
    reportId,
  };
};

module.exports = {
  createMessageLookup,
  deleteMessageLookup,
  findById,
  getAllMessageLookup,
  reportBufferMap,
  updateMessageLookup,
  uploadExcelMessageLookup,
};

const mongoose = require('mongoose');

const mmsAuditTrailSchema = mongoose.Schema({
  collectionName: {
    type: String,
    required: false,
  },
  action: {
    type: String,
    required: false,
  },
  oldValue: {
    type: Object,
    required: false,
  },
  newValue: {
    type: Object,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  userName: {
    type: String,
    required: false,
  },
});

const AuditCollection = mongoose.model(
  'auditCollection',
  mmsAuditTrailSchema,
  'auditCollection'
);

module.exports = AuditCollection;

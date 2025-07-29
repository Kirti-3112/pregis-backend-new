const extensions = {
  XLSX: 'xlsx',
  JSON: 'json',
  FONTCOLOR: '000000',
  BGCOLOR: 'BDCDD6',
};

const machineEventStatus = {
  HOMING: 'Homing',
  READY: 'Ready',
  AUTO: 'Auto',
  MANUAL: 'Manual',
  STOP: 'Stop',
  ERROR: 'Error',
};

const downTimeList = [machineEventStatus.READY, machineEventStatus.STOP];
const machineAndStatusUpTime = [
  machineEventStatus.AUTO,
  machineEventStatus.MANUAL,
];

const startTimerList = ['Auto', 'Manual'];
const stopTimerList = ['Homing', 'Stop', 'Ready'];

const totalStartUptime = ['Auto', 'Manual', 'Ready'];
const totalStopTUptime = ['Homing', 'Stop'];

const pageName = 'machine';

const defaultUpTime = '00:00:00';

const defaultTotalUpTime = '00:00:00';

const defaultDownTime = '00:00:00';

const machineAndStatusDefaultUpTime = '00:00:00';

const machineCycleTime = {
  RECORDING_STARTED: 'started',
  RECORDING_STOPPED: 'stopped',
  RECORDING_PAUSE: 'pause',
  TMUT: 'TMUT', // Total Machine UpTime
  MUT: 'MUT', // Machine UpTime
};

const dashboard = {
  // SUCCESS
  DASHBOARD_STATUS_SUCCESS:
    'D0001 - Get dashboard method executed successfully',
  // FAIL
  DASHBOARD_NOT_FOUND: 'D0002 - Dashboard details not found',
  DASHBOARD_INTERNAL_SERVER_ERROR: 'D0003 - Internal Server Error',
};

const machineAndStatus = {
  // CONSTANT
  NO_ALARM: 'No Alarm !',
  // SUCCESS
  MACHINE_DETAILS: 'M0002 - Get MachineDetails executed successfully',
  // FAIL
  MACHINE_NOT_FOUND: 'M0002 - Machine event details not found',
  MACHINE_INTERNAL_SERVER_ERROR: 'M0002 - Internal Server Error',
};

const cloudAzure = {
  // SUCCESS
  AZURE_STATUS_JSON: 'AZ0001 - Get pushData method executed successfully',
  AZURE_STATUS_XLSX: 'AZ0002 - Get pushData method executed successfully',

  // FAIL
  AZURE_NOT_FOUND: 'AZ0003 - Cloud Azure details not found',
  AZURE_INTERNAL_SERVER_ERROR: 'AZ0004 - Internal Server Error',
};
const jobAndStatus = {
  // SUCCESS
  JOBS_STATUS: 'J0001 - Get jobData method executed successfully',
  // FAIL
  JOBS_NOT_FOUND: 'J0002 - Job data details not found',
  JOBS_INTERNAL_SERVER_ERROR: 'J0003 - Internal Server Error',
};

const configuration = {
  // Success Logger Message
  MACHINE_CONFIG_SUCCESS: (methodName, methodInput) => {
    let message = `CM0001 ${methodName} method executed successfully`;
    if (methodInput) {
      message = `CM0001 ${methodName} method executed successfully. Input: ${methodInput}`;
    }
    return message;
  },

  // Fail Logger Message
  MACHINE_CONFIG_INTERNAL_SERVER_ERROR: 'CM0001 - Internal Server Error',
  MACHINE_CONFIG_NOT_FOUND: (machineConfigId) =>
    `CM0001 - Machine config data not found for machineConfigId : ${machineConfigId}`,
  MACHINE_CONFIG_ALREADY_EXISTS: (communicationType, machineConfigData) => {
    let message = '';
    if (communicationType === 'MQTT') {
      message = `CM0001 - Machine config already exists. hostName : ${machineConfigData.hostName} , portNumber: ${machineConfigData.portNumber}`;
    }
    if (communicationType === 'webService') {
      message = `CM0001 - Machine config already exists. url: ${machineConfigData.url} , webserviceType: ${machineConfigData.webserviceType}`;
    }
    return message;
  },

  // Success Response API Message
  MACHINE_CONFIG_CREATE: 'Machine config record created successfully.',
  MACHINE_CONFIG_UPDATE: (machineConfigId) =>
    `Machine config record updated successfully. Id :${machineConfigId}`,
  MACHINE_CONFIG_DELETE: (machineConfigId) =>
    `Machine config record deleted successfully. Id :${machineConfigId}`,
  MT_DETACH_DEPENDENCIES: (typeName, listOfMachines) =>
    `Detach the __Machine ID: ${typeName}__ from __Machine Lookup: ${listOfMachines}__ before deleting it.`,

  // Fail Response API Message

  MACHINE_CONFIG_ALREADY_EXISTS_MESSAGE: (
    communicationType,
    machineConfigData
  ) => {
    let message = '';
    if (communicationType === 'MQTT') {
      message = `Machine config already exists. hostName : ${machineConfigData.hostName} , portNumber: ${machineConfigData.portNumber}`;
    }
    if (communicationType === 'webService') {
      message = `Machine config already exists. url: ${machineConfigData.url} , webserviceType: ${machineConfigData.webserviceType}`;
    }
    return message;
  },

  MACHINE_CONFIG_NOT_FOUND_MESSAGE: (machineConfigId) =>
    `Machine config Data not found for machineConfigId : ${machineConfigId}`,
  MACHINE_CONFIG_INTERNAL_SERVER_ERROR_MESSAGE: 'Internal Server Error',
};

const Auth = {
  // SUCCESS
  AUTH_REGISTER_SUCCESS: 'A0001 - Get createUser method executed successfully',
  AUTH_LOGIN_SUCCESS:
    'A0002 - Get loginUserWithEmailAndPassword method executed successfully',
  // FAIL
  AUTH_EXITS: 'A0003 - User already exists',
  AUTH_NOT_FOUND: 'A0003 - User details not found',
  AUTH_INTERNAL_SERVER_ERROR: 'A0004 - Internal Server Error',
  AUTH_SIDE_MENU_CONFIGURATION_FAIL:
    'User side-menu generation failed, Please configure policyNamesToDetailsMap correctly',
};
const user = {
  USER_SUCCESS: (methodName, methodInput) => {
    let message = `U0001 ${methodName} method executed successfully`;
    if (methodInput) {
      message = `U0001 ${methodName} method executed successfully. Input: ${methodInput}`;
    }
    return message;
  },

  // Fail Logger Message
  USER_INTERNAL_SERVER_ERROR: 'U0001 - Internal Server Error',
  USER_NOT_FOUND: (userId) =>
    `U0001 - User Data not found for userId : ${userId}`,
  USER_ALREADY_EXISTS: (userName) =>
    `U0001 - User already exists for userName : ${userName}`,

  // Success Response API Message
  USER_CREATE: 'User Record created successfully.',
  USER_UPDATE: (userId) => `User Record updated successfully. Id : ${userId}`,
  USER_DELETE: (userId) =>
    `User Record soft deleted successfully. Id : ${userId}`,

  // Fail Response API Message
  USER_ALREADY_EXISTS_MESSAGE: `User already exists`,
  USER_NOT_FOUND_MESSAGE: (userId) =>
    `User Data not found for userId : ${userId}`,
  USER_INTERNAL_SERVER_ERROR_MESSAGE: 'Internal Server Error',
};
const wms = {
  // SUCCESS
  WMS_REGISTER_SUCCESS: 'WMS0001 - Get createWMS method executed successfully',
  WMS_FETCH_SUCCESS: 'WMS0002 - Get queryWMS method executed successfully',
  WMS_UPDATE_SUCCESS:
    'WMS0003 - Get updateWMSById method executed successfully',
  WMS_DELETE_SUCCESS:
    'WMS0004 - Get deleteWMSById method executed successfully',
  // FAIL
  WMS_EXITS: 'WMS0005 Config Machine already exists',
  WMS_NOT_FOUND: 'WMS0006 - Config Machine details not found',
  WMS_INTERNAL_SERVER_ERROR: 'WMS0007 - Internal Server Error',
};

const machineTypeMessages = {
  // Success Logger Message
  MT_SUCCESS: (methodName, methodInput) => {
    let message = `MT003 ${methodName} method executed successfully`;
    if (methodInput) {
      message = `MT003 ${methodName} method executed successfully. Input: ${methodInput}`;
    }
    return message;
  },

  // Fail Logger Message
  MT_INTERNAL_SERVER_ERROR: 'Internal Server Error',
  MT_NOT_FOUND: (machineTypeId) =>
    `Machine type lookup not found for MachineTypeId : ${machineTypeId}`,
  MT_ALREADY_EXISTS: (machineType) =>
    `Machine type Lookup already exists for MachineType : ${machineType}`,

  // Success Response API Message
  MT_CREATE: 'Machine type lookup record created successfully.',
  MT_UPDATE: (machineTypeId) =>
    `Machine type lookup record updated successfully. Id :${machineTypeId}`,
  MT_DELETE: (machineTypeId) =>
    `Machine type lookup record deleted successfully. Id :${machineTypeId}`,

  // Fail Response API Message
  MT_ALREADY_EXISTS_MESSAGE: `Machine type already exists`,
  MT_DETACH_DEPENDENCIES: (typeName, listOfMachinesorWMS) =>
    `Detach the __Machine Type: ${typeName}__ from __${listOfMachinesorWMS}__ before deleting the Machine Type.`,
};

const configMachineLookupMessages = {
  // Success Logger Message
  ML_SUCCESS: (methodName, methodInput) => {
    let message = `ML003 ${methodName} method executed successfully`;
    if (methodInput) {
      message = `ML003 ${methodName} method executed successfully. Input: ${methodInput}`;
    }
    return message;
  },

  // Fail Logger Message
  ML_INTERNAL_SERVER_ERROR: 'Internal Server Error',
  ML_NOT_FOUND: (machineLookupId) =>
    `Machine lookup not found for MachineLookupId : ${machineLookupId}`,
  ML_ALREADY_EXISTS: (MachineId) =>
    `Machine lookup already exists for machineId : ${MachineId}`,
  ML_MACHINE_NAME_ALREADY_EXISTS: (MachineId) =>
    `Machine Name already exists for machineId : ${MachineId}`,
  // Success Response API Message
  ML_CREATE: 'Machine lookup record created successfully.',
  ML_UPDATE: (machineLookupId) =>
    `Machine lookup record updated successfully. Id :${machineLookupId}`,
  ML_DELETE: (machineLookupId) =>
    `Machine lookup record deleted successfully. Id :${machineLookupId}`,

  // Fail Response API Message
  ML_ALREADY_EXISTS_MESSAGE: `Machine Lookup already exists`,
  MT_DETACH_DEPENDENCIES: (typeName, listGroup) =>
    `Detach the __Machine Lookup: ${typeName}__ from __Machine Group: ${listGroup}__ before deleting it.`,
};

const unitConversionMessages = {
  PREFIX_CODE: 'CU0001',

  ATTACH_PREFIX_CODE_TO_MESSAGE: (message) => {
    if (!message) {
      throw new Error(
        'Message argument is required for method ATTACH_PREFIX_CODE_TO_MESSAGE'
      );
    }

    return `${unitConversionMessages.PREFIX_CODE} - ${message}`;
  },

  // Logger Success message
  METHOD_EXECUTED: (methodName, methodInput) => {
    let message = `${methodName} method executed successfully`;
    if (methodInput) {
      message = `${methodName} method executed successfully. Input: ${methodInput}`;
    }
    return message;
  },

  /**
   * Logger Fail message
   */
  INTERNAL_SERVER_ERROR: 'Internal Server Error',

  /**
   * Not Found message
   * @param {*} unitConversionId
   * @param {*} message
   * @returns
   */
  NOT_FOUND: (unitConversionId, message = '') => {
    let errMessage =
      message === '' ? `Config unit conversion data not found` : message;

    if (unitConversionId) {
      errMessage = `Config unit conversion data not found for ${unitConversionId}`;
    }

    return errMessage;
  },

  /**
   * Record Already Exists message
   * @param {*} machineId
   * @returns
   */
  RECORD_ALREADY_EXISTS: (machineId) => {
    if (machineId) {
      return `Config unit conversion data already exists for this machine ID`;
    }
    return `Config unit conversion data already exists`;
  },

  // Success API Response message

  CREATED_SUCCESS_RESPONSE_UNIT_CONVERSION:
    'Config unit conversion record created successfully.',
  UPDATED_SUCCESS_RESPONSE_UNIT_CONVERSION: (unitConversionId) =>
    `Config unit conversion record updated successfully. Id :${unitConversionId}`,
  DELETED_SUCCESS_RESPONSE_UNIT_CONVERSION: (unitConversionId) =>
    `Config unit conversion record deleted successfully. Id :${unitConversionId}`,
};

const MessageLookupMessages = {
  PREFIX_CODE: 'CML0001',

  ATTACH_PREFIX_CODE_TO_MESSAGE: (message) => {
    if (!message) {
      throw new Error(
        'Message argument is required for method ATTACH_PREFIX_CODE_TO_MESSAGE'
      );
    }

    return `${MessageLookupMessages.PREFIX_CODE} - ${message}`;
  },

  METHOD_EXECUTED: (methodName, methodInput) => {
    let message = `${methodName} method executed successfully`;
    if (methodInput) {
      message = `${methodName} method executed successfully. Input: ${methodInput}`;
    }
    return message;
  },
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  NOT_FOUND: (id) => {
    let message = `Config message lookup data not found`;

    if (id) {
      message = `Config message lookup data not found for ${id}`;
    }

    return message;
  },

  DOWNLOAD_REPORT_SUCCESS: (reportId) =>
    `Excel report sent successfully for ID: ${reportId}`,

  DOWNLOAD_REPORT_NOT_FOUND: (reportId) => {
    if (reportId) {
      return `Excel report not found or may have expired for ID: ${reportId}`;
    }
    return `Excel report not found or may have expired.`;
  },

  REPORT_ID_MISSING: 'Report ID is required to download the Excel report.',

  FILE_DOWNLOAD_ERROR:
    'An unexpected error occurred while downloading the file.',

  SUCCESS_BULK_RESPONSE_MESSAGE_LOOKUP: (
    insertedCount,
    duplicateCount,
    incompleteCount
  ) =>
    `Bulk complete: ${insertedCount} inserted, ${duplicateCount} duplicates skipped, ${incompleteCount} incomplete records skipped.`,
};

const history = {};

const policyMessage = {
  // Success Logger Message
  POLICY_SUCCESS: (methodName, methodInput) => {
    let message = `P003 ${methodName} method executed successfully`;
    if (methodInput) {
      message = `P003 ${methodName} method executed successfully. Input: ${methodInput}`;
    }
    return message;
  },

  // Fail Logger Message
  POLICY_INTERNAL_SERVER_ERROR: 'P003 - Internal Server Error',
  POLICY_NOT_FOUND: (policyId) =>
    `P003 - Policy Data not found for policyId : ${policyId}`,
  POLICY_ALREADY_EXISTS: (policyName) =>
    `P003 - Policy already exists for policyName : ${policyName}`,

  // Success Response API Message
  POLICY_CREATE: 'Policy Record created successfully.',
  POLICY_UPDATE: (policyId) =>
    `Policy Record updated successfully. Id :${policyId}`,
  POLICY_DELETE: (policyId) =>
    `Policy Record deleted successfully. Id :${policyId}`,

  // Fail Response API Message
  POLICY_ALREADY_EXISTS_MESSAGE: `Policy already exists`,
  POLICY_NOT_FOUND_MESSAGE: (policyId) =>
    `Policy Data not found for policyId : ${policyId}`,
  POLICY_INTERNAL_SERVER_ERROR_MESSAGE: 'Internal Server Error',
  POLICY_DELETE_FORBIDDEN:
    'Can not delete policy, it is still assigned to one or more Role.',
  POLICY_UPDATE_FORBIDDEN:
    'Can not update policy status to Inactive, it is still assigned to one or more Role.',
};

const roleMessage = {
  // Success Logger Message
  ROLE_SUCCESS: (methodName, methodInput) => {
    let message = `R007 ${methodName} method executed successfully`;
    if (methodInput) {
      message = `R007 ${methodName} method executed successfully. Input: ${methodInput}`;
    }
    return message;
  },

  // Fail Logger Message
  ROLE_INTERNAL_SERVER_ERROR: 'R007 - Internal Server Error',
  ROLE_NOT_FOUND: (roleId) =>
    `R007 - Role Data not found for roleId : ${roleId}`,
  ROLE_ALREADY_EXISTS: (roleName) =>
    `R007 - Role already exists for roleName : ${roleName}`,

  // Success Response API Message
  ROLE_CREATE: 'Role Record created successfully.',
  ROLE_UPDATE: (roleId) => `Role Record updated successfully. Id :${roleId}`,
  ROLE_DELETE: (roleId) => `Role Record deleted successfully. Id :${roleId}`,

  // Fail Response API Message
  ROLE_ALREADY_EXISTS_MESSAGE: `Role already exists`,
  ROLE_NOT_FOUND_MESSAGE: (roleId) =>
    `Role Data not found for roleId : ${roleId}`,
  ROLE_INTERNAL_SERVER_ERROR_MESSAGE: 'Internal Server Error',
  ROLE_DELETE_FORBIDDEN:
    'Can not delete Role, it is still assigned to one or more User.',

  ROLE_UPDATE_FORBIDDEN:
    'Can not update role status to Inactive , it is still assigned to one or more User.',
};

const configMachineGroupMessage = {
  // Success Logger Message
  CONFIG_MACHINE_GROUP_SUCCESS: (methodName, methodInput) => {
    let message = `MG007 ${methodName} method executed successfully`;
    if (methodInput) {
      message = `MG007 ${methodName} method executed successfully. Input: ${methodInput}`;
    }
    return message;
  },

  // Fail Logger Message
  CONFIG_MACHINE_GROUP_INTERNAL_SERVER_ERROR: 'MG007 - Internal Server Error',
  CONFIG_MACHINE_GROUP_NOT_FOUND: (machineGroupId) =>
    `MG007 - Machine Group Data not found for machineGroupId : ${machineGroupId}`,
  CONFIG_MACHINE_GROUP_ALREADY_EXISTS: (machineGroupName) =>
    `MG007 - Machine Group already exists for machineGroupName : ${machineGroupName}`,

  // Success Response API Message
  CONFIG_MACHINE_GROUP_CREATE: 'Machine Group Record created successfully.',
  CONFIG_MACHINE_GROUP_UPDATE: (machineGroupId) =>
    `Machine Group Record updated successfully. Id :${machineGroupId}`,
  CONFIG_MACHINE_GROUP_DELETE: (machineGroupId) =>
    `Machine Group Record deleted successfully. Id :${machineGroupId}`,

  // Fail Response API Message
  CONFIG_MACHINE_GROUP_ALREADY_EXISTS_MESSAGE: `Machine Group already exists`,
  CONFIG_MACHINE_GROUP_NOT_FOUND_MESSAGE: (machineGroupId) =>
    `Machine Group Data not found for machineGroupId : ${machineGroupId}`,
  CONFIG_MACHINE_GROUP_INTERNAL_SERVER_ERROR_MESSAGE: 'Internal Server Error',
  CONFIG_MACHINE_GROUP_DELETE_FORBIDDEN:
    'Can not delete Machine Group, it is still assigned to one or more User.',

  CONFIG_MACHINE_GROUP_UPDATE_FORBIDDEN:
    'Can not update Machine Group to false , it is still assigned to one or more User.',
  CONFIG_MACHINE_GROUP_DETACH_DEPENDENCIES: (machineGroupName, listOfUsers) =>
    `Detach the __MachineGroup: ${machineGroupName}__ from this __User: ${listOfUsers}__ before deleting it.`,
};

const configWorkGroupMessage = {
  // Success Logger Message
  CONFIG_WORK_GROUP_SUCCESS: (methodName, methodInput) => {
    let message = `WG007 ${methodName} method executed successfully`;
    if (methodInput) {
      message = `WG007 ${methodName} method executed successfully. Input: ${methodInput}`;
    }
    return message;
  },

  // Fail Logger Message
  CONFIG_WORK_GROUP_INTERNAL_SERVER_ERROR: 'WG007 - Internal Server Error',
  CONFIG_WORK_GROUP_NOT_FOUND: (workGroupId) =>
    `WG007 - Work Group Data not found for machineGroupId : ${workGroupId}`,
  CONFIG_WORK_GROUP_ALREADY_EXISTS: (workGroupName) =>
    `WG007 - Work Group already exists for machineGroupName : ${workGroupName}`,

  // Success Response API Message
  CONFIG_WORK_GROUP_CREATE: 'Work Group Record created successfully.',
  CONFIG_WORK_GROUP_UPDATE: (workGroupId) =>
    `Work Group Record updated successfully. Id :${workGroupId}`,
  CONFIG_WORK_GROUP_DELETE: (workGroupId) =>
    `Work Group Record deleted successfully. Id :${workGroupId}`,

  // Fail Response API Message
  CONFIG_WORK_GROUP_ALREADY_EXISTS_MESSAGE: `Work Group already exists`,
  CONFIG_WORK_GROUP_NOT_FOUND_MESSAGE: (workGroupId) =>
    `Work Group Data not found for workGroupId : ${workGroupId}`,
  CONFIG_WORK_GROUP_INTERNAL_SERVER_ERROR_MESSAGE: 'Internal Server Error',
  CONFIG_WORK_GROUP_DELETE_FORBIDDEN:
    'Can not delete Work Group, it is still assigned to one or more User.',

  CONFIG_WORK_GROUP_UPDATE_FORBIDDEN:
    'Can not update Work Group to false , it is still assigned to one or more User.',
};

const accessConfigurationConstant = {
  ACCESS_CONFIG_SUCCESS: (methodName, methodInput) => {
    let message = `ACC008 ${methodName} method executed successfully`;
    if (methodInput) {
      message = `ACC008 ${methodName} method executed successfully. Input: ${methodInput}`;
    }
    return message;
  },
  ACCESS_CONFIG_INTERNAL_SERVER_ERROR_MESSAGE: 'Internal Server Error',
};

const userMachineShiftConstant = {
  USER_MACHINE_SHIFT_SUCCESS: (methodName, methodInput) => {
    let message = `UMS003 ${methodName} method executed successfully`;
    if (methodInput) {
      message = `UMS003 ${methodName} method executed successfully. Input: ${methodInput}`;
    }
    return message;
  },
  USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR: 'Internal Server Error',

  // Success Response API Message
  USER_MACHINE_SHIFT_CREATE: 'User machine shift added successfully',
  USER_MACHINE_SHIFT_UPDATE: 'User machine shift updated successfully',
  USER_MACHINE_SHIFT_STARTED: 'User machine shift started succesfully',
  USER_MACHINE_SHIFT_ENDED: 'User machine shift ended succesfully',
};

const userShiftTimes = {
  MORNING: {
    start: 8,
  },
  EVENING: {
    start: 16,
  },
  NIGHT: {
    start: 0,
  },
};

const defaultPreferenceValues = {
  DATE_AND_TIME: {
    DEFAULT_DATE_FORMAT: 'MM/DD/YYYY',
    DEFAULT_TIME_FORMAT: '24 Hours',
    DEFAULT_TIME_ZONE: '(UTC-06:00) Central Time (US & Canada)',
  },
  AUTH_SESSION: {
    ACCESS_TOKEN_TTL: 240, // 4 Hours
  },
};

const testConnectionType = {
  CONFIG_WMS: 'ConfigWMS',
  CONFIG_MACHINE: 'ConfigMachine',
};

const jobAndStatusTableView = [
  {
    field: 'jobId',
    title: 'ID',
  },
  {
    field: 'updatedAt',
    title: 'Date',
  },
  {
    field: 'updatedAt',
    title: 'Time',
  },
  {
    field: 'barcode',
    title: 'Barcode',
  },
];

const jobDetailsSizeMaster = {
  TYPE: 'size-master',
  TABLE_VIEW_FIELDS_ARRAY: [
    ...jobAndStatusTableView,
    {
      field: 'cutDownNeeded',
      title: 'Cut Down Needed',
    },
    {
      field: 'productionStatus',
      title: 'Production Status',
    },
  ],
  DETAILED_VIEW_FIELDS_ARRAY: [
    {
      field: 'jobId',
      title: 'ID',
    },
    {
      field: 'updatedAt',
      title: 'Date',
    },
    {
      field: 'barcode',
      title: 'Barcode',
    },
    {
      field: 'machineId',
      title: 'Machine ID',
    },
    {
      field: 'operatorID',
      title: 'Operator ID',
    },
    {
      field: 'cutDownNeeded',
      title: 'Cut Down Needed',
    },
    {
      field: 'importedTime',
      title: 'Imported Time',
    },
    {
      field: 'createdTime',
      title: 'Created Time',
    },
    {
      field: 'completedTime',
      title: 'Completed Time',
    },
    {
      field: 'timeZoneOffset',
      title: 'Time Zone Offset',
    },
    {
      field: 'productionStatus',
      title: 'Production Status',
    },
    {
      field: 'type',
      title: 'Type',
    },
    {
      field: 'unitOfMeasure',
      title: 'Unit Of Measure',
    },
    {
      field: 'boxLength',
      title: 'Box Length',
    },
    {
      field: 'boxWidth',
      title: 'Box Width',
    },
    {
      field: 'boxHeight',
      title: 'Box Height',
    },
    {
      field: 'boxWeight',
      title: 'Box Weight',
    },
    {
      field: 'command',
      title: 'Command',
    },
    {
      field: 'boxLengthMeasured',
      title: 'Box Length Measured',
    },
    {
      field: 'boxWidthMeasured',
      title: 'Box Width Measured',
    },
    {
      field: 'boxHeightMeasured',
      title: 'Box Height Measured',
    },
    {
      field: 'cutDownLength',
      title: 'Cut Down Length',
    },
    {
      field: 'productHeightInBox',
      title: 'Product Height in Box',
    },
    {
      field: 'reported',
      title: 'Reported',
    },
    {
      field: 'boxHeightAfterCutDown',
      title: 'Box Height After Cut Down',
    },
    {
      field: 'recipeID',
      title: 'Recipe ID',
    },
    {
      field: 'machineSpeed',
      title: 'Machine Speed',
    },
    {
      field: 'volumeReductionPercent',
      title: 'Volume Reduction (%)',
    },
    {
      field: 'pushedToCloud',
      title: 'Pushed To Cloud',
    },
    {
      field: 'additionalData1',
      title: 'Additional Data 1',
    },
    {
      field: 'additionalData2',
      title: 'Additional Data 2',
    },
    {
      field: 'additionalData3',
      title: 'Additional Data 3',
    },
    {
      field: 'additionalData4',
      title: 'Additional Data 4',
    },
    {
      field: 'additionalData5',
      title: 'Additional Data 5',
    },
    {
      field: 'duration',
      title: 'Duration',
    },
    {
      field: 'reasonCode',
      title: 'Reason Code',
    },
    // {
    //   field: 'dimWeightCharge',
    //   title: 'Dim Weight Charge',
    // },
    {
      field: 'orginalCost',
      title: 'Orginal Cost',
    },
    {
      field: 'newCost',
      title: 'New Cost',
    },
    {
      field: 'savings',
      title: 'Savings',
    },
  ],
};

const jobDetailsSenseAndDispense = {
  TYPE: 'sense-and-dispense',
  TABLE_VIEW_FIELDS_ARRAY: [
    ...jobAndStatusTableView,
    {
      field: 'voidFillTypeUsed',
      title: 'Void Fill Type Used',
    },
    {
      field: 'productionStatus',
      title: 'Production Status',
    },
  ],
  DETAILED_VIEW_FIELDS_ARRAY: [
    {
      field: 'jobId',
      title: 'ID',
    },
    {
      field: 'updatedAt',
      title: 'Date',
    },
    {
      field: 'barcode',
      title: 'Barcode',
    },
    {
      field: 'machineId',
      title: 'Machine ID',
    },
    {
      field: 'customerId',
      title: 'Customer ID',
    },
    {
      field: 'voidFillTypeUsed',
      title: 'Void Fill Type Used',
    },
    // {
    //   // commented dispenseType in sprint 19/MAC-1314
    //   field: 'dispenseType',
    //   title: 'Dispense Type',
    // },
    {
      field: 'importedTime',
      title: 'Imported Time',
    },
    {
      field: 'createdTime',
      title: 'Created Time',
    },
    {
      field: 'completedTime',
      title: 'Completed Time',
    },
    {
      field: 'productionStatus',
      title: 'Production Status',
    },
    {
      field: 'boxLength',
      title: 'Box Length',
    },
    {
      field: 'boxWidth',
      title: 'Box Width',
    },
    {
      field: 'boxHeight',
      title: 'Box Height',
    },
    {
      field: 'boxWeight',
      title: 'Box Weight',
    },
    {
      field: 'unitOfMeasure',
      title: 'Unit Of Measure',
    },
    {
      field: 'boxLengthMeasured',
      title: 'Measured Length',
    },
    {
      field: 'boxWidthMeasured',
      title: 'Measured Width',
    },
    {
      field: 'boxHeightMeasured',
      title: 'Measured Height',
    },
    {
      field: 'boxHeightClosed',
      title: 'Box Height Closed',
    },
    {
      field: 'measuredWeight',
      title: 'Measured Weight',
    },
    {
      field: 'boxVolume',
      title: 'Box Volume',
    },
    {
      field: 'productVolume',
      title: 'Product Volume',
    },
    {
      field: 'voidVolume',
      title: 'Void Volume',
    },
    {
      field: 'voidPercentage',
      title: 'Void Percentage (%)',
    },
    {
      field: 'airPillowsDispensed',
      title: 'Air Pillows Dispensed',
    },
    {
      field: 'airPillowSize',
      title: 'Air Pillow Size',
    },
    {
      field: 'paperLengthDispensed',
      title: 'Paper Length Dispensed',
    },
    {
      field: 'paperWebWidth',
      title: 'Paper Web Width',
    },
    {
      field: 'paperWeight',
      title: 'Paper Weight',
    },
    {
      field: 'imageFileLocation',
      title: 'Image File Location',
    },
    {
      field: 'duration',
      title: 'Duration',
    },
    {
      field: 'additionalData1',
      title: 'Additional Data 1',
    },
    {
      field: 'additionalData2',
      title: 'Additional Data 2',
    },
    {
      field: 'additionalData3',
      title: 'Additional Data 3',
    },
    {
      field: 'additionalData4',
      title: 'Additional Data 4',
    },
    {
      field: 'additionalData5',
      title: 'Additional Data 5',
    },
    // {
    //   field: 'volumeReductionPercent',
    //   title: 'Volume Reduction (%)',
    // },
    {
      field: 'reasonCode',
      title: 'Reason Code',
    },
    // {
    //   field: 'dimWeightCharge',
    //   title: 'Dim Weight Charge',
    // },
    // {
    //   field: 'orginalCost',
    //   title: 'Orginal Cost',
    // },
    // {
    //   field: 'newCost',
    //   title: 'New Cost',
    // },
    // {
    //   field: 'savings',
    //   title: 'Savings',
    // },
    {
      field: 'stationRecords',
      title: 'Station Records',
      subFields: [
        {
          field: '',
          title: 'Station Records',
        },
        {
          field: 'stationName',
          title: 'Station Name',
        },
        {
          field: 'stationIndex',
          title: 'Station Index',
        },
        {
          field: 'stationStartTime',
          title: 'Station Start Time',
        },
        {
          field: 'stationExitTime',
          title: 'Station Exit Time',
        },
        {
          field: 'stationDuration',
          title: 'Station Duration',
        },
      ],
    },
    {
      field: 'dispenseEvents',
      title: 'Dispense Events',
      subFields: [
        {
          field: '',
          title: 'Dispense Events',
        },
        {
          field: 'eventName',
          title: 'Event Name',
        },
        {
          field: 'dispenseType',
          title: 'Dispense Type',
        },
        {
          field: 'startTime',
          title: 'Start Time',
        },
        {
          field: 'duration',
          title: 'Duration',
        },
        {
          field: 'airPillowCount',
          title: 'Air Pillow Count',
        },

        {
          field: 'dispenseLength',
          title: 'Dispense Length',
        },
      ],
    },
  ],
};

const jobDetailsSenseAndDispenseExtraFieldToFetch = ['stationDuration'].join(
  ' '
);

const status = {
  ACTIVE: 'Active',
  IN_ACTIVE: 'Inactive',
};

const features = {
  ENABLE: 'Enable',
  DISABLE: 'Disable',
};

const policyKeyNameMap = {
  DASHBOARD: 'Dashboard',
  MACHINE_AND_STATUS: 'Machine &  Status',
  JOBS_AND_STATUS: 'Jobs & Status',
  CONFIGURATION_WMS: 'Configuration-WMS',
  CONFIGURATION_MACHINE: 'Configuration-Machine',
  CONFIGURATION_WORKGROUP: 'Configuration-Workgroup',
  CONFIGURATION_MACHINE_GROUP: 'Configuration-Machine Group',
  CONFIGURATION_MACHINE_LOOKUP: 'Configuration-Machine Lookup',
  CONFIGURATION_MACHINE_TYPE: 'Configuration-Machine Type',
  CONFIGURATION_UNIT_CONVERSION: 'Configuration-Unit Conversion',
  CONFIGURATION_MESSAGE_LOOKUP: 'Configuration-Message Lookup',
  USER_MANAGEMENT_POLICIES: 'User Management-Policies',
  USER_MANAGEMENT_ROLES: 'User Management-Roles',
  USER_MANAGEMENT_USERS: 'User Management-Users',
  USER_MANAGEMENT_USERS_SHIFTS: 'User Management-Users Shifts',
  HISTORY_LOGGED_EVENTS: 'History-Logged Events',
  HISTORY_GRAPHS: 'History-Graphs',
  HISTORY_SEARCH_REPORTS: 'History-Search Reports',
  WELCOME_PAGE: 'Welcome Page',
  USERS_SCREEN: 'Users Screen',
  MODIFY_USER: 'Modify User',
};

const policyNamesToDetailsMap = {
  [policyKeyNameMap.DASHBOARD]: {
    title: 'Dashboard',
    path: '/dashboard',
    policyName: policyKeyNameMap.DASHBOARD,
  },
  [policyKeyNameMap.MACHINE_AND_STATUS]: {
    title: 'Machine & Status',
    path: '/machine_and_status',
    policyName: policyKeyNameMap.MACHINE_AND_STATUS,
  },
  [policyKeyNameMap.JOBS_AND_STATUS]: {
    title: 'Jobs & Status',
    path: '/jobs_and_status',
    policyName: policyKeyNameMap.JOBS_AND_STATUS,
  },
  [policyKeyNameMap.CONFIGURATION_WMS]: {
    title: 'WMS',
    path: '/configure/wms',
    policyName: policyKeyNameMap.CONFIGURATION_WMS,
  },
  [policyKeyNameMap.CONFIGURATION_MACHINE]: {
    title: 'Machine',
    path: '/configure/machine',
    policyName: policyKeyNameMap.CONFIGURATION_MACHINE,
  },
  [policyKeyNameMap.CONFIGURATION_WORKGROUP]: {
    title: 'Work Group',
    path: '/configure/work_group',
    policyName: policyKeyNameMap.CONFIGURATION_WORKGROUP,
  },
  [policyKeyNameMap.CONFIGURATION_UNIT_CONVERSION]: {
    title: 'Unit Conversion',
    path: '/configure/unit_conversion',
    policyName: policyKeyNameMap.CONFIGURATION_UNIT_CONVERSION,
  },
  [policyKeyNameMap.CONFIGURATION_MESSAGE_LOOKUP]: {
    title: 'Message Lookup',
    path: '/configure/message_lookup',
    policyName: policyKeyNameMap.CONFIGURATION_MESSAGE_LOOKUP,
  },

  [policyKeyNameMap.CONFIGURATION_MACHINE_GROUP]: {
    title: 'Machine Group',
    path: '/configure/machine_group',
    policyName: policyKeyNameMap.CONFIGURATION_MACHINE_GROUP,
  },
  [policyKeyNameMap.CONFIGURATION_MACHINE_LOOKUP]: {
    title: 'Machine Lookup',
    path: '/configure/machine_lookup',
    policyName: policyKeyNameMap.CONFIGURATION_MACHINE_LOOKUP,
  },
  [policyKeyNameMap.CONFIGURATION_MACHINE_TYPE]: {
    title: 'Machine Type',
    path: '/configure/machine_type',
    policyName: policyKeyNameMap.CONFIGURATION_MACHINE_TYPE,
  },
  [policyKeyNameMap.HISTORY_GRAPHS]: {
    title: 'Graphs',
    path: '/history/graphs',
    policyName: policyKeyNameMap.HISTORY_GRAPHS,
  },
  [policyKeyNameMap.HISTORY_LOGGED_EVENTS]: {
    title: 'Logged Events',
    path: '/history/logged_events',
    policyName: policyKeyNameMap.HISTORY_LOGGED_EVENTS,
  },
  [policyKeyNameMap.HISTORY_SEARCH_REPORTS]: {
    title: 'Search Reports',
    path: '/history/search_reports',
    policyName: policyKeyNameMap.HISTORY_SEARCH_REPORTS,
  },
  [policyKeyNameMap.USER_MANAGEMENT_POLICIES]: {
    title: 'Policies',
    path: '/user_management/policies',
    policyName: policyKeyNameMap.USER_MANAGEMENT_POLICIES,
  },
  [policyKeyNameMap.USER_MANAGEMENT_ROLES]: {
    title: 'Roles',
    path: '/user_management/roles',
    policyName: policyKeyNameMap.USER_MANAGEMENT_ROLES,
  },
  [policyKeyNameMap.USER_MANAGEMENT_USERS_SHIFTS]: {
    title: 'Users Shifts',
    path: '/user_management/users_shifts',
    policyName: policyKeyNameMap.USER_MANAGEMENT_USERS_SHIFTS,
  },
  [policyKeyNameMap.USER_MANAGEMENT_USERS]: {
    title: 'Users',
    path: '/user_management/users',
    policyName: policyKeyNameMap.USER_MANAGEMENT_USERS,
  },
  [policyKeyNameMap.WELCOME_PAGE]: {
    path: '/user_shift',
    policyName: policyKeyNameMap.WELCOME_PAGE,
  },
};

const sideMenuConfiguration = {
  menus: [
    policyNamesToDetailsMap[policyKeyNameMap.DASHBOARD],
    policyNamesToDetailsMap[policyKeyNameMap.MACHINE_AND_STATUS],
    policyNamesToDetailsMap[policyKeyNameMap.JOBS_AND_STATUS],
    {
      title: 'Configuration',
      path: '/configure',
      subMenus: [
        policyNamesToDetailsMap[policyKeyNameMap.CONFIGURATION_MACHINE_TYPE],
        policyNamesToDetailsMap[policyKeyNameMap.CONFIGURATION_MACHINE],
        policyNamesToDetailsMap[policyKeyNameMap.CONFIGURATION_MACHINE_LOOKUP],
        policyNamesToDetailsMap[policyKeyNameMap.CONFIGURATION_MACHINE_GROUP],
        policyNamesToDetailsMap[policyKeyNameMap.CONFIGURATION_WORKGROUP],
        policyNamesToDetailsMap[policyKeyNameMap.CONFIGURATION_WMS],
        policyNamesToDetailsMap[policyKeyNameMap.CONFIGURATION_UNIT_CONVERSION],
        policyNamesToDetailsMap[policyKeyNameMap.CONFIGURATION_MESSAGE_LOOKUP],
      ],
    },
    {
      title: 'User Management',
      path: '/user_management',
      subMenus: [
        policyNamesToDetailsMap[policyKeyNameMap.USER_MANAGEMENT_POLICIES],
        policyNamesToDetailsMap[policyKeyNameMap.USER_MANAGEMENT_ROLES],
        policyNamesToDetailsMap[policyKeyNameMap.USER_MANAGEMENT_USERS],
        policyNamesToDetailsMap[policyKeyNameMap.USER_MANAGEMENT_USERS_SHIFTS],
      ],
    },
    {
      title: 'History',
      path: '/history',
      subMenus: [
        policyNamesToDetailsMap[policyKeyNameMap.HISTORY_GRAPHS],
        policyNamesToDetailsMap[policyKeyNameMap.HISTORY_LOGGED_EVENTS],
        policyNamesToDetailsMap[policyKeyNameMap.HISTORY_SEARCH_REPORTS],
      ],
    },
  ],
};

const dimensionConversion = {
  centimeter: {
    millimeter: 10,
    inch: 0.393701,
    foot: 0.0328084,
  },
  millimeter: {
    centimeter: 0.1,
    inch: 0.0393701,
    foot: 0.00328084,
  },
  inch: {
    centimeter: 2.54,
    millimeter: 25.4,
    foot: 0.0833333,
  },
  foot: {
    centimeter: 30.48,
    millimeter: 304.8,
    inch: 12,
  },
};

const volumeConversion = {
  cubic_centimeter: {
    cubic_inch: 0.0610237,
    cubic_feet: 3.53147e-5,
    cubic_meter: 1e-6,
  },
  cubic_inch: {
    cubic_centimeter: 16.3871,
    cubic_feet: 0.000578704,
    cubic_meter: 1.63871e-5,
  },
  cubic_feet: {
    cubic_centimeter: 28316.8,
    cubic_inch: 1728,
    cubic_meter: 0.0283168,
  },
  cubic_meter: {
    cubic_centimeter: 1e6,
    cubic_inch: 61023.7,
    cubic_feet: 35.3147,
  },
};

const weightConversion = {
  pound: { kilogram: 0.453592, gram: 453.592 },
  kilogram: { pound: 2.20462, gram: 1000 },
  gram: { kilogram: 0.001, pound: 0.00220462 },
};

const conversionType = {
  dimension: dimensionConversion,
  volume: volumeConversion,
  weight: weightConversion,
};

const listOfMeasurementField = {
  dimension: Object.freeze({
    boxLength: 'boxLength',
    boxWidth: 'boxWidth',
    boxHeight: 'boxHeight',
    boxLengthMeasured: 'boxLengthMeasured',
    boxWidthMeasured: 'boxWidthMeasured',
    boxHeightMeasured: 'boxHeightMeasured',
    boxHeightClosed: 'boxHeightClosed',
    paperLengthDispensed: 'paperLengthDispensed',
    paperWebWidth: 'paperWebWidth',
    cutDownLength: 'cutDownLength',
    productHeightInBox: 'productHeightInBox',
    boxHeightAfterCutDown: 'boxHeightAfterCutDown',
    dispenseLength: 'dispenseLength',
  }),
  volume: Object.freeze({
    boxVolume: 'boxVolume',
    productVolume: 'productVolume',
    voidVolume: 'voidVolume',
  }),
  weight: Object.freeze({
    boxWeight: 'boxWeight',
    measuredWeight: 'measuredWeight',
    paperWeight: 'paperWeight',
  }),
};
const userRoles = {
  ADMINISTRATOR: 'Administrator',
  QA: 'QA',
  SERVICE: 'Service',
  SUPERVISOR: 'Supervisor',
  OPERATOR: 'Operator',
};
const messageLookupBulkInsertionTemplatePath =
  'public/static/message-lookup.xlsx';

const nativeUOM = {
  cubiccentimeter: 'cubic_centimeter',
  millimeter: 'millimeter',
  kilogram: 'kilogram',
};
module.exports = Object.freeze({
  EXTENSIONS: extensions,
  START_TIMER: startTimerList,
  STOP_TIMER: stopTimerList,
  START_TOTAL_TIMER: totalStartUptime,
  STOP_TOTAL_TIMER: totalStopTUptime,
  PAGE_NAME: pageName,
  DASHBOARD: dashboard,
  MACHINE_STATUS: machineAndStatus,
  JOB_STATUS: jobAndStatus,
  CONFIGURATION_MACHINE: configuration,
  UNIT_CONVERSION_MESSAGES: unitConversionMessages,
  HISTORY: history,
  DEFAULT_UPTIME: defaultUpTime,
  DEFAULT_DOWNTIME: defaultDownTime,
  DEFAULT_TOTAL_UPTIME: defaultTotalUpTime,
  MACHINE_CYCLE_TIME: machineCycleTime,
  CLOUD_AZURE: cloudAzure,
  AUTH: Auth,
  USER: user,
  WMS: wms,
  WMS_SECRET_TOKEN: 'WMS_SECRETE_TOKEN',
  MACHINE_TYPE: machineTypeMessages,
  MESSAGE_LOOKUP: MessageLookupMessages,
  POLICY: policyMessage,
  ROLE: roleMessage,
  ACCESS_CONFIG: accessConfigurationConstant,
  CONFIG_MACHINE_LOOKUP: configMachineLookupMessages,
  CONFIG_MACHINE_GROUP: configMachineGroupMessage,
  CONFIG_WORK_GROUP: configWorkGroupMessage,
  USER_MACHINE_SHIFT: userMachineShiftConstant,
  USER_DEFAULT_ROLENAME: 'Operator',
  MACHINE_EVENT_STATUS: machineEventStatus,
  DOWNTIME_LIST: downTimeList,
  MACHINE_AND_STATUS_UPTIME_LIST: machineAndStatusUpTime,
  MACHINE_AND_STATUS_DEFAULT_UPTIME: machineAndStatusDefaultUpTime,
  TEST_CONNECTION_TYPE: testConnectionType,
  USER_SHIFT_TIMES: userShiftTimes,
  DEFAULT_PREFERENCES_VALUES: defaultPreferenceValues,
  JOB_DATA__SIZE_MASTER: jobDetailsSizeMaster,
  JOB_DATA__SENSE_AND_DISPENSE: jobDetailsSenseAndDispense,
  JOB_DATA__SENSE_AND_DISPENSE__EXTRA_FIELD_TO_FETCH:
    jobDetailsSenseAndDispenseExtraFieldToFetch,
  STATUS: status,
  FEATURES: features,
  POLICYNAMES_TO_DETAILS_MAP: policyNamesToDetailsMap,
  SIDE_MENU_CONFIGURATION: sideMenuConfiguration,
  DIMENSION_CONVERSION: dimensionConversion,
  VOLUME_CONVERSION: volumeConversion,
  COVERSION_TYPE: conversionType,
  LIST_OF_MEASUREMENT_FIELD: listOfMeasurementField,
  USER_ROLES: userRoles,
  MESSAGE_LOOKUP_BULK_INSERTION_TEMPLATE_FILE_PATH:
    messageLookupBulkInsertionTemplatePath,
  NATIVE_UOM: nativeUOM,
});

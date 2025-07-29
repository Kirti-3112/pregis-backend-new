const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const { userMachineShiftService, userService } = require('../services');
const logger = require('../config/logger');
const { jobImportCheck } = require('../services/jobs.service');

const activeSessions = {};

function generateSessionIdAndAssignToUser(msg, socket) {
  const sessionId = uuidv4();
  logger.info(`SessionId: ${sessionId} mapped to UserId: ${msg.userId}`);
  activeSessions[msg.userId] = { sessionId, socketId: socket.id };
  return sessionId;
}

function revokeExistingSession(socketId) {
  logger.debug(`Before : Revoke session for SocketId: ${socketId}`);
  Object.keys(activeSessions).some((userId) => {
    if (activeSessions[userId].socketId === socketId) {
      delete activeSessions[userId];
      return true; // Exit the some() method
    }
    return false;
  });
  logger.debug(`After : Session revoked for SocketId: ${socketId}`);
}

async function getUserNameByUserId(userId) {
  const userDetails = await userService.getUserById(userId);
  logger.info(`getUserById Service call. User : ${userDetails.displayName}`);
  return userDetails.displayName;
}

async function checkResourceAvailabilityListener(msg, socket, callback) {
  logger.info(
    `Data Received from Connected Client  Data :${JSON.stringify(msg)}`
  );
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const endOfDay = new Date().setHours(23, 59, 59, 999);

  // other operator running shift
  const runningShiftDetails =
    await userMachineShiftService.getUserMachineGroupCurrentDayShift({
      userId: { $ne: msg.userId },
      currentMachineGroupId: msg.selectedMachineGroupId,
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

  logger.info(
    `Running Shift Details of other Operator.  Data :${runningShiftDetails}`
  );

  if (runningShiftDetails && Object.keys(runningShiftDetails).length > 0) {
    // send this message to login use for request machine group
    socket.broadcast.emit('request-resource-access', {
      userId: runningShiftDetails.userId,
      machineGroup: runningShiftDetails.currentMachineGroupId,
      resouceAvailabilty: false,
      waitingTime: '5m',
      requestForAccessResource: true,
      requestAccessUserDeatils: {
        userId: msg.userId,
        userName: await getUserNameByUserId(msg.userId),
        machineGroupName: msg.selectedMachineGroupName,
      },
    });
    // callback message to request user to wait for 5 min.
    callback({
      socketId: socket.id,
      userId: msg.userId,
      machineGroup: msg.currentMachineGroupId,
      resouceAvailabilty: false,
      waitingTime: '5m',
      existinglogedInUserDeatils: {
        userId: runningShiftDetails.userId,
        userName: await getUserNameByUserId(runningShiftDetails.userId),
        machineGroup: runningShiftDetails.currentMachineGroupId,
        machineGroupName: msg.selectedMachineGroupName,
      },
    });
  } else {
    const currentOperatorShiftDetails =
      await userMachineShiftService.getUserMachineGroupCurrentDayShift({
        userId: msg.userId,
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      });
    logger.info(
      `Current operator Running Shift Details.  Data :${runningShiftDetails}`
    );
    if (
      currentOperatorShiftDetails &&
      Object.keys(currentOperatorShiftDetails).length > 0
    ) {
      // action session
      if (activeSessions[msg.userId]) {
        // call to request user as session is active for current user.
        callback({
          userId: msg.userId,
          machineGroup: currentOperatorShiftDetails.currentMachineGroupId,
          resouceAvailabilty: false,
          sessionActive: true,
          exstingSessionDetails: activeSessions[msg.userId],
        });
      } else {
        // new use sessionId will generate
        const sessionId = generateSessionIdAndAssignToUser(msg, socket);
        callback({
          //  use can login and session will store at backend .
          socketId: socket.id,
          userId: currentOperatorShiftDetails.userId,
          machineGroup: currentOperatorShiftDetails.currentMachineGroupId,
          resouceAvailabilty: true,
          sessionActive: false,
          sessionId,
        });
      }
    } else {
      // intial call if no shift available .
      logger.warn('No shift record available for Today!');
      callback({ message: null });
    }
  }
}

// Grant User Resource Access Request
async function grantResourceAccessListener(msg, socket, callback) {
  // send message to request resource user as request is granted
  socket.broadcast.emit('granted-resource-access', {
    userId: msg.userId,
    machineGroup: msg.currentMachineGroupId,
    resouceAvailabilty: true,
    waitingTime: '0m',
    grantedAccess: true,
  });
  // callback to granted user to logout from current session.
  callback({
    socketId: socket.id,
    userId: msg.requestGrantedUserDetails.userId,
    resouceAvailabilty: true,
    waitingTime: '5m',
    requestForAccessResource: false,
  });
}

// Deny User Resource Access Request
async function denyResourceAccessListener(msg, socket, callback) {
  // send message to request resource user as request is denied
  socket.broadcast.emit('denied-resource-access', {
    userId: msg.userId,
    machineGroup: msg.currentMachineGroupId,
    resouceAvailabilty: true,
    waitingTime: '0m',
    deniedAccess: true,
  });
  // callback to user to stay login.
  callback({
    socketId: socket.id,
    userId: msg.requestGrantedUserDetails.userId,
    resouceAvailabilty: false,
    waitingTime: '5m',
    requestForAccessResource: false,
  });
}

// Rovoke User Exsting Session
async function revokeExistingSessionListener(msg, socket, callback) {
  if (msg && msg.isLogin) {
    delete activeSessions[msg.userId];
    return;
  }

  revokeExistingSession(msg.exstingSessionDetails.socketId);

  socket.broadcast.emit('session-expire', {
    userId: msg.userId,
    sessionExpire: true,
    socketId: msg.exstingSessionDetails.socketId,
    sessionId: msg.exstingSessionDetails.sessionId,
  });

  const sessionId = generateSessionIdAndAssignToUser(msg, socket);
  callback({
    socketId: socket.id,
    userId: msg.userId,
    machineGroup: msg.currentMachineGroupId,
    resouceAvailabilty: true,
    sessionActive: false,
    sessionId,
  });
}

// Create New User Session .
async function startSessionListener(msg, socket, callback) {
  const sessionId = generateSessionIdAndAssignToUser(msg, socket);
  callback({
    socketId: socket.id,
    userId: msg.userId,
    resouceAvailabilty: true,
    sessionActive: false,
    sessionId,
  });
}

async function accessRequestCanelListener(msg, socket, callback) {
  // broadcast message to other user to close the access grant popup
  socket.broadcast.emit('canceled-access-request', {
    userId: msg.existinglogedInUserId,
    machineGroup: msg.existinglogedInUserMachineGroupName,
    resouceAvailabilty: true,
    waitingTime: '0m',
    requestForAccessResource: false,
  });

  callback({
    socketId: socket.id,
    userId: msg.userId,
    resouceAvailabilty: true,
  });
}

function initializeSocketServer(server) {
  const io = socketIo(server, {
    cors: { methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: SocketId ${socket.id}`);

    socket.on('disconnect', () => {
      logger.warn(`Client disconnected: SocketId ${socket.id}`);
      revokeExistingSession(socket.id);
    });

    socket.on('check-resource-availabilty', (msg, callback) =>
      checkResourceAvailabilityListener(msg, socket, callback)
    );
    socket.on('grant-resource-access', (msg, callback) =>
      grantResourceAccessListener(msg, socket, callback)
    );
    socket.on('deny-resource-access', (msg, callback) =>
      denyResourceAccessListener(msg, socket, callback)
    );
    socket.on('revoke-exsting-session', (msg, callback) =>
      revokeExistingSessionListener(msg, socket, callback)
    );
    socket.on('start-session', (msg, callback) =>
      startSessionListener(msg, socket, callback)
    );

    // useAutoLogout events
    socket.on(
      'useAutoLogout: job-import-check-request',
      async (data, callback) => {
        const jobCount = await jobImportCheck(data);

        callback({ jobCount });
      }
    );

    socket.on('access-request-cancel', (msg, callback) =>
      accessRequestCanelListener(msg, socket, callback)
    );
  });

  return io;
}

module.exports = initializeSocketServer;

const formatDateForPipeline = (date) => {
  return new Date(date).toISOString();
};

const commonPipelineStages = (dateFrom, dateTo, machineId) => [
  {
    $addFields: {
      completedTime: {
        $cond: {
          if: { $eq: [{ $type: '$completedTime' }, 'completedTime'] },
          then: '$completedTime',
          else: { $toDate: '$completedTime' },
        },
      },
    },
  },
  {
    $match: {
      productionStatus: 'Completed',
      completedTime: {
        $gte: new Date(dateFrom),
        $lte: new Date(dateTo),
      },
      machineId,
    },
  },
];

module.exports = {
  formatDateForPipeline,
  commonPipelineStages,
};

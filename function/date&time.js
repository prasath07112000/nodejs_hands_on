const moment = require('moment');

function calculateIntervals(startDate, endDate, startTime, endTime, duration, breakDuration) {
  try {
    // Convert date and time strings to Moment objects
    const startDateTime = moment(`${startDate} ${startTime}`, 'YYYY-MM-DD h:mm A');
    const endDateTime = moment(`${endDate} ${endTime}`, 'YYYY-MM-DD h:mm A');

    // Validate input
    if (!startDate || !endDate || !startTime || !endTime || !duration || !breakDuration) {
      throw new Error('Missing required fields');
    }

    // Calculate duration in milliseconds
    const durationInMilliseconds = duration * 60 * 1000;
    const breakDurationInMilliseconds = breakDuration * 60 * 1000;

    // Split time range into intervals with breaks
    const intervals = [];
    let currentDateTime = startDateTime.clone();

    while (currentDateTime.isBefore(endDateTime)) {
      const nextDateTime = currentDateTime.clone().add(duration, 'minutes');
      intervals.push({
        startDate: currentDateTime.format('YYYY-MM-DD'),
        startTime: currentDateTime.format('h:mm A'),
        endDate: nextDateTime.format('YYYY-MM-DD'),
        endTime: nextDateTime.format('h:mm A'),
      });

      // Add break if not the last interval
      if (nextDateTime.isBefore(endDateTime)) {
        const breakStart = nextDateTime.clone();
        const breakEnd = breakStart.clone().add(breakDuration, 'minutes');
        intervals.push({
          startDate: breakStart.format('YYYY-MM-DD'),
          startTime: breakStart.format('h:mm A'),
          endDate: breakEnd.format('YYYY-MM-DD'),
          endTime: breakEnd.format('h:mm A'),
          break: true,
        });
        currentDateTime = breakEnd;
      } else {
        currentDateTime = nextDateTime;
      }
    }

    return { intervals };
  } catch (error) {
    return { error: error.message };
  }
}

module.exports = calculateIntervals;

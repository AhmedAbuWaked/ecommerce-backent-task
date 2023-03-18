exports.addMinutes = (date, minutes) =>
  new Date(date.getTime() + minutes * 60000).getTime();

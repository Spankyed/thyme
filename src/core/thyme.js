// @flow

import leftPad from 'left-pad';

import differenceInSeconds from 'date-fns/difference_in_seconds';
import isAfter from 'date-fns/is_after';
import isBefore from 'date-fns/is_before';
import isEqual from 'date-fns/is_equal';
import startOfDay from 'date-fns/start_of_day';
import endOfDay from 'date-fns/end_of_day';
import startOfMinute from 'date-fns/start_of_minute';
import startOfHour from 'date-fns/start_of_hour';
import format from 'date-fns/format';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import addMinutes from 'date-fns/add_minutes';

export const sortByTime = (dateSort: sortDirection) => (a: timeType, b: timeType) => {
  if (
    (isBefore(a.start, b.start) && dateSort === 'asc')
    || (isBefore(b.start, a.start) && dateSort === 'desc')
  ) {
    return -1;
  }

  if (
    (isAfter(a.start, b.start) && dateSort === 'asc')
    || (isAfter(b.start, a.start) && dateSort === 'desc')
  ) {
    return 1;
  }

  return 0;
};

export function calculateDuration(from: Date, to: Date, precise: boolean = false): number {
  if (isBefore(to, from)) {
    return 0;
  }

  return differenceInSeconds(
    precise ? to : startOfMinute(to),
    precise ? from : startOfMinute(from),
  );
}

export function formatDuration(duration: number, withSeconds: boolean = false): string {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration / 60) % 60);
  const seconds = Math.floor(duration % 60);

  const secondsString = withSeconds ? `:${leftPad(seconds, 2, 0)}` : '';

  return `${leftPad(hours, 2, 0)}:${leftPad(minutes, 2, 0)}${secondsString}`;
}

function getRoundedMinutes(round: rounding, diffMinutes: number, roundAmount: number) {
  if (round === 'none') {
    return diffMinutes;
  }

  return Math[round](diffMinutes / roundAmount) * roundAmount;
}

export function timeElapsed(
  from: Date,
  to: Date,
  precise: boolean = false,
  withSeconds: boolean = false,
  round?: rounding = 'none',
  roundAmount?: number = 0,
) {
  if (from === '' || to === '') {
    return 'Invalid time';
  }

  return formatDuration(
    getRoundedMinutes(
      round,
      calculateDuration(from, to, precise) / 60,
      roundAmount,
    ) * 60,
    withSeconds,
  );
}

export function projectTimeEntries(
  project: projectType | { id: null, nameTree: Array<string> },
  time: Array<timeType>,
  from: Date | string,
  to: Date | string,
): Array<timeType> {
  const startOfDayFrom = startOfDay(from);
  const endOfDayTo = endOfDay(to);

  return time
    .filter(entry => entry.project === project.id)
    .filter(entry => isAfter(entry.start, startOfDayFrom) || isEqual(entry.start, startOfDayFrom))
    .filter(entry => isBefore(entry.end, endOfDayTo) || isEqual(entry.end, endOfDayTo));
}

export function totalProjectTime(
  project: projectType | { id: null, nameTree: Array<string> },
  time: Array<timeType>,
  from: Date | string,
  to: Date | string,
  roundPerEntry?: boolean = false,
  round?: rounding = 'none',
  roundAmount?: number = 0,
): number {
  const projectTotal = projectTimeEntries(project, time, from, to)
    .reduce((total, entry) => total + getRoundedMinutes(
      roundPerEntry ? round : 'none',
      calculateDuration(entry.start, entry.end) / 60,
      roundAmount,
    ), 0);

  return getRoundedMinutes(
    round,
    projectTotal,
    roundAmount,
  );
}

export const formatTime = (date: Date) => format(date, 'HH:mm');

export function roundTime(
  roundAmount: number,
  round: rounding,
  date: Date,
  startDate: Date = startOfHour(date),
): Date {
  if (round === 'none') {
    return date;
  }

  const diffMinutes = differenceInMinutes(date, startDate);

  return addMinutes(startDate, getRoundedMinutes(round, diffMinutes, roundAmount));
}

const assert = require('assert');
const RRule = require('rrule').RRule;
const moment = require('moment');

const ACTIVITY = {
  activityDate: '2019-10-21',
  recurrence: {
    recurrenceRule: {
      frequency: 'WEEKLY',
      count: 4,
      interval: 1,
      weekDayList: [
        {
          value: 'MO',
          offset: 0,
        },
        {
          value: 'TU',
          offset: 0,
        },
      ],
      monthDayList: [],
      yearDayList: [],
      weekNoList: [],
      monthList: [],
      setPosList: [],
      weekStartDay: 'MO',
    },
    excludes: [],
  },
};

function toRRuleOptions(rule) {
  let props = {};

  if (rule.frequency) {
    props.freq = RRule[rule.frequency]; //Do our frequencies match RRule frequencies?
  }

  if (rule.count) {
    props.count = rule.count;
  }

  if (rule.interval) {
    props.interval = rule.interval;
  }

  if (rule.weekDayList && rule.weekDayList.length) {
    props.byweekday = rule.weekDayList.map(obj => RRule[obj.value]); //Do our weekdays match RRule weekdays? What is offset?
  }

  return props;
}

describe('Evaluate recurrence rules', function() {
  it('returns occurence dates', function() {
    let opts = toRRuleOptions(ACTIVITY.recurrence.recurrenceRule);
    opts = {...opts, dtstart: moment.utc('2019-10-21').toDate()};

    let rule = new RRule(opts);

    assert.deepEqual(rule.all().map(d => moment.utc(d).format('YYYY-MM-DD')), [
      '2019-10-21',
      '2019-10-22',
      '2019-10-28',
      '2019-10-29',
    ]);

    assert.deepEqual(
      rule
        .between(
          moment.utc('2019-10-22').toDate(),
          moment.utc('2019-10-28').toDate(),
          true,
        )
        .map(d => moment.utc(d).format('YYYY-MM-DD')),
      ['2019-10-22', '2019-10-28'],
    );

    let after = rule.after(moment.utc('2019-10-24').toDate());
    assert.deepEqual(moment.utc(after).format('YYYY-MM-DD'), '2019-10-28');

    let before = rule.before(moment.utc('2019-10-24').toDate());
    assert.deepEqual(moment.utc(before).format('YYYY-MM-DD'), '2019-10-22');
  });
});

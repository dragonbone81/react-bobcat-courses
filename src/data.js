const timesMap = {
    '700': {time: '7am', index: 0},
    '800': {time: '8am', index: 1},
    '900': {time: '9am', index: 2},
    '1000': {time: '10am', index: 3},
    '1100': {time: '11am', index: 4},
    '1200': {time: '12pm', index: 5},
    '1300': {time: '1pm', index: 6},
    '1400': {time: '2pm', index: 7},
    '1500': {time: '3pm', index: 8},
    '1600': {time: '4pm', index: 9},
    '1700': {time: '5pm', index: 10},
    '1800': {time: '6pm', index: 11},
    '1900': {time: '7pm', index: 12},
    '2000': {time: '8pm', index: 13},
    '2100': {time: '9pm', index: 14},
    '2200': {time: '10pm', index: 15},
    '2300': {time: '11pm', index: 16},
    '2400': {time: '12am', index: 17},
};
const timesMapFull = {
    '700': {time: '7:00am', index: 0},
    '730': {time: '7:30am', index: 0},
    '800': {time: '8:00am', index: 1},
    '830': {time: '8:30am', index: 1},
    '900': {time: '9:00am', index: 2},
    '930': {time: '9:30am', index: 2},
    '1000': {time: '10:00am', index: 3},
    '1030': {time: '10:30am', index: 3},
    '1100': {time: '11:00am', index: 4},
    '1130': {time: '11:30am', index: 4},
    '1200': {time: '12:00pm', index: 5},
    '1230': {time: '12:30pm', index: 5},
    '1300': {time: '1:00pm', index: 6},
    '1330': {time: '1:30pm', index: 6},
    '1400': {time: '2:00pm', index: 7},
    '1430': {time: '2:30pm', index: 7},
    '1500': {time: '3:00pm', index: 8},
    '1530': {time: '3:30pm', index: 8},
    '1600': {time: '4:00pm', index: 9},
    '1630': {time: '4:30pm', index: 9},
    '1700': {time: '5:00pm', index: 10},
    '1730': {time: '5:30pm', index: 10},
    '1800': {time: '6:00pm', index: 11},
    '1830': {time: '6:30pm', index: 11},
    '1900': {time: '7:00pm', index: 12},
    '1930': {time: '7:30pm', index: 12},
    '2000': {time: '8:00pm', index: 13},
    '2030': {time: '8:30pm', index: 13},
    '2100': {time: '9:00pm', index: 14},
    '2130': {time: '9:30pm', index: 14},
    '2200': {time: '10:00pm', index: 15},
    '2230': {time: '10:30pm', index: 15},
    '2300': {time: '11:00pm', index: 16},
    '2330': {time: '11:30pm', index: 16},
    '2400': {time: '12:00am', index: 17},
};
const dayMapGoogleCodes = {
    'M': 'MO',
    'T': 'TU',
    'W': 'WE',
    'R': 'TH',
    'F': 'FR',
};
const dayMapMicrosoftCodes = {
    'M': 1,
    'T': 2,
    'W': 3,
    'R': 4,
    'F': 5,
};
const termsMap = {
    '201910': '2019',
    '201920': '2019',
    '201930': '2019',
    '201830': '2018',
    '201810': '2018',
};
const monthsMap = {
    JAN: '01',
    FEB: '02',
    MAR: '03',
    APR: '04',
    MAY: '05',
    JUN: '06',
    JUL: '07',
    AUG: '08',
    SEP: '09',
    OCT: '10',
    NOV: '11',
    DEC: '12',
};
const timesArr = ['7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm',
    '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm', '12am'];

const daysArr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const daysMap = {'Mon': 'M', 'Tue': 'T', 'Wed': 'W', 'Thu': 'R', 'Fri': 'F'};
const colors = ['rgba(254,144,1, 0.5)', 'rgba(255,117,117, 0.5)', 'rgba(255,229,117, 0.5)', 'rgba(189,255,145, 0.5)', 'rgba(179,255,242, 0.5)', 'rgba(145,181,255, 0.5)', 'rgba(235,170,255, 0.5)', 'rgba(249,147,185, 0.5)', 'rgba(237,213,205, 0.5)'];
export {
    timesMap,
    timesArr,
    daysMap,
    daysArr,
    colors,
    timesMapFull,
    dayMapGoogleCodes,
    monthsMap,
    termsMap,
    dayMapMicrosoftCodes
};
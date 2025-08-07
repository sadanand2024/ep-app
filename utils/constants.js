const monthsObj = {
    January: 'January',
    February: 'February',
    March: 'March',
    April: 'April',
    May: 'May',
    June: 'June',
    July: 'July',
    August: 'August',
    September: 'September',
    October: 'October',
    November: 'November',
    December: 'December',
}

const monthValues = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,   
    December: 12,
}

const financialYears = [
    '2025-2026',
    '2024-2025',
    '2023-2024',
    '2022-2023',
    '2021-2022',
    '2020-2021',
    '2019-2020',
    '2018-2019',
    '2017-2018',
    '2016-2017',
    '2015-2016',
    '2014-2015',
    '2013-2014',
    '2012-2013',
]

const getDefaultMonth = () => {
    const today = new Date();
    let monthIndex = today.getMonth(); // 0-based
    if (today.getDate() < 26) {
        monthIndex = monthIndex - 1;
        if (monthIndex < 0) monthIndex = 11;
    }
    // months is defined below as Object.values(monthsObj)
    return Object.values(monthsObj)[monthIndex];
};

export { monthsObj, financialYears, monthValues, getDefaultMonth }
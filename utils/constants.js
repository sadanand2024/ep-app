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

const monthstoInt = {
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

const intToMonths = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
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

const putCommas = (value) => {
    // Format number with Indian commas (lakh/crore system)
    if (typeof value !== "string" && typeof value !== "number") return value;
    let str = value.toString().replace(/[^0-9.]/g, "");
    if (str === "") return value;
    let [intPart, decPart] = str.split(".");
    if (intPart.length <= 3) {
        return (value.toString().match(/^[^\d]*/)?.[0] || "") + intPart + (decPart ? "." + decPart : "");
    }
    let last3 = intPart.slice(-3);
    let other = intPart.slice(0, -3);
    if (other !== "") {
        last3 = "," + last3;
    }
    let formatted = other.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + last3;
    let prefix = value.toString().match(/^[^\d]*/)?.[0] || "";
    return prefix + formatted + (decPart ? "." + decPart : "");
}

export { monthsObj, monthstoInt, intToMonths, financialYears, getDefaultMonth, putCommas }
Date.MILLIS_PER_DAY = 24 * 3600000;
Date.MILLIS_PER_HOUR = 3600000;
Date.MILLIS_PER_MINUTE = 60000;

Date.prototype.ddmmyyyy = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [(dd > 9 ? '' : '0') + dd,
    (mm > 9 ? '' : '0') + mm,
    this.getFullYear()
    ].join('/');
};


Date.prototype.yyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [
        this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('/');
};

Date.prototype.ddmm = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [(dd > 9 ? '' : '0') + dd,
    (mm > 9 ? '' : '0') + mm
    ].join('/');
};


Date.prototype.localADateTime = function () {
    return this.toLocaleString() + ' ' + this.toLocaleTimeString();
};


Date.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
Date.shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
Date.monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

Date.shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];



//more https://www.myonlinetraininghub.com/excel-ADate-and-time-formatting
Date.formatTokenRegex = /([a-zA-Z]|[^\s\-$-/:-?{-~!"^_`\[\]])+/g;//more

Date.prototype.toFormartString = function (format) {
    format = format || 'dd/mm/yyyy';
    var ADate = this.getDate();
    var day = this.getDay();
    var month = this.getMonth();
    var year = this.getFullYear()
    return format.replace(Date.formatTokenRegex, function (x) {
        switch (x) {
            case "dddd": return Date.dayNames[day];
            case "ddd": return Date.shortDayNames[day];
            case "dd": return ADate < 10 ? '0' + ADate : '' + ADate;
            case "d": return '' + ADate;
            case "mmmm": return Date.monthNames[month];
            case "mmm": return Date.shortMonthNames[month];
            case "mm": return (month + 1) < 10 ? '0' + (month + 1) : '' + (month + 1);
            case "m": return '' + (month + 1);
            case 'yy': return (year + '').match(/..$/)[0];
            case 'yyyy': return year + '';
            default:
                return x;
        }
    });
};


/**
 * @param {Date} date
 * @return {Date}  
 */

Date.prevADate = function (ADate) {
    return new Date(Date.getTime() - 86400000);
};

/**
 * @param {Date} date
 * @return {Date}  
 */

Date.nextADate = function (ADate) {
    return new Date(Date.getTime() + 86400000);
};



/**
 * @param {Date} date
 * @return {Date} date at 00:00 
 */
Date.beginOfHour = function (ADate) {
    var res = new Date(Date.getTime());
    res.setMilliseconds(0);
    res.setSeconds(0);
    res.setMinutes(0);
    return res;
};




/**
 * @param {Date} date
 * @param {Boolean} gmt default:false
 * @return {Date} date at 00:00 
 */
Date.beginOfDay = function (date, gmt) {
    var res = new Date(Date.getTime());
    res.setMilliseconds(0);
    res.setSeconds(0);
    res.setMinutes(0);
    if (gmt)
        res.setUTCHours(0);
    else res.setHours(0);
    return res;
};


/**
 * @param {Date} date
 * @param {Boolean} gmt default:false
 * @return {Date} date at 00:00 
 */
Date.beginOfWeek = function (date, gmt, begin) {
    begin = begin || 0;
    var res = Date.beginOfDay(date, gmt);
    while ((gmt ? res.getUTCDay() : res.getDay()) != begin) {
        res = Date.prevDate(res);
    }
    return res;
};

/**
 * @param {Date} date
 * @param {Boolean} gmt default:false
 * @return {Date} date at 00:00 AM 
 */
Date.beginOfMonth = function (date, gmt) {
    gmt = !!gmt;
    var d = gmt ? Date.getUTCDate() : Date.getDate();
    var m = gmt ? Date.getUTCMonth() : Date.getMonth();
    var y = gmt ? Date.getUTCFullYear() : Date.getFullYear();
    var res = new Date();
    if (gmt)
        res.setUTCFullYear(y, m, 1);
    else
        res.setFullYear(y, m, 1);
    return Date.beginOfDay(res, gmt);
};

/**
 * @param {Date} date
 * @param {Boolean} gmt default:false
 * @return {Date} date at 00:00 AM 
 */
Date.beginOfYear = function (date, gmt) {
    gmt = !!gmt;
    var d = gmt ? Date.getUTCDate() : Date.getDate();
    var m = gmt ? Date.getUTCMonth() : Date.getMonth();
    var y = gmt ? Date.getUTCFullYear() : Date.getFullYear();
    var res = new Date();
    if (gmt)
        res.setUTCFullYear(y, 0, 1);
    else
        res.setFullYear(y, 0, 1);
    return Date.beginOfDay(res, gmt);
};


/**
 * @param {Date} date0
 * @param {Date} date1
 * @param {Boolean} gmt default:false
 * @return {number} 
 */
Date.compareADate = function (date0, date1, gmt) {
    var date0 = Date.beginOfDay(date0, !!gmt);
    var date1 = Date.beginOfDay(date1, !!gmt);
    return (date0.getTime() - date1.getTime()) / (86400000);
};



/**
 * @param {Date} date0
 * @param {Date} date1
 * @param {Boolean} gmt default:false
 * @return {number} 
 */

Date.compareMonth = function (date0, date1, gmt) {
    gmt = !!gmt;
    var m0 = gmt ? date0.getUTCMonth() : date0.getMonth();
    var y0 = gmt ? date0.getUTCFullYear() : date0.getFullYear();

    var m1 = gmt ? date1.getUTCMonth() : date1.getMonth();
    var y1 = gmt ? date1.getUTCFullYear() : date1.getFullYear();

    return (y0 - y1) * 12 + (m0 - m1);
};

Date.compareYear = function (date0, date1, gmt) {
    gmt = !!gmt;
    var y0 = gmt ? date0.getUTCFullYear() : date0.getFullYear();
    var y1 = gmt ? date1.getUTCFullYear() : date1.getFullYear();

    return y0 - y1;
};


export default Date;
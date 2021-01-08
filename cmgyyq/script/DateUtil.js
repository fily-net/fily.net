var now = new Date();                                                //当前日期
var nowDayOfWeek = (now.getDay() == 0) ? 7 : now.getDay() - 1;       //今天是本周的第几天。周一=0，周日=6
var nowDay = now.getDate();                                          //当前日
var nowMonth = now.getMonth();                                       //当前月值（1月=0，12月=11）
var nowMonReal = now.getMonth() + 1;                                 //当前月实际数字
var nowYear = now.getFullYear();                                     //当前年

//日期+天
function AddDays(d, n) {
    var t = new Date(d); //复制并操作新对象，避免改动原对象
    t.setDate(t.getDate() + n);
    return t;
}

//日期+月。日对日，若目标月份不存在该日期，则置为最后一日
function AddMonths(d, n) {
    var t = new Date(d);
    t.setMonth(t.getMonth() + n);
    if (t.getDate() != d.getDate()) { t.setDate(0); }
    return t;
}

//日期+年。月对月日对日，若目标年月不存在该日期，则置为最后一日
function AddYears(d, n) {
    var t = new Date(d);
    t.setFullYear(t.getFullYear() + n);
    if (t.getDate() != d.getDate()) { t.setDate(0); }
    return t;
}

//获得本季度的开始月份
me.getQuarterStartMonth = function () {
    if (nowMonth <= 2) { return 0; }
    else if (nowMonth <= 5) { return 3; }
    else if (nowMonth <= 8) { return 6; }
    else { return 9; }
}

//周一
me.getWeekStartDate = function () {
    return AddDays(now, -nowDayOfWeek);
}

//周日。本周一+6天
me.getWeekEndDate = function () {
    return AddDays(getWeekStartDate(), 6);
}

//月初
me.getMonthStartDate = function () {
    return new Date(nowYear, nowMonth, 1);
}

//月末。下月初-1天
me.getMonthEndDate = function () {
    return AddDays(AddMonths(getMonthStartDate(), 1), -1);
}

//季度初
me.getQuarterStartDate = function () {
    return new Date(nowYear, getQuarterStartMonth(), 1);
}

//季度末。下季初-1天
me.getQuarterEndDate = function () {
    return AddDays(AddMonths(getQuarterStartDate(), 3), -1);
}
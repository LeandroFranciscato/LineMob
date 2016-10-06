dateUtil = {
    format: function (date) {
        var fields = date.split("-");
        return fields[2] + "/" + fields[1] + "/" + fields[0].substr(2, 2);
    },
    increment: function (date, increment) {
        var fields = date.split("-");
        var newDate = new Date(fields[0], fields[1] - 1, fields[2]);
        newDate.setDate(newDate.getDate() + Number(increment));
        return newDate.getFullYear() + "-" +
                dateUtil.pad(newDate.getMonth() + 1, "00") + "-" +
                dateUtil.pad(newDate.getDate(), "00");
    },
    pad: function (str, pad) {
        str = str.toString();
        var ans = pad.substring(0, pad.length - str.length) + str;
        return ans;
    }
};
var importUtil = {
    get: function (keyword, url, callback) {
        if (typeof (window[keyword]) == "undefined") {
            $.getScript(url, function () {
                callback();
            });
        } else {
            callback();
        }
    }
};
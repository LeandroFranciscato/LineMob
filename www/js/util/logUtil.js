var logUtil = {
    log: function (msg, data) {
        if (data) {
            console.log(msg+" - "+data);
            return;
        }
        console.log(msg);
    }
};
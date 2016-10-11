var networkUtil = {
    isOnline: function () {
        var networkState = navigator.connection.type;
        if (networkState == "none") {
            return false;
        }
        return true;
    }
};
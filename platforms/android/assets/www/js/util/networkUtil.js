var networkUtil = {
    isOnline: function () {
        var networkState = navigator.connection.type;
        if (networkState == "none") {
            return false;
        }
        return true;
    },
    connectionType: function () {
        return navigator.connection.type;
    }
};
var loadController = {
    show: function (cbReady, cbComplete, isModal) {
        $('#loader').openModal({
            opacity: 0,
            in_duration: 0,
            out_duration: 0,
            ready: function () {
                if (cbReady) {
                    cbReady();
                }
            },
            complete: function () {
                if (cbComplete) {
                    cbComplete();
                }
            },
            dismissible: (isModal) ? isModal : true
        });
    },
    hide: function (cbComplete) {
        $("#loader").closeModal({
            out_duration: 0,
            complete: function () {
                if (cbComplete) {
                    cbComplete();
                }
            }
        });
    }
};
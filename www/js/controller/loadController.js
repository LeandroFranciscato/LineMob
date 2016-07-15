var loadController = {
    show: function (cbReady, cbComplete, isModal) {
        $('#loader').openModal({
            opacity: 0,
            in_duration: 500,
            out_duration: 500,
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
            dismissible: (isModal) ? isModal : true,
            starting_top: '-20%'
        });
    },
    hide: function (cbComplete) {
        $("#loader").closeModal({
            out_duration: 500,
            complete: function () {
                if (cbComplete) {
                    cbComplete();
                }
            }
        });
    }
};
/* global dbUtil */

var app = {
    initialize: function() {
        this.bindEvents();
    },   
     
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {        
        alert("OnDeviceReady!");
        dbUtil.createSchema(function(res){
            alert("PostCreateSchema");
            alert(res);
        });
    }
       
};

app.initialize();
/**
 * MovingIndex Javascript App
 */
var app = {

    'apikey': null,
    'api_base_url': 'http://mi.jeroen.in/api/',

    // Application Constructor
    initialize: function()
    {
        this.bindEvents();
    },

    detectApiKey: function()
    {
        var miApiKey = localStorage.getItem('mi_apikey');
        if(miApiKey == undefined)
        {
            document.getElementById("apikeyreq").style.display = 'block';
            document.getElementById("settingsModal").className = 'active';
            return;
        }
        app.loadApiKey();
    },

    loadApiKey: function()
    {
        app.apikey = localStorage.getItem('mi_apikey');
        $("#settings_apikey").val(app.apikey);
        app.ajaxSetupApiKeyHeader();
    },

    saveApiKey: function(mi_apikey)
    {
        localStorage.setItem('mi_apikey', mi_apikey);
        app.loadApiKey();
    },

    saveSettings: function()
    {
        var mi_apikey = $("#settings_apikey").val();
        if(mi_apikey)
        {
            app.saveApiKey(mi_apikey);
            $("#settingsModal").removeClass('active');
        }
        else
        {
            $("apikeyreq").html("Please give in a valid key").css('color', 'red');
        }
    },

    ajaxSetupApiKeyHeader: function()
    {
        $.ajaxSetup({
            headers: { 'Authorization': 'Token ' + app.apikey }
        });
    },

    ajaxRefreshEvents: function()
    {
        $.ajax({
            url: self.api_base_url + 'event/',
            success: function(response)
            {
                $("li.mi_event").remove();
                $.each(response, function()
                {
                    $('#list_of_events').prepend('<li class="table-view-cell mi_event" id="' + this.pk + '">' +
                    '<a class="navigate-right"><span class="media-object pull-left icon icon-pages"></span><span class="badge">' + this.pk + '</span>' +
                    this.name + '</a></li>');
                });
                $('.mi_event').on('click', function(e){

                });
            },
            error: function(xhr, type)
            {
                $("li.mi_event").remove();
                $('#list_of_events').prepend('<li class="table-view-cell">' +
                '<a class="navigate-right"><span class="badge">' + type + '</span>' +
                'Could not retrieve list of Events</a></li>');
            }
        });
    },

    ajaxGetEventContainer: function(event_id, container_id)
    {
        $.ajax({
            url: self.api_base_url + 'event/' + event_id + '/container/' + container_id + '/content/',
            success: function(response)
            {
                $("li.mi_event").remove();
                $.each(response, function()
                {
                    $('#list_of_events').prepend('<li class="table-view-cell mi_event" id="' + this.pk + '">' +
                    '<a class="navigate-right"><span class="media-object pull-left icon icon-pages"></span><span class="badge">' + this.pk + '</span>' +
                    this.name + '</a></li>');
                });
                $('.mi_event').on('click', function(e){

                });
            },
            error: function(xhr, type)
            {
                $("li.mi_event").remove();
                $('#list_of_events').prepend('<li class="table-view-cell">' +
                '<a class="navigate-right"><span class="badge">' + type + '</span>' +
                'Could not retrieve list of Events</a></li>');
            }
        });
    },

    scanCode: function(callback)
    {
        cordova.plugins.barcodeScanner.scan(
            callback,
            function(error) {
                alert("Scan failed: " + error);
            });
    },

    bier: function(henk)
    {
        console.log(henk);
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        app.detectApiKey();
        app.ajaxRefreshEvents();

        // Bind andere meuk
        $('#scan_option').on('click', function(e)
        {
            app.scanCode(app.bier);
        });
        $('#savesettings').on('click', app.saveSettings);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

scanner = cordova.require("cordova/plugin/BarcodeScanner");

function scanQRCode()
{
    cordova.plugins.barcodeScanner.scan(
        function (result)
        {
            alert("We got a barcode\n" +
            "Result: " + result.text + "\n" +
            "Format: " + result.format + "\n" +
            "Cancelled: " + result.cancelled);
        },
        function (error)
        {
            alert("Scanning failed: " + error);
        }
    );
}
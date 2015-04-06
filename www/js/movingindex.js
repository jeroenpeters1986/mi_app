/**
 * MovingIndex Javascript App
 */
var app = {

    'apikey': null,
    'api_base_url': 'http://mi.jeroen.in/api/',

    // Application Constructor
    initialize: function()
    {
        console.log("Initializing app");
        this.bindEvents();
    },

    detectApiKey: function()
    {
        console.log("Detecting API Key");
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
        console.log("Got apikey from loadApiKey: " + app.apikey);
        $("#settings_apikey").val(app.apikey);
        app.ajaxSetupApiKeyHeader();
    },

    saveApiKey: function(mi_apikey)
    {
        console.log("Saving API key: " + mi_apikey);
        localStorage.setItem('mi_apikey', mi_apikey);
        app.loadApiKey();
    },

    saveSettings: function()
    {
        var mi_apikey = $("#settings_apikey").val();
        console.log("Received key: " + mi_apikey);
        if(mi_apikey)
        {
            app.saveApiKey(mi_apikey);
            $("#settingsModal").removeClass('active');
            console.log("Remove setting modal");

            console.log("Calling refresh for event list");
            app.ajaxRefreshEvents();
        }
        else
        {
            $("apikeyreq").html("Please give in a valid key").css('color', 'red');
        }
    },

    getContainersForEvent: function(event_id)
    {
        $.ajax({
            url: app.api_base_url + 'event/' + event_id + '/container/',
            success: function(response)
            {
                $("#eventContainerModal").addClass("active");
                $.each(response, function()
                {
                    $('#containerlist').children().remove();
                    $('#containerlist').append('<li class="table-view-cell media" id="container_' + this.pk + '">' +
                        '<a class="navigate-right"><img class="media-object pull-left" src="http://placehold.it/42x42">' +
                        '<div class="media-body">' + this.title + '<br />' + this.event +
                        '<p>Lorem ipsum dolor sit amet</p></div></a></li>');
                    console.log("Retreived and added containers for event: " + this.event);
                });
            },
            error: function(xhr, type)
            {
                $("#eventContainerModal").addClass("active");
                $('#containerlist').children().remove();
                $('#containerlist').prepend('<li class="table-view-cell">' +
                '<a class="navigate-right"><span class="badge">' + type + '</span>' +
                'Could not retrieve list of Containers</a></li>');
            }
        });
    },

    createContainer: function()
    {
        var mi_apikey = $("#settings_apikey").val();
        console.log("Received key: " + mi_apikey);
        if(mi_apikey)
        {
            app.saveApiKey(mi_apikey);
            $("#settingsModal").removeClass('active');
            console.log("Remove setting modal");

            console.log("Calling refresh for event list");
            app.ajaxRefreshEvents();
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
        console.log("Just setup AJAX headers with token: " + app.apikey);
    },

    ajaxRefreshEvents: function()
    {
        $.ajax({
            url: app.api_base_url + 'event/',
            success: function(response)
            {
                $("li.mi_event").remove();
                $.each(response, function()
                {
                    $('#list_of_events').prepend('<li class="table-view-cell mi_event" data-event-id="' + this.pk + '">' +
                    '<a class="navigate-right"><span class="media-object pull-left icon icon-pages"></span><span class="badge">' + this.pk + '</span>' +
                    this.name + '</a></li>');
                    console.log("Retreived and added event: " + this.name);
                });
                $('.mi_event').on('click', function(e){
                    event_id = $(this).attr('data-event-id');
                    app.getContainersForEvent(event_id);
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
            url: app.api_base_url + 'event/' + event_id + '/container/' + container_id + '/content/',
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
        console.log("Called Scancode code");
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
    bindEvents: function()
    {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function()
    {
        console.log("DeviceReady");
        app.receivedEvent('deviceready');
        app.detectApiKey();
        app.ajaxRefreshEvents();

        scanner = cordova.require("cordova/plugin/BarcodeScanner");

        // Bind andere meuk
        $('#scan_option').on('click', function(e)
        {
            app.scanCode(app.bier);
        });
        $('#savesettings').on('click', app.saveSettings);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id)
    {
        console.log('Received Event: ' + id);
    }
};

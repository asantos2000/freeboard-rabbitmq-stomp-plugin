// # A Freeboard Plugin that uses the RabbitMQ Stomp client to read MQTT messages
// # Based on paho.mqtt.plugin - source: https://github.com/alsm/freeboard-mqtt

(function()
{
	// ### Datasource Definition
	//
	// -------------------
		
	freeboard.loadDatasourcePlugin({
		"type_name"   : "stomp_mqtt",
		"display_name": "Rabbit MQTT Stomp Plugin",
        "description" : "Receive data from an MQTT server.",
		"external_scripts" : [
			"plugins/thirdparty/sockjs-0.3.js",
			"plugins/thirdparty/stomp.js"
		],
		"settings"    : [
			{
				"name"         : "url",
				"display_name" : "Stomp URL",
				"type"         : "text",
            	"default_value": "http://127.0.0.1:15674/stomp",				
				"description"  : "RabbitMQ Stomp URL.",
                "required" : true
			},
            {
            	"name"       : "vhost",
            	"display_name": "vhost",
            	"type"        : "text",
            	"default_value": "/",
            	"required"    : true
            },
            {
            	"name"        : "username",
            	"display_name": "Username",
            	"type"        : "text",
            	"default_value": "guest",
            	"required"    : true
            },
            {
            	"name"        : "password",
            	"display_name": "Password",
            	"type"        : "text",
            	"default_value": "guest",
            	"required"    : true
            },
            {
            	"name"        : "queue",
            	"display_name": "Queue",
            	"type"        : "text",
            	"default_value" : "/topic/sensor.jons-house.#",
            	"description" : "The topic to subscribe to. To translate mqtt topics to stomp we change slashes to dots",
            	"required"    : true
            },
            {
            	"name"        : "json_data",
            	"display_name": "JSON messages?",
            	"type"        : "boolean",
            	"description" : "If the messages on your topic are in JSON format they will be parsed so the individual fields can be used in freeboard widgets",
            	"default_value": false
            }
		],
		// **newInstance(settings, newInstanceCallback, updateCallback)** (required) : A function that will be called when a new instance of this plugin is requested.
		// * **settings** : A javascript object with the initial settings set by the user. The names of the properties in the object will correspond to the setting names defined above.
		// * **newInstanceCallback** : A callback function that you'll call when the new instance of the plugin is ready. This function expects a single argument, which is the new instance of your plugin object.
		// * **updateCallback** : A callback function that you'll call if and when your datasource has an update for freeboard to recalculate. This function expects a single parameter which is a javascript object with the new, updated data. You should hold on to this reference and call it when needed.
		newInstance   : function(settings, newInstanceCallback, updateCallback)
		{
			newInstanceCallback(new mqttDatasourcePlugin(settings, updateCallback));
		}
	});

	var mqttDatasourcePlugin = function(settings, updateCallback)
	{
 		var self = this;
		var data = {};

		var currentSettings = settings;

		// Use SockJS
		Stomp.WebSocketClass = SockJS;
		var ws = new SockJS(currentSettings.url);

		var client = Stomp.over(ws);
		client.heartbeat.outgoing = 0;
		client.heartbeat.incoming = 0;

		function onConnect() {
			console.log("Connected");
			client.subscribe(currentSettings.queue, onMessageArrived)
		};
		
		function onConnectionLost() {
			console.log("ConnectionLost");
		};

		function onMessageArrived(message) {
			console.log("MessageArrived");
			data.topic = message.headers.destination;
			if (currentSettings.json_data) {
				data.msg = JSON.parse(message.body);
			} else {
				data.msg = message.body;
			}
			updateCallback(data);
		};
		
		// **onSettingsChanged(newSettings)** (required) : A public function we must implement that will be called when a user makes a change to the settings.
		self.onSettingsChanged = function(newSettings)
		{
			console.log("SettingsChanged");
			client.disconnect();
			data = {};
			currentSettings = newSettings;

			client = Stomp.over(ws);
			Stomp.WebSocketClass = SockJS;
			ws = new SockJS(currentSettings.url);
			client = Stomp.over(ws);
			client.heartbeat.outgoing = 0;
			client.heartbeat.incoming = 0;			
			
			client.connect(
				currentSettings.username,
				currentSettings.password,
				onConnect,
				onConnectionLost,
				currentSettings.vhost
			);
		}

		// **updateNow()** (required) : A public function we must implement that will be called when the user wants to manually refresh the datasource
		self.updateNow = function()
		{
			// Don't need to do anything here, can't pull an update from MQTT.
		}

		// **onDispose()** (required) : A public function we must implement that will be called when this instance of this plugin is no longer needed. Do anything you need to cleanup after yourself here.
		self.onDispose = function()
		{
			console.log("Dispose");		
			if (client.connected) {
				client.disconnect();
			}
			client = {};
		}
										
		client.connect(
			currentSettings.username,
			currentSettings.password,
			onConnect,
			onConnectionLost,
			currentSettings.vhost
		);
	}
}());

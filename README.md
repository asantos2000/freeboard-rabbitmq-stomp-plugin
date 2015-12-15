# freeboard-rabbitmq-stomp-plugin

RabbitMQ Stomp plugins for freeboard.io

# Install

Install [Freeboard] (https://github.com/Freeboard/freeboard);

Install [RabbitMQ] (https://www.rabbitmq.com/download.html), enable plugins below and run it;

```
host:sbin$ ./rabbitmq-plugins list
 Configured: E = explicitly enabled; e = implicitly enabled
 | Status:   * = running on rabbit@host
 |/
[e*] amqp_client                       3.5.6
[e*] cowboy                            0.5.0-rmq3.5.6-git4b93c2d
[e*] mochiweb                          2.7.0-rmq3.5.6-git680dba8
[  ] rabbitmq_amqp1_0                  3.5.6
[  ] rabbitmq_auth_backend_ldap        3.5.6
[  ] rabbitmq_auth_mechanism_ssl       3.5.6
[  ] rabbitmq_consistent_hash_exchange 3.5.6
[  ] rabbitmq_federation               3.5.6
[  ] rabbitmq_federation_management    3.5.6
[E*] rabbitmq_management               3.5.6
[e*] rabbitmq_management_agent         3.5.6
[  ] rabbitmq_management_visualiser    3.5.6
[E*] rabbitmq_mqtt                     3.5.6
[  ] rabbitmq_shovel                   3.5.6
[  ] rabbitmq_shovel_management        3.5.6
[e*] rabbitmq_stomp                    3.5.6
[  ] rabbitmq_test                     3.5.6
[  ] rabbitmq_tracing                  3.5.6
[e*] rabbitmq_web_dispatch             3.5.6
[E*] rabbitmq_web_stomp                3.5.6
[  ] rabbitmq_web_stomp_examples       3.5.6
[e*] sockjs                            0.3.4-rmq3.5.6-git3132eb9
[e*] webmachine                        1.10.3-rmq3.5.6-gite9359c
```

Copy all **freeboard-rabbitmq-stomp-plugin** files from this repository to your **freeboard_install_path/plugins/thirdparty** directory;

Change **freeboard_install_path/index.html**, adding **plugins/thirdparty/rabbitmq.stomp.plugin.js**;

```javascript
    <script type="text/javascript">
        head.js("js/freeboard+plugins.min.js",
                // *** Load more plugins here ***
				"plugins/thirdparty/rabbitmq.stomp.plugin.js",              
                function(){
                    $(function()
                    { //DOM Ready
                        freeboard.initialize(true);

                        var hashpattern = window.location.hash.match(/(&|#)source=([^&]+)/);
                        if (hashpattern !== null) {
                            $.getJSON(hashpattern[2], function(data) {
                                freeboard.loadDashboard(data, function() {
                                    freeboard.setEditing(false);
                                });
                            });
                        }

                    });
                });
    </script>  
```
Run **index.html** on your browser (tested on Chrome and Safari) and configure the new **Rabbit MQTT Stomp Plugin** datasource and add a PANE.

![screen shot 2015-12-15 at 4 41 40 pm](https://cloud.githubusercontent.com/assets/1181358/11820357/2ce323b0-a34b-11e5-9914-55c939e81965.png)

That's it. You got it.

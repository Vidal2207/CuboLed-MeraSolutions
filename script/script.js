$(window).on("load",ventanaCargada);
function ventanaCargada(){
    $(".loading").fadeOut("slow");
}
$(document).ready(function(){
    //$('.div-info').hide();
    $('.main').hide();
    ///////////////////
    // CONEXION A MQTT
    const MQTT_SERVER = "broker.emqx.io";
    const MQTT_PORT = 8084;
    const MQTT_USERNAME = "emqx";
    const MQTT_PASSWORD = "public";
    const CLIENT_PREFIX = "client_id_";
    const TOPIC = "merasolutions2221";

    var clientId = CLIENT_PREFIX + Math.floor(Math.random() * 1000000 + 1);
    var client = new Paho.MQTT.Client(MQTT_SERVER, MQTT_PORT, clientId);

    var options = {
        useSSL: true,
        userName: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        onSuccess: onConnect,
        onFailure: onFailure
    }

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    ///INICIAR CONEXION
    $('#btn-link').on('click', function() {
       showConectando();
        setTimeout(() => {
            client.connect(options);
        }, 3000);
    });

    function onConnect() {
        client.subscribe(TOPIC);
        showConectado();
    }
    
    function onMessageArrived(message) {
        //console.log("Un mensaje ha llegado " + message.payloadString);
    }

    function onFailure(e) {
        lostConection("ERROR: \n" + e.errorMessage);
    }

    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            lostConection("onConnectionLost " + responseObject.errorMessage);
        }
    }

    // ////  CONTROLAR LAS OPCIONES ////////
    var clicHabilitado = true;
    $(".opcion").click(function() {
        if (clicHabilitado) {
            clicHabilitado = false;

            var msj = "0";
            if ($(this).hasClass("seleccionado")) {
                $(".opcion").removeClass("seleccionado");
                $("#0").addClass("seleccionado");
            } else {
                msj = $(this).attr("id");
                $(".opcion").removeClass("seleccionado");
                $(this).addClass("seleccionado");
            }
     
            if (client.isConnected()) {
                var message = new Paho.MQTT.Message(msj);
                message.destinationName = TOPIC;
                client.send(message);
                console.log(msj);
            } else {
                lostConection("El cliente no está conectado.");
            }

            $(".opcion").addClass("clic-bloqueado");
            setTimeout(function() {
                clicHabilitado = true;
                $(".opcion").removeClass("clic-bloqueado");
            }, 1000);
         }
    });
     


    function lostConection(mess)
    {
        alert(mess);
        showDesconectado();
    }

    function showConectando() {
        $('.div-info').hide();
        $('.content').addClass("load");
        $('.wifi').addClass("badWifi");
    }
    
    function showConectado() {
        $('.content').removeClass("load");
        $('.wifi').removeClass("badWifi").addClass("greenWifi");
        $('.main').show();
    }
    
    function showDesconectado() {
        alert("Connection lost");
        $('.wifi').addClass("redWifi");
        $('.main').hide();
    }
    

});

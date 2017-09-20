//===========================================================================
// PARÂMETROS
//---------------------------------------------------------------------------
// Banco de Dados SQL
var con_host = "br-cdbr-azure-south-b.cloudapp.net";         // endereço do host
var con_user = "b06799fb954ded";                             // usuario
var con_pwd = "d8a197e8";                                   // senha
var con_db = "dbrastreadores";                              // nome do banco de dados

var s_port = 20500;                 // Porta de comunicaçao UDP

//===========================================================================


//---------------------------------------------------------------------------
// Carrega módulo UDP e outros
//---------------------------------------------------------------------------
var dgram = require("dgram");
var server = dgram.createSocket("udp4");

var responder_txup = 0;


//---------------------------------------------------------------------------
// Conexão ao Server MySQL
//---------------------------------------------------------------------------
var mysql = require('mysql');
var con = mysql.createConnection({
    host: con_host,
    user: con_user,
    password: con_pwd,
    database: con_db
});


//---------------------------------------------------------------------------
// LISTENING - Servidor fica aguardando na porta especificada
//---------------------------------------------------------------------------
server.on("listening", function () {
    var address = server.address();
    console.log("Servidor escutando IP-Porta: " + address.address + ":" + address.port);
});


//---------------------------------------------------------------------------
// Tratamento de Mensagens Recebidas
//---------------------------------------------------------------------------
server.on("message", function (msg, rinfo) {

    console.log("Conectado com: " + rinfo.address + ":" + rinfo.port);
    console.log("Mensagem recebida: " + msg);

    var msgstr = msg.toString("ascii");

    //01 - Resposta aos comandos TX e UP
    var verificaTX = msgstr.indexOf(",TX#"); if (verificaTX != -1) { responder_txup = 1 }
    var verificaUP = msgstr.indexOf(",UP#"); if (verificaUP != -1) { responder_txup = 1 }
    if (responder_txup == 1) {
        var msg_array = msgstr.split(',');
        salva_mensagem(msg, rinfo.address, rinfo.port, msg_array[1]);
        responde_TXUP(msg, rinfo.address, rinfo.port);
    }

    //02 - Tratamento de Mensagem padrão de Localização
    if (msgstr.indexOf(",HB,") != -1) { salva_mensagem_localizacao(msgstr, rinfo.address, rinfo.port); }

});

// Erro Tratamento
server.on("error", function (err) {
    console.log("server error: \n" + err.stack);
    server.close();
});

// Encerramento de conexão
server.on("close", function () {
    console.log("closed.");
});

function salva_mensagem(param1, param2, param3, param4) {

    //salva mensagem em banco de dados
    sql = "insert into tbl_mensagens (mensagem, Endereco_IP, Porta, sn) values (" +
        "'" + param1 + "'," +
        "'" + param2 + "'," +
        "'" + param3 + "'," +
        "'" + param4 + "'" +
        ")";

    con.query(sql, function (err, result) {
        if (err) { console.log("Erro ao Gravar. Detalhes: " + err); return; }
        console.log("Mensagem gravada em Banco de dados.");
    });
}

function responde_TXUP(txup_msg, txtup_param1, txtup_param2) {
    // resposta a comandos TX e UP
    var ack = new Buffer(txup_msg);
    server.send(ack, 0, ack.length, txtup_param2, txtup_param1, function (err, bytes) {
        console.log("Resposta a comandos TX/UP Enviada.");
    });
    responder_txup = 0;
}

function salva_mensagem_localizacao(loc_msg, loc_adress, loc_port) {

    var SN, CMD, AV, MensagemData, Latitude, Longitude, Speed, Course, MensagemStatus, MensagemSignal, MensagemPower;
    var Oil, Kilometragem, Altitude;
    var aux1, aux2;

    var myarray = loc_msg.split(',');

    try {
        SN = myarray[1];
        CMD = myarray[2];
        AV = myarray[3];

        aux1 = myarray[4]; // YYMMDD
        var aux1_YY = convertHexToDec(aux1.substr(0, 2));
        var aux1_MM = convertHexToDec(aux1.substr(2, 2));
        var aux1_DD = convertHexToDec(aux1.substr(4, 2));

        aux2 = myarray[5]; // HHMMSS
        var aux2_HH = convertHexToDec(aux2.substr(0, 2));
        var aux2_MM = convertHexToDec(aux2.substr(2, 2));
        var aux2_SS = convertHexToDec(aux2.substr(4, 2));

        MensagemData = aux1_YY + "-" + aux1_MM + "-" + aux1_DD + " " + aux2_HH + ":" + aux2_MM + ":" + aux2_SS;

        Latitude = montaLatitude(myarray[6]);
        Longitude = montaLongitude(myarray[7]);

        Speed = myarray[8];
        Course = myarray[9];

        MensagemStatus = myarray[10];
        MensagemSignal = myarray[11];
        MensagemPower = myarray[12];

        Oil = myarray[13];
        Kilometragem = myarray[14];
        Altitude = myarray[15];
    } catch (err) {
        console.log("Não foi possivel salvar mensagem de Localização")
    }

    //salva mensagem em banco de dados
    sql = "insert into tbl_mensagens (Endereco_IP, Porta, mensagem, sn, CMD, AV, MensagemData, Latitude, Longitude," +
        "Speed, Course, MensagemStatus, MensagemSignal, MensagemPower, Oil, Kilometragem, Altitude) values (" +
        "'" + loc_adress + "'," +
        "'" + loc_port + "'," +
        "'" + loc_msg + "'," +
        "'" + SN + "'," +
        "'" + CMD + "'," +
        "'" + AV + "'," +
        "'" + MensagemData + "'," +
        "'" + Latitude + "'," +
        "'" + Longitude + "'," +
        "'" + Speed + "'," +
        "'" + Course + "'," +
        "'" + MensagemStatus + "'," +
        "'" + MensagemSignal + "'," +
        "'" + MensagemPower + "'," +
        "'" + Oil + "'," +
        "'" + Kilometragem + "'," +
        "'" + Altitude + "'" +
        ")";

    con.query(sql, function (err, result) {
        if (err) { console.log("Erro ao Gravar. Detalhes: " + err); return; }
        console.log("Mensagem de Localização gravada em Banco de dados.");
    });

    //Atualiza tabela de última localição
    sql = "update tbl_Localizacao set " +
        "LocalizacaoData = '" + MensagemData + "'," +
        "Latitude = '" + Latitude + "'," +
        "Longitude = '" + Longitude + "'," +
        "Speed = " + Speed + " " +
        "where SN = '" + SN + "'";

    con.query(sql, function (err, result) {
        if (err) { console.log("Erro ao Gravar. Detalhes: " + err); return; }
        console.log("Mensagem de Localização II gravada em Banco de dados.");
    });
}

function convertHexToDec(hexx) {
    var hex = hexx.toString();//force conversion
    var str = parseInt(hex, 16);
    return str;
}

function montaLatitude(Lat_param) {
    var lat;
    if (Lat_param.substr(0, 1) == "8") {
        //degreesSouth
        lat = - (convertHexToDec(Lat_param.substr(1, 7)) / 600000);
    }
    else {
        //degreesNorth
        lat = convertHexToDec(Lat_param) / 600000;
    }
    return lat;
}

function montaLongitude(Lng_param) {
    var lng;
    if (Lng_param.substr(0, 1) == "8") {
        //degreesWest
        lng = - (convertHexToDec(Lng_param.substr(1, 7)) / 600000);
    }
    else {
        //degreesEast
        lng = convertHexToDec(Lng_param) / 600000;
    }
    return lng;
}


server.bind(s_port);
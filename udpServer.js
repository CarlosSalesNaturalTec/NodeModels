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

var responder = 0;


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

    

    //salva mensagem em banco de dados
    sql = "insert into tbl_mensagens (Endereco_IP, Porta, mensagem) values (" +
    "'" + rinfo.address + "', " +
    "'" + rinfo.port + "', " +
    "'" + msg + "')";

    con.query(sql, function (err, result) {
        if (err) { console.log("Erro ao Gravar. Detalhes: " + err); return; }
        console.log("Mensagem gravada em Banco de dados.");
        console.log("----------------------------------------------------");
    });

    var verificaTX = msg.indexOf(",TX#");
    var verificaUP = msg.indexOf(",UP#");
    if (verificaTX != -1) { responder = 1 }
    if (verificaUP != -1) { responder = 1 }

    if (responder == 1) {
        // resposta a comandos TX e UP
        var ack = new Buffer(msg);
        server.send(ack, 0, ack.length, rinfo.port, rinfo.address, function (err, bytes) {
            console.log("Resposta a comandos TX/UP Enviada.");
            console.log("");
        });
        responder = 0;
    }

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

server.bind(s_port);
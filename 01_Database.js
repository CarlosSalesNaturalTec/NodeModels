//===========================================================================
// PARÂMETROS
//---------------------------------------------------------------------------
var con_host = "br-cdbr-azure-south-b.cloudapp.net";         // endereço do host
var con_user = "b06799fb954ded";                             // usuario
var con_pwd = "d8a197e8";                                   // senha

var db1 = "CREATE DATABASE dbrastreadores";

var Fim = "Pressione CTRL+C para finalizar.";
//===========================================================================


// CONEXÃO COM MYSQL-SERVER
var mysql = require('mysql');
var con = mysql.createConnection({
    host: con_host,
    user: con_user,
    password: con_pwd
});

// EXECUTA QUERY
con.connect(function (err) {
    if (err) { console.log("Erro ao tentar conectar com MYSQL Server. Detalhes: " + err); console.log(Fim); return; } else { console.log("Connectado ao MYSQL Server com Sucesso."); }

    con.query(db1, function (err, result) {
        if (err) { console.log("Erro ao tentar Criar Banco de Dados. Detalhes: " + err); console.log(Fim); return; } else { console.log("Banco de Dados CRIADO com Sucesso."); console.log(Fim); }
    });

});
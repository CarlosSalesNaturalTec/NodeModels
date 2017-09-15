//===========================================================================
// PARÂMETROS
//---------------------------------------------------------------------------
var con_host = "localhost";
var con_user = "admserver";
var con_pwd = "a123456@";

var db1 = "CREATE DATABASE DB_Rastreadores";

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
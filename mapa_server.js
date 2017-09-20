//===========================================================================
// PARÂMETROS
//---------------------------------------------------------------------------
// Banco de Dados SQL
var con_host = "br-cdbr-azure-south-b.cloudapp.net";        // endereço do host
var con_user = "b06799fb954ded";                            // usuario
var con_pwd = "d8a197e8";                                   // senha
var con_db = "dbrastreadores";                              // nome do banco de dados

var s_port = 20000;                                         // Porta de comunicaçao HTTP
//===========================================================================


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



//===========================================================================
// PARÂMETROS
//---------------------------------------------------------------------------
var con_host = "br-cdbr-azure-south-b.cloudapp.net";         // endereço do host
var con_user = "b06799fb954ded";                             // usuario
var con_pwd = "d8a197e8";                                   // senha
var con_db = "dbrastreadores";                              // nome do banco de dados

var Fim = "Pressione CTRL+C para finalizar.";

var tab1 = "create table tbl_mensagens (" +
    "ID_msg int not null auto_increment, " +
    "Endereco_IP varchar(50), " +
    "Porta varchar(10), " +
    "mensagem varchar(512), " +
    "primary key (ID_msg)" +
    ")";

var tab2 = "";
//===========================================================================


//---------------------------------------------------------------------------
// CONEXÃO AO MYSQL-SERVER
//---------------------------------------------------------------------------
var mysql = require('mysql');
var con = mysql.createConnection({
    host: con_host,
    user: con_user,
    password: con_pwd,
    database: con_db
});

con.connect(function (err) {
    if (err) { console.log("Erro ao tentar Conectar com MYSQL Server. Detalhes: " + err); return; } else { console.log("Connectado!"); }

    //cria tabela 01
    if (tab1 != "") {
        con.query(tab1, function (err, result) {
            if (err) { console.log("Erro ao tentar Criar Tabela 01. Detalhes: " + err); console.log(Fim); return; } else { console.log("Tabela 01 criada com Sucesso"); console.log(Fim);  }
        });
    }

   //cria tabela 02
   if (tab2 != "") {
    con.query(tab2, function (err, result) {
        if (err) { console.log("Erro ao tentar Criar Tabela 02. Detalhes: " + err); console.log(Fim); return; } else { console.log("Tabela 02 criada com sucesso"); console.log(Fim);  }
    });
}

 
});
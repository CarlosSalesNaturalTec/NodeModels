//---------------------------------------------------------------------------
// Carrega módulo UDP e outros
//---------------------------------------------------------------------------
var host = "localhost";
var c_port = 20500;
var dgram = require("dgram");
var client = dgram.createSocket("udp4");

//---------------------------------------------------------------------------
// Envia mensagem 
var message = new Buffer("2a45542c3335383135353130303039343831392c545823", "hex");

client.on("message", function(msg, rinfo) {
  console.log("Retorno Recebido: " + msg.toString("hex"));
  client.close();
});

client.on("err", function(err) {
  console.log("client error: \n" + err.stack);
  console.close();
});

client.on("close", function() {
  console.log("closed.");
});

send(message, host, c_port);
function send(message, host, port) {
  client.send(message, 0, message.length, port, host, function(err, bytes) {
    console.log("Mensagem Enviada");
  });
}
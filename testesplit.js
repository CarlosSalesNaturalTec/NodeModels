SN, CMD, AV, MensagemData, Latitude, Longitude;
var Speed, Course, MensagemStatus, MensagemSignal, MensagemPower, Oil, Kilometragem, Altitude;
var aux1, aux2;

//           0      1           2 3   4      5      6         7       8    9     10    11  12   13 14 15
var str = '*ET,358155100094819,HB,V,11090f,11391f,80d6d011,81ad2eb9,0000,0000,00400000,20,100,0000,2,765#';
var myarray = str.split(',');

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
    Longitude = myarray[7];
    Speed = myarray[8];
    Course = myarray[9];

    MensagemStatus = myarray[10];
    MensagemSignal = myarray[11];
    MensagemPower = myarray[12];

    Oil = myarray[13];
    Kilometragem = myarray[14];
    Altitude = myarray[15];
} catch (err) {
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
        lat = convertHexToDec(Lat_param.substr(1, 7)) / 600000;        
    } 
    else { 
        //degreesNorth
        lat = convertHexToDec(Lat_param) / 600000;
    }
    return lat;
}
//var str = '*ET,358155100094819,HB,V,11090f,11391f,80d6d011,81ad2eb9,0000,0000,00400000,20,100,0000,2,765#';
var str = '*ET,358155100094819,TX';


var myarray = str.split(',');
for(var i = 0; i < myarray.length; i++)
{
   console.log(myarray[i]);
   console.log( hex2a(myarray[i]) );
}

console.log("sn = " + myarray[1]);

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = parseInt(hex, 16);
    return str;
}
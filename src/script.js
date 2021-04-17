var dictionary = [];

function validateDNI() {
    var dniForm = document.forms["cvForm"]["dni"]
    var dni = dniForm.value

    regExpDNI = /^\d{8}[a-zA-Z]$/;
    if (regExpDNI.test(dni) == true) {
        var numeroDNI
        var letraDNI
        var letras
        var letra
        var regExpDNI
        numeroDNI = dni.substr(0, dni.length - 1);
        letraDNI = dni.substr(dni.length - 1, 1);
        letras = 'TRWAGMYFPDXBNJZSQVHLCKET';
        letra = letras.charAt(numeroDNI % 23);
        if (letra != letraDNI.toUpperCase()) {
            alert('Dni erroneo, la letra del NIF no se corresponde');
        } else {
            alert('Dni correcto');
            dniForm.value = numeroDNI + letraDNI.toUpperCase();
        }
    } else {
        alert('Dni erroneo, formato no válido');
    }
}

/*
function updateClock() {
    document.getElementById("clockHeader").innerHTML = "<h1>" + new Date().toLocaleString() + "</h1>";
}

setInterval(updateClock, 1000);
*/

function launch() {
    //updateClock();
    loadDictionary();
    genera_tabla()
}

function loadDictionary() {
    /* Se realiza la peticion asincrona con fetch. */
    fetch("https://ordenalfabetix.unileon.es/aw/diccionario.txt").then(r => r.text()).then(function (dic) {
        /* Se separa el String recibido por saltos de linea metiendo las palabras a una lista. */
        while (dic.indexOf("\n") != -1) {
            dictionary.push(dic.substr(0, dic.indexOf("\n")));
            dic = dic.substr(dic.indexOf("\n") + 1);
        }
    })
}

function genera_tabla() {

    let myTable= "<table><tr><td style='width: 100px; color: red;'>ID</td>";
    myTable+= "<td style='width: 100px; color: red; text-align: right;'>Nombre</td>";
    myTable+="<td style='width: 100px; color: red; text-align: right;'>Cantidad</td>";
    myTable+="<td style='width: 100px; color: red; text-align: right;'>Precio</td></tr>";
    myTable+="<tr><td style='width: 100px;'>---------------</td>";
    myTable+="<td style='width: 100px; text-align: right;'>---------------</td>";
    myTable+="<td style='width: 100px; text-align: right;'>---------------</td>";
    myTable+="<td style='width: 100px; text-align: right;'>---------------</td></tr>";

    for (let i = 0; i < 5; i++) {
        myTable+="<tr><td style='width: 100px;text-align: right;'>aaaa</td>";
        myTable+="<td style='width: 100px;text-align: right;'> aaaa </td>";
        myTable+="<td style='width: 100px;text-align: right;'>aaaa</td>";
        myTable+="<td style='width: 100px;text-align: right;'>aaaa</td>";
        myTable+="</tr>";
    }

    myTable+="</table>";
    document.getElementById('tablePrint').innerHTML = myTable;
}
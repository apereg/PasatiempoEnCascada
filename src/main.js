const dictionary = []

function launch() {
    loadDictionary()
    createTable()

}

function loadDictionary() {
    /* Se realiza la peticion asincrona con fetch. */
    fetch("https://ordenalfabetix.unileon.es/aw/diccionario.txt").then(r => r.text()).then(function (dic) {
        /* Se separa el String recibido por saltos de linea metiendo las palabras a una lista. */
        while (dic.indexOf("\n") !== -1) {
            dictionary.push(dic.substr(0, dic.indexOf("\n")).toUpperCase())
            dic = dic.substr(dic.indexOf("\n") + 1)
        }
    })
}

function createTable() {
    let table = "<table>";

    let id = 0;
    for (let i = 0; i < 6; i++) {
        table += "<tr>"
        for (let j = 0; j < 4; j++)
            table += "<td id='box" + (++id) + "' class='box'><input type=\"text\" maxLength='1' class=\"box\" onKeyUp=checkBoardFour()></td>"
        table += "</tr>"
    }
    document.getElementById("tableFour").innerHTML = table + "</table"

    table = "<table>";
    for (let i = 0; i < 6; i++) {
        table += "<tr>"
        for (let j = 0; j < 6; j++)
            table += "<td id='box'" + (++id) + "' class=\"box\" maxLength=1><input type=\"text\" class=\"box\" onKeyUp=checkBoardSix()></td>"
        table += "</tr>"
    }
    document.getElementById("tableSix").innerHTML = table + "</table"
}

async function markCorrect(cells) {
    console.log("aaaaaaaaaaaaaaaaaaaaaa")
    /*queueMicrotask(() => {
        for (let i = 0; i < 100; i++) {
            cells.classList.add('boxCorrect')
            cells.classList.remove('box')
            sleep(100)
            cells.classList.remove('boxCorrect')
            cells.classList.add('box')
        }
    });*/
}

function markFalse() {
    console.log("bbbbbbbbbbbbbbbbbbb")
}

function checkBoardFour() {
    console.log("----------------------")
    console.log("Se comprueba el tablero de cuatro")
    const table = document.getElementById("tableFour")
    for (let i = 0; i < table.rows.length; i++) {
        let word = mapWord(table.rows[i].getElementsByTagName('td'))
        console.log("Se lee la palabra " + word + " en la posicion " + i)
        if (word.length === 4) {
            if (dictionary.includes(word)) {
                console.log("Ready")
                if (i === 0) {
                    ((word === "CLAN") ? markCorrect(table.rows[i].getElementsByTagName('td')) : markFalse(table.rows[i].getElementsByTagName('td')))
                } else if (i === table.rows.length - 1) {
                    ((word === "PENA") ? markCorrect(table.rows[i].getElementsByTagName('td')) : markFalse(table.rows[i].getElementsByTagName('td')))
                } else {
                    console.log("Se va a comparar")
                    let lastWord = mapWord(table.rows[i - 1].getElementsByTagName('td'))
                    if (dictionary.includes(lastWord)) {
                        if (!checkVeracity(word, lastWord, i)) {
                            alert("Palabra incorrecta: " + word + " (No cumple las condiciones respecto a " + lastWord + ")")
                            deleteLastChar(table.rows[i].getElementsByTagName('td'))
                        }
                    } else {
                        alert("Complete antes la palabra anterior")
                    }
                }
            } else{
                alert("La palabra " +word.toLowerCase()+ " no esta registrada en el diccionario")
                deleteLastChar(table.rows[i].getElementsByTagName('td'))
            }
        } else {
            console.log("Aun no esta ready")
        }
    }
}

function checkBoardSix() {
}

function deleteLastChar(word){
    word[word.length - 1].getElementsByTagName('input')[0].value = ""
}

function mapWord(cells) {
    let word = ""
    for (let j = 0; j < cells.length; j++) {
        word += cells[j].getElementsByTagName("input")[0].value
    }
    return word.toUpperCase()
}

function checkVeracity(word1, word2, index) {
    console.log(index)
    return ((index % 2 === 0) ? checkCross(word1, word2) : checkChange(word1, word2))
}

function checkCross(word1, word2) {
    console.log("Se llega el check cross con " + word1 + " y " + word2)
    let coincidences = 0
    for (let i = 0; i < word1.length; i++)
        if (word1.includes(word2[i]))
            coincidences++
    return coincidences === word1.length;
}

function checkChange(word1, word2) {
    console.log("Se llega el check change con " + word1 + " y " + word2)
    let coincidences = 0
    for (let i = 0; i < word1.length; i++)
        if (word1[i] == word2[i])
            coincidences++
    return coincidences === word1.length - 1;
}

function sleep(milliseconds) {
    const start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
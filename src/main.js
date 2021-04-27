let dictionary = []

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
    dictionary.push("NACI")
    dictionary.push("NACE")
}

function createTable() {
    let table = "<table>";
    console.log(" Creando tabla")

    for (let i = 0; i < 6; i++) {
        table += "<tr>"
        for (let j = 0; j < 4; j++)
            table += "<td class='box'><input type='text' maxLength='1' class='box' onKeyUp=checkBoardFour()></td>"
        table += "</tr>"
    }
    document.getElementById("tableFour").innerHTML = table + "</table>"

    table = "<table>";
    for (let i = 0; i < 6; i++) {
        table += "<tr>"
        for (let j = 0; j < 6; j++)
            table += "<td class='box'><input type='text' maxLength='1' class='box' onKeyUp=checkBoardSix()></td>"
        table += "</tr>"
    }
    document.getElementById("tableSix").innerHTML = table + "</table>"
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

function markFalse(word) {
    alert("Palabra incorrecta (" + mapWord(word) + ")")
    deleteLastChar(word)
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
                        alert("Complete antes la palabra anterior a " + word)
                    }
                }
            } else {
                alert("La palabra " + word + " no esta registrada en el diccionario")
                deleteLastChar(table.rows[i].getElementsByTagName('td'))
            }
        } else {
            console.log("Aun no esta ready")
        }
    }
}

function checkBoardSix() {
}

function deleteLastChar(word) {
    word[word.length - 1].getElementsByTagName('input')[0].value = ""
    word[word.length - 1].focus()
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
        if (word1[i] === word2[i])
            coincidences++
    return coincidences === word1.length - 1;
}

function searchClues(){
    /* Se obtienen las pistas restantes para si son 0 no seguir con la operacion. */
    let cluesLeft = document.getElementById('cluesLeft').innerHTML.substring(19);
    if(parseInt(cluesLeft) == 0) {
        alert("¡No te quedan más pistas!")
        return;
    }

    /* Se mapea las palabras de busqueda en un array ordenado alfabeticamente. */
    const aux = document.getElementById('cluesSearchBar').getElementsByTagName('input')[0].value.toUpperCase()
    let letters = []
    for (let i = 0; i < aux.length; i++)
        letters.push(aux[i])

    if(letters.length == 0){
        alert("¡El campo de las letras esta vacio!")
        return
    }
    letters = letters.sort()

    /* Se buscan las palabras del diccionario obteniendo las validas. */
    const validWords = []
    for (let i = 0; i < dictionary.length; i++) {
        let valid = true
        let posToSearch = 0
        let j = 0
        while (j < letters.length && valid !== false) {
            /* Si ya una de las letras no esta se salta a la siguiente palabra. */
            if(dictionary[i].indexOf(letters[j], posToSearch) !== -1){
                /* Si la siguiente letra a buscar es la misma se actualiza la posicion de inicio. */
                if(letters.length > j+1 && letters[j+1] === letters[j])
                    posToSearch = dictionary[i].indexOf(letters[j], posToSearch) + 1
                else
                    posToSearch = 0
            } else {
                valid = false
            }
            j++
        }
        if(valid)
            validWords.push(dictionary[i])
    }

    /* Se muestran las palabras y se actualizan las pistas. */
    document.getElementById('cluesResult').innerText = validWords.toString()
    document.getElementById('cluesLeft').innerHTML = document.getElementById('cluesLeft').innerHTML.replace(cluesLeft, (parseInt(cluesLeft)-1).toString())
}
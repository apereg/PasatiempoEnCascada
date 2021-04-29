let dictionary = []

    /* Funcion a ejecutar nada mas arrancar la pagina para cargar el diccionario. */
    (async function () {
        dictionary = await getDictionary();
        dictionary.push("REMATO");
        dictionary.push("NACÍ");
        dictionary.push("NACE");
        dictionary.push("TOLERO")
    })()

async function getDictionary() {
    /* Se utiliza fetch para realizar la peticion de forma asincrona. */
    return (await (await fetch('https://ordenalfabetix.unileon.es/aw/diccionario.txt')).text()).toUpperCase().split('\n')
}

function createTable() {
    let table = "<table>";
    console.log(" Creando tabla")

    for (let i = 0; i < 6; i++) {
        table += "<tr>"
        for (let j = 0; j < 4; j++)
            table += "<td class='box'><input type='text' maxLength='1' class='box' onKeyUp=checkBoardFour()></td>"
        if (i === 0) table += "<th>1</th>"
        if (i === 5) table += "<th>2</th>"
        table += "</tr>"
    }
    document.getElementById("tableFour").innerHTML = table + "</table>"

    table = "<table>";
    for (let i = 0; i < 6; i++) {
        table += "<tr>"
        for (let j = 0; j < 6; j++)
            table += "<td class='box'><input type='text' maxLength='1' class='box' onKeyUp=checkBoardSix()></td>"
        if (i === 0) table += "<th>3</th>"
        if (i === 5) table += "<th>4</th>"
        table += "</tr>"
    }
    document.getElementById("tableSix").innerHTML = table + "</table>"
}

function markCorrect(cells) {
    for (let j = 0; j < cells.length; j++) {
        cells[j].getElementsByTagName("input")[0].classList.add("boxCorrect")
    }
}

function markFalse(word) {
    alert("Palabra incorrecta (" + mapWord(word) + ")")
    deleteLastChar(word)
    cleanCorrectEffect(word)
}

function cleanCorrectEffect(cells) {
    for (let j = 0; j < cells.length; j++) {
        cells[j].getElementsByTagName("input")[0].classList.remove("boxCorrect")
    }
}

function checkBoardFour() {
    const table = document.getElementById("tableFour")
    for (let i = 0; i < table.rows.length; i++) {
        let word = mapWord(table.rows[i].getElementsByTagName('td'))
        if (word.length === 4) {
            if (dictionary.includes(word)) {
                if (i === 0)
                    ((word === "CLAN") ? markCorrect(table.rows[i].getElementsByTagName('td')) : markFalse(table.rows[i].getElementsByTagName('td')))
                else if (i === table.rows.length - 1)
                    ((word === "PENA") ? markCorrect(table.rows[i].getElementsByTagName('td')) : markFalse(table.rows[i].getElementsByTagName('td')))
                else
                    compareWithLastWord(table, i, word);
            } else {
                alert("La palabra " + word + " no esta registrada en el diccionario")
                deleteLastChar(table.rows[i].getElementsByTagName('td'))
            }
        } else {
            if (i === 0 || i === table.rows.length - 1)
                cleanCorrectEffect(table.rows[i].getElementsByTagName('td'))
        }
    }
}

function compareWithLastWord(table, index, word) {
    let lastWord = mapWord(table.rows[index - 1].getElementsByTagName('td'))
    if (dictionary.includes(lastWord)) {
        if (!checkVeracity(word, lastWord, index)) {
            alert("Palabra incorrecta: " + word + " (No cumple las condiciones respecto a " + lastWord + ")")
            deleteLastChar(table.rows[index].getElementsByTagName('td'))
        }
    } else {
        alert("Complete antes la palabra anterior a " + word)
    }
}

function checkBoardSix() {
    const table = document.getElementById("tableSix")
    for (let i = 0; i < table.rows.length; i++) {
        let word = mapWord(table.rows[i].getElementsByTagName('td'))
        if (word.length === 6) {
            if (dictionary.includes(word)) {
                if (i === 0)
                    ((word === "REMATO") ? markCorrect(table.rows[i].getElementsByTagName('td')) : markFalse(table.rows[i].getElementsByTagName('td')))
                else if (i === table.rows.length - 1)
                    ((word === "TORERO") ? markCorrect(table.rows[i].getElementsByTagName('td')) : markFalse(table.rows[i].getElementsByTagName('td')))
                else
                    compareWithLastWord(table, i, word);

            } else {
                alert("La palabra " + word + " no esta registrada en el diccionario")
                deleteLastChar(table.rows[i].getElementsByTagName('td'))
            }
        } else {
            if (i === 0 || i === table.rows.length - 1)
                cleanCorrectEffect(table.rows[i].getElementsByTagName('td'))
        }
    }
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

function searchClues() {
    /* Se obtienen las pistas restantes para si son 0 no seguir con la operacion. */
    let cluesLeft = document.getElementById('cluesLeft').innerHTML.substring(19);
    if (parseInt(cluesLeft) === 0) {
        alert("¡No te quedan más pistas!")
        return;
    }

    /* Se mapea las palabras de busqueda en un array ordenado alfabeticamente. */
    const aux = document.getElementById('cluesSearchBar').getElementsByTagName('input')[0].value.toUpperCase()
    let letters = []
    for (let i = 0; i < aux.length; i++)
        letters.push(aux[i])

    if (letters.length === 0) {
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
            if (dictionary[i].indexOf(letters[j], posToSearch) !== -1) {
                /* Si la siguiente letra a buscar es la misma se actualiza la posicion de inicio. */
                if (letters.length > j + 1 && letters[j + 1] === letters[j])
                    posToSearch = dictionary[i].indexOf(letters[j], posToSearch) + 1
                else
                    posToSearch = 0
            } else {
                valid = false
            }
            j++
        }
        if (valid)
            validWords.push(dictionary[i].charAt(0) + dictionary[i].substr(1).toLowerCase())
    }

    /* Se muestran las palabras y se actualizan las pistas. */
    document.getElementById('cluesResult').innerHTML = validWords.toString().replaceAll(',', '<br>')
    document.getElementById('cluesLeft').innerHTML = document.getElementById('cluesLeft').innerHTML.replace(cluesLeft, (parseInt(cluesLeft) - 1).toString())
}

function saveOnLocal() {
    console.log("save")
}

function loadFromLocal() {
    console.log("load")
}

function cleanMemory() {
    console.log("cleanMemori")
}

function cleanTables() {
    cleanTable(document.getElementById('tableFour'))
    cleanTable(document.getElementById('tableSix'))
}

function cleanTable(table) {
    for (let i = 0; i < table.rows.length; i++) {
        let cells = table.rows[i].getElementsByTagName('td')
        for (let j = 0; j < cells.length; j++)
            cells[j].getElementsByTagName('input')[0].value = ''

        if (i === 0 || i === table.rows.length - 1)
            for (let j = 0; j < cells.length; j++)
                cells[j].getElementsByTagName('input')[0].classList.remove('boxCorrect')
    }
}
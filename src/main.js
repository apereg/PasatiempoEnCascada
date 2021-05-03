let dictionary = []

/* GESTION DE LAS COOKIES. */
window.addEventListener("load", function () {
    window.cookieconsent.initialise({
        "palette": {"popup": {"background": "#3c404d"}, "button": {"background": "#14a7d0"}},
        "type": "opt-in",
        "content": {
            "message": "Se requieren cookies para el almacenamiento de pasatiempos",
            "allow": "Aceptar",
            "deny": "Rechazar",
            "link": "¿Que son las cookies?"
        },
        onInitialise(status) {
            if (status === cookieconsent.status.allow)
                enableStorage()
            else
                disableStorage()
        },
        onStatusChange(status) {
            if (status === "allow")
                enableStorage()
            else
                disableStorage()
        }
    })
})

async function getDictionary() {
    /* Se utiliza fetch para realizar la peticion de forma asincrona. */
    return (await (await fetch('https://ordenalfabetix.unileon.es/aw/diccionario.txt')).text()).toUpperCase().split('\n')
}

(async function () {
    /* Funcion a ejecutar nada mas cargar la pagina para cargar el diccionario. */
    dictionary = await getDictionary()
    dictionary.push("REMATO")
    dictionary.push("NACI")
    dictionary.push("NACÍ")
    dictionary.push("NACE")
    dictionary.push("TOLERO")
})()

function createTable() {
    let table = "<table>"

    for (let i = 0; i < 6; i++) {
        table += "<tr>"
        for (let j = 0; j < 4; j++)
            table += "<td class='box'><input type='text' maxLength='1' class='box' onkeyup='checkBoard(0)'></td>"
        if (i === 0) table += "<th>1</th>"
        if (i === 5) table += "<th>2</th>"
        table += "</tr>"
    }
    document.getElementById("tableFour").innerHTML = table + "</table>"

    table = "<table>";
    for (let i = 0; i < 6; i++) {
        table += "<tr>"
        for (let j = 0; j < 6; j++)
            table += "<td class='box'><input type='text' maxLength='1' class='box' onkeyup='checkBoard(1)'></td>"
        if (i === 0) table += "<th>3</th>"
        if (i === 5) table += "<th>4</th>"
        table += "</tr>"
    }
    document.getElementById("tableSix").innerHTML = table + "</table>"

    /* Si hay algun pasatiempo guardado se carga */
    if (localStorage.length !== 0)
        loadFromLocal()
}

function checkBoard(table) {
    if (table === 0) {
        if (checkBoardFour() && checkBoardSix())
            swal({
                title: "Oleeeeeeeeeee",
                text: "Pasatiempo completado",
                icon: "success"
            });
    } else {
        if (checkBoardSix() && checkBoardFour())
            swal({
                title: "Oleeeeeeeeeee",
                text: "Pasatiempo completado",
                icon: "success"
            });
    }

}

function checkBoardFour() {
    let returnValue = true
    const table = document.getElementById("tableFour")
    for (let i = 0; i < table.rows.length; i++) {
        let word = mapWord(table.rows[i].getElementsByTagName('td'))
        if (word.length === 4) {
            if (dictionary.includes(word)) {
                if (i === 0) {
                    if (word === "CLAN") {
                        markCorrect(table.rows[i].getElementsByTagName('td'))
                    } else {
                        markFalse(table.rows[i].getElementsByTagName('td'))
                        returnValue = false
                    }
                } else if (i === table.rows.length - 1) {
                    if (word === "PENA") {
                        markCorrect(table.rows[i].getElementsByTagName('td'))
                    } else {
                        markFalse(table.rows[i].getElementsByTagName('td'))
                        returnValue = false
                    }
                } else {
                    if (!compareWithLastWord(table, i, word))
                        returnValue = false
                }
            } else {
                swal({
                    title: "Palabra incorrecta",
                    text: "La palabra " + word.toLowerCase() + " no existe en el diccionario",
                    icon: "error",
                    button: "¡Entendido!"
                });
                deleteLastChar(table.rows[i].getElementsByTagName('td'))
                returnValue = false
            }
        } else {
            if (i === 0 || i === table.rows.length - 1)
                cleanCorrectEffect(table.rows[i].getElementsByTagName('td'))
            returnValue = false
        }
    }

    return returnValue
}

function checkBoardSix() {
    let returnValue = true
    const table = document.getElementById("tableSix")
    for (let i = 0; i < table.rows.length; i++) {
        let word = mapWord(table.rows[i].getElementsByTagName('td'))
        if (word.length === 6) {
            if (dictionary.includes(word)) {
                if (i === 0) {
                    if (word === "REMATO") {
                        markCorrect(table.rows[i].getElementsByTagName('td'))
                    } else {
                        markFalse(table.rows[i].getElementsByTagName('td'))
                        returnValue = false
                    }
                } else if (i === table.rows.length - 1) {
                    if (word === "TORERO") {
                        markCorrect(table.rows[i].getElementsByTagName('td'))
                    } else {
                        markFalse(table.rows[i].getElementsByTagName('td'))
                        returnValue = false
                    }
                } else {
                    if (!compareWithLastWord(table, i, word))
                        returnValue = false
                }
            } else {
                swal({
                    title: "Palabra incorrecta",
                    text: "La palabra " + mapWord(word).toLowerCase() + " no existe en el diccionario",
                    icon: "error",
                    button: "¡Entendido!"
                });
                deleteLastChar(table.rows[i].getElementsByTagName('td'))
                returnValue = false
            }
        } else {
            if (i === 0 || i === table.rows.length - 1)
                cleanCorrectEffect(table.rows[i].getElementsByTagName('td'))
            returnValue = false
        }
    }

    return returnValue
}

function mapWord(cells) {
    let word = ""
    for (let j = 0; j < cells.length; j++)
        word += cells[j].getElementsByTagName("input")[0].value
    return word.toUpperCase()
}

function compareWithLastWord(table, index, word) {
    let lastWord = mapWord(table.rows[index - 1].getElementsByTagName('td'))
    if (dictionary.includes(lastWord)) {
        if (!checkVeracity(word, lastWord, index)) {
            swal({
                title: "¡Respeta las reglas!",
                text: word[0] + word.substr(1).toLowerCase() + "no cumple las condiciones respecto a " + lastWord.toLowerCase(),
                icon: "error",
                button: "¡Entendido!"
            });
            deleteLastChar(table.rows[index].getElementsByTagName('td'))
            return false
        }
    } else {
        swal({
            title: "¡Respeta las reglas!",
            text: "Completa la palabra anterior primero",
            icon: "error",
            button: "¡Entendido!"
        });
        return false
    }
    return true
}

function deleteLastChar(word) {
    word[word.length - 1].getElementsByTagName('input')[0].value = ""
    word[word.length - 1].focus()
}

function cleanCorrectEffect(cells) {
    for (let j = 0; j < cells.length; j++) {
        cells[j].getElementsByTagName("input")[0].classList.remove("boxCorrect")
    }
}

function checkVeracity(word1, word2, index) {
    return ((index % 2 === 0) ? checkCross(word1, word2) : checkChange(word1, word2))
}

function checkCross(word1, word2) {
    /* Comprobacion a mano ya que la tilde en la i no cumple los requisitos del juego. */
    if (word1 === "NACÍ" && word2 === "CIAN")
        return true

    let coincidences = 0
    for (let i = 0; i < word1.length; i++)
        if (word1.includes(word2[i]))
            coincidences++
    return coincidences === word1.length;
}

function checkChange(word1, word2) {
    let coincidences = 0
    for (let i = 0; i < word1.length; i++)
        if (word1[i] === word2[i])
            coincidences++
    return coincidences === word1.length - 1;
}

function markCorrect(cells) {
    for (let j = 0; j < cells.length; j++) {
        cells[j].getElementsByTagName("input")[0].classList.add("boxCorrect")
    }
}

function markFalse(word) {
    swal({
        title: "Palabra incorrecta",
        text: "La definicion no concuerda con " + mapWord(word).toLowerCase(),
        icon: "error",
        button: "¡Entendido!"
    });
    deleteLastChar(word)
    cleanCorrectEffect(word)
}

function searchClues() {
    /* Se obtienen las pistas restantes para si son 0 no seguir con la operacion. */
    let cluesLeft = document.getElementById('cluesLeft').innerHTML.substring(19);
    if (parseInt(cluesLeft) === 0) {
        swal({title: "Intentalo tu solo", text: "¡No te quedan más pistas!", icon: "error", button: "¡Entendido!"});
        return;
    }

    /* Se mapea las palabras de busqueda en un array ordenado alfabeticamente. */
    const rawWord = document.getElementById('cluesSearchBar').getElementsByTagName('input')[0].value.toUpperCase()
    let letters = []
    for (let i = 0; i < rawWord.length; i++)
        letters.push(rawWord[i])

    if (letters.length === 0) {
        swal({
            title: "No se encontraron pistas",
            text: "El campo de las pistas está vacio",
            icon: "warning",
            button: "¡Entendido!"
        });
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
        if (valid && dictionary[i].length === letters.length)
            validWords.push(dictionary[i].charAt(0) + dictionary[i].substr(1).toLowerCase())
    }

    /* Se muestran las palabras y se actualizan las pistas. */
    document.getElementById('cluesResult').innerHTML = validWords.toString().replaceAll(',', '<br>')
    document.getElementById('cluesLeft').innerHTML = document.getElementById('cluesLeft').innerHTML.replace(cluesLeft, (parseInt(cluesLeft) - 1).toString())
}

function saveOnLocal() {
    let iterator = 0
    let voidBoard = true
    saveTableOnLocal(document.getElementById("tableFour"))
    saveTableOnLocal(document.getElementById("tableSix"))

    function saveTableOnLocal(table) {
        for (let i = 0; i < table.rows.length; i++) {
            const cells = table.rows[i].getElementsByTagName('td')
            for (let j = 0; j < cells.length; j++) {
                if (cells[j].getElementsByTagName("input")[0].value !== "")
                    voidBoard = false
                localStorage.setItem((iterator++).toString(), cells[j].getElementsByTagName("input")[0].value)
            }
        }
    }

    if (voidBoard) {
        swal({
            title: "Nada que guardar",
            text: "El tablero está vacio",
            icon: "error",
            button: "¡Entendido!"
        });
    } else {
        document.getElementById('loadButton').disabled = false;
        swal({
            title: "Guardado",
            text: "Podras retomar tu pasatiempo la proxima vez que accedas",
            icon: "success",
            button: "¡Entendido!"
        });
    }
}


function loadFromLocal() {
    let iterator = 0
    loadTableFromLocal(document.getElementById("tableFour"))
    loadTableFromLocal(document.getElementById("tableSix"))

    function loadTableFromLocal(table) {
        for (let i = 0; i < table.rows.length; i++) {
            const cells = table.rows[i].getElementsByTagName('td')
            for (let j = 0; j < cells.length; j++) {
                if (cells[j].getElementsByTagName("input")[0].value !== null)
                    cells[j].getElementsByTagName("input")[0].value = localStorage.getItem((iterator++).toString())
            }
        }
    }
}

function cleanMemory() {
    let i = 0
    while (localStorage.getItem(i.toString()) !== null) {
        localStorage.setItem(i.toString(), null)
        i++
    }
    if (!document.getElementById('loadButton').disabled)
        document.getElementById('loadButton').disabled = true
    swal({
        title: "¡Listo jefe!",
        text: "Se han limpiado los pasatiempos guardados",
        icon: "success",
        button: "¡Perfecto!"
    });
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

function enableStorage() {
    document.getElementById('saveButton').disabled = false;
    document.getElementById('loadButton').disabled = localStorage.length === 0;
    document.getElementById('cleanMemoryButton').disabled = false;
}

function disableStorage() {
    document.getElementById('saveButton').disabled = true;
    document.getElementById('loadButton').disabled = true;
    document.getElementById('cleanMemoryButton').disabled = true;
}


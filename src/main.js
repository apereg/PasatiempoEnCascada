const dictionary = []
const numberOfEntries = 60

function launch() {
    loadDictionary()
    createTable()

}

function loadDictionary() {
    let word
    /* Se realiza la peticion asincrona con fetch. */
    fetch("https://ordenalfabetix.unileon.es/aw/diccionario.txt").then(r => r.text()).then(function (dic) {
        /* Se separa el String recibido por saltos de linea metiendo las palabras a una lista. */
        while (dic.indexOf("\n") !== -1) {
            word = dic.substr(0, dic.indexOf("\n"))
            if (word.length == 4 || word.length == 6)
                dictionary.push(word)
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
            table += "<td id=\"box" + (++id) + "\" class=\"box\" maxLength=\"1\"><input type=\"text\" class=\"box\" onKeyUp=checkBoardFour()></td>"
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

function markCorrect(cells) {
    console.log("aaaaaaaaaaaaaaaaaa")
    for (let j = 0; j < cells.length; j++) {
        cells[j].classList.add('boxCorrect')
        cells[j].classList.remove('box')
    }
}

function markFalse(cells) {
    console.log("bbbbbbbbbbbbbbbbbbb")
}

function checkBoardFour() {
    const table = document.getElementById("tableFour");
    for (let i = 0; i < table.rows.length; i++) {
        let word = mapWord(table.rows[i].getElementsByTagName('td'))
        if(word.length == 4){
            if(i == 0){
                if(word == "CLAN")
                    markCorrect(table.rows[i].getElementsByTagName('td'))
                else
                    markFalse(table.rows[i].getElementsByTagName('td'))
            }

        }
        console.log(word)
    }
}

function checkBoardSix() {
}

function mapWord(cells){
    let word = ""
    for (let j = 0; j < cells.length; j++) {
        const cellValue = cells[j].getElementsByTagName("input")[0].value;
        if(cellValue.length > 1)
            cells[j].getElementsByTagName("input")[0].value = cellValue.substr(cellValue.length-1)
        word += cells[j].getElementsByTagName("input")[0].value
    }
    return word.toUpperCase()
}

function checkVeracity(word1, word2, index){
    return ((index != 1)?checkCross(word1, word2):checkChange(word1, word2))
}

function checkCross(word1, word2) {
    return getCoincidences(word1, word2) != word1.length;
}

function checkChange(word1, word2) {
    return getCoincidences(word1, word2) != word1.length-1;
}

function getCoincidences(word1, word2) {
    let coincidences = 0
    for (let i = 0; i < word1.length; i++)
        if(word1[i] == word2[i])
            coincidences++
    return coincidences
}

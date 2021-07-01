function doPost(e) {

    // получаем сигнал от бота
    let update = JSON.parse(e.postData.contents);
    let sheet =  SpreadsheetApp.openById('17S6qp8a_9gXEyrfF--aVtIucgrb4ecojtPsZ6NG_AQE').getSheets()[0]
    let arraysComands = sheet.getRange(2,5, sheet.getLastRow()-1).getValues();
    let arrayComands = arraysComands.map(function (row){return row[0]})

    // проверяем тип полученного, нам нужен только тип "сообщение"
    if (update.hasOwnProperty('message')) {
        let msg = update.message;
        let chatId = msg.chat.id;
        let comandNumRow = arrayComands.indexOf(msg.text) + 2;

        // проверяем, является ли сообщение командой к боту
        //if (msg.hasOwnProperty('entities') && msg.entities[0].type == 'bot_command') {

        // проверяем на название команды - /lastpost
        //if (msg.text == '/lastpost') {

        // если все проверки пройдены - запускаем код, который ниже,
        // открываем оглавление нашего канала


        // достает последний пст
        let lastpost = sheet.getRange(comandNumRow, 1, 1,  4).getValues()[0]
        let message = ' <strong>'+lastpost[0] + '</strong> \n' + lastpost[3]

        //формируем с ним сообщение
        let payload = {
            'method': 'sendMessage',
            //'chat_id': String(chatId),
            'chat_id': 146037058,
            'text': "Пользователь: " +  update.message.from.first_name + " " + update.message.from.last_name + ", id чата: " +  update.message.chat.id,
            'parse_mode': 'HTML'
        }
        let data = {
            "method": "post",
            "payload": payload
        }

        // и отправляем его боту (замените API на свой)
        let API_TOKEN = '1849336221:AAGBmoyYig9kyg30c1T1k0zbrNcayIdwrcA'
        UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);

        payload = {
            'method': 'sendMessage',
            'chat_id': String(chatId),
            'text': "Вы не аторизованы, обратитесь к Владимиру Ялунину",
            'parse_mode': 'HTML'
        }
        data = {
            "method": "post",
            "payload": payload
        }

        // и отправляем его боту (замените API на свой)
        UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);
    }
}
// }
//}
function temp(e) {

    let sheet =  SpreadsheetApp.openById('17S6qp8a_9gXEyrfF--aVtIucgrb4ecojtPsZ6NG_AQE').getSheets()[0]
    let arraysComands = sheet.getRange(2,5, sheet.getLastRow()-1).getValues();
    let arrayComands = arraysComands.map(function (row){return row[0]})

    let comandNumRow = arrayComands.indexOf("/Altai_region") + 2;

    Logger.log(API_TOKEN)

}

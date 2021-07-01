function doPost(e) {

    // Объявление констант
    // id бота
    // id чата, которому уходит сообщение о неизвестном пользователе
    // id таблицы
    // наименование листа с резолюциями
    // наименование листа с списком соответствия пользователей и регионов

    // Получаем сигнал бота

    // Проверяем, что это сообщение

    // Получаем объект таблицы по id

    // Объект авторизации, авторизован ли пользователь?

    // (нет) сообщаем о необходимости авторизации

    // (да) проверяем команду от пользователя

    // Если резолюции
    // получаем регион пользователя

    // получаем резолюции по региону и отправляем их пользователю

    // Если контакты возвращаем контакты



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

/**
 * Объект авторизации
 * @param googleSpreadsheet - Объект гугл таблицы
 * @param userData          - Данные пользователя
 * @constructor
 */
function ResBotAuth(googleSpreadsheet, userData){

    let ResBotAuth = {};

    ResBotAuth.listName = "Авторизация";
    ResBotAuth.googleSpreadsheet = googleSpreadsheet;

    // Получение массива пользователей
    ResBotAuth.getUsersFromSheet = function (){

    };

    // Пользователь есть в таблице
    ResBotAuth.userIsInSheet = function (){

    };

    // Отправка предложения авторизации
    ResBotAuth.sendAuthorizationOffer = function (){

    };

    // Отправка предложения авторизации
    ResBotAuth.sendAuthorizationAttemptForAdmin = function (adminChatId){

    };

    return ResBotAuth;

}

/**
 * Объект со списком регионов и соответствующих пользователей
 * @param googleSpreadsheet - Объект гугл таблицы
 * @constructor
 */
function ResBotRegions(googleSpreadsheet){

    let ResBotRegions = {};

    ResBotRegions.listName = "Авторизация";
    ResBotRegions.googleSpreadsheet = googleSpreadsheet;

    // Получение массива - регион -> пользователи
    ResBotRegions.getRegionsAndUsersFromSheet = function (){

    };

    // Получение региона по пользователю
    ResBotRegions.getRegionByUser = function (){

    };

    return ResBotRegions;

}

/**
 * Объект со списком (текстовым сообщением) резолюций
 * @param googleSpreadsheet - Объект гугл таблицы
 * @constructor
 */
function ResBotResolutions(googleSpreadsheet){

    let ResBotResolutions = {};

    ResBotResolutions.listName = "Бот";
    ResBotResolutions.googleSpreadsheet = googleSpreadsheet;

    // Получение массива - регион -> резолюции
    ResBotResolutions.getResolutionsFromSheet = function (){

    };

    // Получение резолюций по региону
    ResBotResolutions.getResolutionByRegion = function (){

    };

    return ResBotResolutions;

}

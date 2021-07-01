// Объявление констант
const SpreadsheetId = '17S6qp8a_9gXEyrfF--aVtIucgrb4ecojtPsZ6NG_AQE';
const ApiBotToken = '1849336221:AAGBmoyYig9kyg30c1T1k0zbrNcayIdwrcA';

function doPost(e) {

    // Получаем сигнал бота
    let update = JSON.parse(e.postData.contents);

    // Проверяем, что это сообщение и оно не пустое
    if (update.hasOwnProperty('message') && update.message.hasOwnProperty('text')) {

        // Получаем объект таблицы по id
        let spreadsheet = SpreadsheetApp.openById(SpreadsheetId);

        // Объект данных пользователя
        let userData = {
            firstName: update.message.from.first_name,
            lastName: update.message.from.last_name,
            chatId: update.message.chat.id
        };
        let currentUser = ResBotUser(spreadsheet, userData);

        let messagesAndSettings = ResBotSettingsAndMessages(spreadsheet);

        // Авторизован ли пользователь?
        if (!currentUser.userIsInSheet()) {

            // сообщаем о необходимости авторизации
            currentUser.sendMessage(messagesAndSettings.getBySlug("/authorizationOffer"));

            // Уведомляем ответственного о попытке
            let authAdmin = ResBotUser(spreadsheet, {chatId: messagesAndSettings.getBySlug("auth_admin_chat_id")});
            authAdmin.sendMessage(messagesAndSettings.getBySlug("/new_user") + currentUser.getStringUserData());

        } else {

            // проверяем команду от пользователя
            let commandText = update.message.text;

            switch (commandText) {
                // Если резолюции
                case "/resolutions":
                    // получаем регион пользователя
                    let regions = ResBotRegions(spreadsheet);
                    let userRegion = regions.getRegionByUser(userData.chatId);

                    if(userRegion){

                        // получаем резолюции по региону и отправляем их пользователю
                        let resolutions = ResBotResolutions(spreadsheet);

                        if(resolutions){
                            currentUser.sendMessage(resolutions);
                        }
                    }

                break;

                    // Если контакты возвращаем контакты
                case "/contacts":

                    currentUser.sendMessage(messagesAndSettings.getBySlug("/contacts"));
            }
        }
    }



    // получаем сигнал от бота
    // let update = JSON.parse(e.postData.contents);
    // let sheet =  SpreadsheetApp.openById('17S6qp8a_9gXEyrfF--aVtIucgrb4ecojtPsZ6NG_AQE').getSheets()[0]
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
 */
function ResBotUser(googleSpreadsheet, userData){

    let ResBotAuth = {};

    ResBotAuth.listName = "Авторизация";
    ResBotAuth.googleSpreadsheet = googleSpreadsheet;
    ResBotAuth.userData = userData;

    // Получение массива пользователей
    ResBotAuth.getUsersFromSheet = function (){

    };

    // Пользователь есть в таблице
    ResBotAuth.userIsInSheet = function (){

    };

    ResBotAuth.getStringUserData = function (){

    };

    // Отправить пользователю сообщение
    ResBotAuth.sendMessage = function (){

    };

    return ResBotAuth;

}

/**
 * Объект со списком регионов и соответствующих пользователей
 * @param googleSpreadsheet - Объект гугл таблицы
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

/**
 * Получение сообщения с контактами
 * @param googleSpreadsheet
 */
function ResBotSettingsAndMessages(googleSpreadsheet){

    let ResBotSettingsAndMessages = {};

    ResBotSettingsAndMessages.listName = "Бот";
    ResBotSettingsAndMessages.googleSpreadsheet = googleSpreadsheet;

    // Получение массива - регион -> резолюции
    ResBotSettingsAndMessages.getFromSheet = function (){

    };

    // Получение резолюций по региону
    ResBotSettingsAndMessages.getBySlug = function (){

        return "";
    };

    return ResBotSettingsAndMessages;
}

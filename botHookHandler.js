/**
 * Объявление констант
 * @type {string}
 */
const SpreadsheetId = '17S6qp8a_9gXEyrfF--aVtIucgrb4ecojtPsZ6NG_AQE';       // Id таблицы google sheet для хранения данных
const ApiBotToken = '1849336221:AAGBmoyYig9kyg30c1T1k0zbrNcayIdwrcA';       // Id бота

/**
 * Функция обработки запрса от бота
 * @param e
 */
function doPost(e) {

    // Получаем сигнал бота
    let update = JSON.parse(e.postData.contents);

    // Проверяем, что это сообщение и оно не пустое
    if (
        (update.hasOwnProperty('message') && update.message.hasOwnProperty('text')) ||              // Пришло сообщение написанное пользователем
        (update.hasOwnProperty('callback_query') && update.callback_query.hasOwnProperty('data'))   // Пользователем нажата inline кнопка
    ) {

        // Получаем объект таблицы по id
        let spreadsheet = SpreadsheetApp.openById(SpreadsheetId);

        // Объект данных пользователя
        let userData = update.message ? update.message.from : update.callback_query.from;
        let currentUser = ResBotUser(spreadsheet, userData);

        // Объект с настройками и сообщениями из соответствующего листа таблицы
        let messagesAndSettings = ResBotSettingsAndMessages(spreadsheet);

        // Авторизован ли пользователь?
        if (!currentUser.userIsInSheet()) {

            // сообщаем о необходимости авторизации
            currentUser.sendMessage(messagesAndSettings.getBySlug("/authorizationOffer"));

            // Уведомляем ответственного о попытке
            let authAdmin = ResBotUser(spreadsheet, {id: messagesAndSettings.getBySlug("auth_admin_chat_id")});
            authAdmin.sendMessage(messagesAndSettings.getBySlug("/newUser") + currentUser.getStringUserData());

        } else {

            // проверяем команду от пользователя
            let commandText = update.callback_query ? update.callback_query.data : "";

            switch (commandText) {
                // Если резолюции
                case "resolutions":

                    // Получение региона, к которому относится пользователь
                    let regions = ResBotRegions(spreadsheet);
                    let userRegion = regions.getRegionByUser(currentUser.getUserId());

                    if (userRegion) {

                        // получаем резолюции по региону и отправляем их пользователю
                        let resolutionsObj = ResBotResolutions(spreadsheet);
                        let resolutionsText = resolutionsObj.getResolutionByRegion(userRegion);

                        if (resolutionsText) {
                            currentUser.sendMessage(userRegion + "\n" + resolutionsText);
                        } else {
                            currentUser.sendMessage(userRegion + "\n" + messagesAndSettings.getBySlug("/noResolutions"));
                        }
                    }

                    break;

                // Если контакты возвращаем контакты
                case "contacts":

                    currentUser.sendMessage(messagesAndSettings.getBySlug("/contacts"));
                    break;

                // При прочих случаях отправляем первично сообщение пользователю с кнопками возможгых действий
                default:

                    currentUser.sendMessage(messagesAndSettings.getBySlug(
                        "/defaultCommands"),
                        {"inline_keyboard": [
                                [{ "text": "Контакты", 'callback_data': 'contacts' }],
                                [{ "text": "Резолюции", 'callback_data': 'resolutions' }]
                            ]}
                    );

            }
        }
    }
}

/**
 * Поиск элемента в переданном диапазоне яцеек из google таблицы
 * @param {Object} googleRange      - Объект с диапазоном ячеек google таблицы (двумерный)
 * @param {String} searchedElem     - Значение с которым сравиваем перебираемые элементы
 * @param {Number} keyColumnNumb    - Номер столбца со значением для сравнения с переданным
 * @param {Number} valueColumnNumb  - Номер столбца со значением, которое необходимо вернуть
 * @returns {null|*}
 */
function searchElemInRange(googleRange, searchedElem, keyColumnNumb, valueColumnNumb){

    // Перебираемый элемент
    let currentElement;

    if(
        googleRange &&
        searchedElem &&
        googleRange.length > 0
    ){

        keyColumnNumb = +keyColumnNumb;
        valueColumnNumb = +valueColumnNumb;

        for(let i = 0; i < googleRange.length; i++){

            currentElement = String(googleRange[i][keyColumnNumb]);

            if(currentElement && ~currentElement.indexOf(searchedElem)){
                return googleRange[i][valueColumnNumb];
            }
        }
    }

    return null;
}

/**
 * Объект работы с пользователем
 * @param googleSpreadsheet - Объект гугл таблицы
 * @param userData          - Данные пользователя
 */
function ResBotUser(googleSpreadsheet, userData){

    const ResBotAuth = {

        sheetName:          "Авторизация",
        googleSpreadsheet:  undefined,
        userId:             undefined,
        userFirst_name:     undefined,
        userLast_name:      undefined,

        /**
         * Присутствует ли пользователь в таблице
         * @returns {boolean}
         */
        userIsInSheet: function (){

            // Объект таблицы существует как и метод получения листа в нём так же передан id чата пользователя
            if(this.googleSpreadsheet && this.googleSpreadsheet.hasOwnProperty("getSheetByName") && this.userId){
                let sheet = this.googleSpreadsheet.getSheetByName(this.sheetName);
                let users = sheet.getRange(1, 2, sheet.getLastRow()).getValues();

                return Boolean(searchElemInRange(users, this.userId, 0, 0));
            }

            return false;
        },

        /**
         * Получение id пользователя
         * @returns {String}
         */
        getUserId: function (){
            return this.userId;
        },

        /**
         * Получение данных пользователя в виде строки
         * @returns {String}
         */
        getStringUserData: function (){

            if(this.userFirst_name || this.userLast_name || this.userId){

                return "Пользователь: " + (this.userFirst_name ? this.userFirst_name + " " : "") +
                    (this.userLast_name ? this.userLast_name + "\n" : "") +
                    "Id пользователя: " + (this.userId ? this.userId : " отсутствует");

            }else{
                return "Данные пользователя отсутствуют";
            }
        },

        /**
         * Отправка пользователю сообщения
         * @param {String} message  - Текст сообщения
         * @param {Object} keyboard - Набор кнопок (опцонально)
         */
        sendMessage: function (message, keyboard = undefined){

            if(this.userId) {

                //формируем с ним сообщение
                let payload = {
                    'method': 'sendMessage',
                    'chat_id': this.userId,
                    'text': String(message),
                    'parse_mode': 'HTML'
                }

                if(keyboard && keyboard.hasOwnProperty("inline_keyboard")){
                    payload.reply_markup = JSON.stringify(keyboard);
                }

                let data = {
                    "method": "post",
                    "payload": payload
                }

                // и отправляем его боту
                UrlFetchApp.fetch('https://api.telegram.org/bot' + ApiBotToken + '/', data);
            }
        }
    };

    ResBotAuth.googleSpreadsheet = googleSpreadsheet;
    ResBotAuth.userId =             String(userData.id);
    ResBotAuth.userFirst_name =     String(userData.first_name);
    ResBotAuth.userLast_name =      String(userData.last_name);

    return ResBotAuth;

}

/**
 * Объект со списком регионов и соответствующих пользователей
 * @param googleSpreadsheet - Объект гугл таблицы
 */
function ResBotRegions(googleSpreadsheet){

    let ResBotRegions = {
        sheetName:          "Авторизация",
        googleSpreadsheet:  undefined,

        /**
         * Получения региона, соответствующего пользователю
         * @param {String} userId
         * @returns {null|*}
         */
        getRegionByUser: function (userId){

            let sheet = this.googleSpreadsheet.getSheetByName(this.sheetName);
            let rows = sheet.getRange(1, 1, sheet.getLastRow(), 2).getValues();

            return searchElemInRange(rows, userId, 1, 0);
        }
    };

    ResBotRegions.googleSpreadsheet = googleSpreadsheet;

    return ResBotRegions;

}

/**
 * Объект со списком (текстовым сообщением) резолюций
 * @param googleSpreadsheet - Объект гугл таблицы
 */
function ResBotResolutions(googleSpreadsheet){

    let ResBotResolutions = {

        sheetName: "Бот",
        googleSpreadsheet: undefined,

        /**
         * Получение резолюций, соответствующих субъекту
         * @param region
         * @returns {null|*}
         */
        getResolutionByRegion: function (region){

            let sheet = this.googleSpreadsheet.getSheetByName(this.sheetName);
            let resolutions = sheet.getRange(1, 1, sheet.getLastRow(), 4).getValues();

            return searchElemInRange(resolutions, region, 0, 3);

        }
    };

    ResBotResolutions.googleSpreadsheet = googleSpreadsheet;

    return ResBotResolutions;

}

/**
 * Получение сообщения с контактами
 * @param googleSpreadsheet
 */
function ResBotSettingsAndMessages(googleSpreadsheet){

    const ResBotSettingsAndMessages = {

        sheetName: "Настройки и сообщения",
        googleSpreadsheet: undefined,
        messages: {},

        /**
         * Заполнение массива сообщений и настроек из таблицы
         */
        getFromSheet: function (){
            if(this.googleSpreadsheet && this.googleSpreadsheet.hasOwnProperty("getSheetByName")){
                let sheet = this.googleSpreadsheet.getSheetByName(this.sheetName);
                let rows = sheet.getRange(1, 1, sheet.getLastRow(), 2).getValues();

                if(rows.length > 0){
                    for(let i = 0; i < rows.length; i++){
                        if(rows[i][0]){
                            this.messages[rows[i][0]] = rows[i][1];
                        }
                    }
                }
            }
        },

        /**
         * Получение настройки или сообщения из таблицы
         * @param {String}  slug    - Слаг настройки или сообщения
         * @returns {string}
         */
        getBySlug: function (slug){

            if(slug && this.messages.hasOwnProperty(slug) && this.messages[slug]){
                return String(this.messages[slug]);
            }

            return "";
        }
    };

    ResBotSettingsAndMessages.googleSpreadsheet = googleSpreadsheet;
    ResBotSettingsAndMessages.getFromSheet();

    return ResBotSettingsAndMessages;
}

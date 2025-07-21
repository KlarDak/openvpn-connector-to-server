# Серверная часть Telegram-бота для выдачи конфигов сервера

## Требования:
Следущие требования должны быть соблюдены для запуска системы:

1. NodeJS версии **выше 16**
2. Дополнения **jsonwebtoken**, **dotenv**. 
3. Установленный **express**.
4. Режим выполнения: **module**.

## Установка обязательных переменных

Модуль работает с файлом ``.env``, создающим всё необходимое окружение переменных. 

Список переменных:

```text
SERVER_ADDRESS=[ IP-адрес сервера ]
SERVER_PORT=[ Порт сервера ]
SECRET_TOKEN=[ Секретный ключ ]
CONFIG_FOLDER=[ Абсолютный путь к папке с конфигами пользователей ]
SCRIPT_FILE=[ Абсолютный путь к скрипту запуска ]
DEFAULT_NAME_V1=[ Дефолтное имя файла конфига (для отправки пользователю) ]
ALLOWED_ACCESS=[ Разрешённые IP-адреса для доступа к серверу (перечисляются через запятую) ]
```
Все вышеперечисленные переменные окружения должны быть установлены и доступны.

## Способ запуска

Выполнить в консоли следующее:

```bash
node server.js
```

При удачном запуске, сервер вернёт ответ:

```bash
The server has been started!
```

## Доступные методы

*Все методы актуальны на версию ``v1.1``*

```bash 
GET /config/:token
```

**Параметр:** ``token`` - JWT-токен.

```bash
POST /config
```
**В теле обязательный параметр:** ``token`` - JWT-токен.

```bash
DELETE /config/:token
```
**Параметр:** ``token`` - JWT-токен.

*Метод актуален на подверсию ``v1.1.1``*
```bash
GET /config/download/:expToken
```
**Параметр:** ``expToken`` - временный JWT-токен для скачивания файла.

## Вспомогательные функции ( module )
Следующие функции находятся в папке _module_ и задействуются в работе основного скрипта.

## configFiles.js
Отвечает за генерацию, получение, обновление и удаление конфиг-файла.

#### createConfig
Генерирует конфиг-файл. **Асинхронная функция.**

Синтаксис:
```js
/**
 * @param UUID - уникальный UUID пользователя
 * @return JSON - возвращает JSON в любом случае 
 */

return createConfig(uuid);
```

Если выполнено удачно: 
```json 
{code: 200, status: "Success", expToken: "xxxxxxx-xxxx-xxxx-xxxx" }
```

#### getConfig
Получение конфиг-файла, если он уже был создан. **Асинхронная функция.**
```js
/** 
 *  @param UUID - уникальный UUID пользователя
 *  @return JSON - возвращает JSON в любом случае
 */

 return getConfig(uuid);
```

Если выполнено успешно:
```json
{code: 200, status: "Success", expToken: "xxxxxxx-xxxx-xxxx-xxxx" }
```

#### deleteConfig
Удаляет конфиг-файл с сервера с полным удалением всех связанных ключей. **Асинхронная функция.**
```js
/**
 * @param UUID - уникальный UUID пользователя
 * @return JSON - возвращает JSON в любом случае
 */

return deleteConfig(uuid)
```

Если выполнено успешно:
```json
{code: 200, status: "Success"}
```

### Пока не добавленные функции
Следующие функции будут добавлены в API сервера позже.

#### updateConfig
Обновляет конфиг-файл. Взаимодействует исключительно с файлом ``*.ovpn``, не затрагивая уже созданные ключи пользователя:
```js
/**
 * @param UUID - уникальный UUID пользователя
 * @return JSON - возвращает JSON в любом случае
 */

return updateConfig(uuid)
```

_Точный возврат пока неизвестен._

#### recreateConfig
Пересоздаёт конфиг-файл пользователя и обновляет уже существующие ключи.
```js
/**
 * @param UUID - уникальный UUID пользователя
 * @return JSON - возвращает JSON в любом случае
 */

return recreateConfig(uuid)
```
_Точный возврат пока неизвестен._

## JSONWorker.js

Отвечает за структурирование и генерацию ответа в виде JSON.

#### returnJSON

Генерирует структурированный ответ в виде JSON.

```js
/**
 * @param json_array - JSON-массив данных
 * @return JSON
 */

return returnJSON(json_array);
```

Возвращает JSON-массив. 

**Обязательные параметры входного массива:**

1. ``code`` - HTTP-код ответа на запрос.

2. ~~``type`` - тип ответа~~. (не рекомендуется с версии ``v1.1.1``).

    _На момент версии ``v1.1`` доступны следующие типы: ``data``, ``error``, ``message``._

3. ``status`` - текст сообщения.

**Пример:** (актуален на версию ``v1.1``)
```js 
...
const json_array = {code: 200, type: "data" message: "Success", data: {path: "newfile.ovpn"}};

return returnJSON(json_array);
...
```
**Результат:**
```json
{code: 200, data: "Success", path: "newfile.ovpn" }
```

*На момент версии ``v1.1.1`` изменён синтаксис:*
- Убран параметр ``type``.
- Вместо ``message`` - поле ``status``.
- Вместо ``path`` - поле ``expToken``.

**Синтаксис на данную версию:**
```js 
...
const json_array = {code: 200, status: "Success", data: {expToken: "{expired_token}"}};

return returnJSON(json_array);
...
```

## userToken.js
Работает с токеном, получаемым от бота или пользователя.


#### getUUID
Получает уникальный UUID пользователя из полученного токена.

```js
/**
 * @param token: string - токен от сервера
 * @return JSON
 * 
 */
return getUUID(token);
```

В случае удачи, возвращает следующий JSON:

```json
{ code: 200, status: "Success", userUuid: "xxxxxxx-xxxx-xxxx-xxxx" };
```

#### decryptToken
Расшифровывает токен. Требуется секретный код.

```js
/**
 * @param token: string - уникальный токен пользователя
 * @param secret: string - секретный ключ клиент/сервера
 * @return JSON - в случае удачи
 * @return Boolean - в случае неудачи
 */
return decryptToken(token, secret);
```

В случае удачи, на версию ``v1.1`` возвращает следующий JSON:
```json
{userUuid: "xxxxxxx-xxxx-xxxx-xxxx"}
```

#### validUUID
Проверка валидности UUID пользователя.

```js
/**
 * @param uuid: string - уникальный UUID пользователя
 * @return Boolean
 */
return validUUID(uuid);
```

#### createExpToken
Создание одноразового временного токена с использованием UUID и временного промежутка.

*Доступно глобально в версии ``v1.1``, введено в ``v1.1.1``*

```js
/**
* @param uuid: string - уникальный UUID пользователя
* @param time: integer - время действия токена (в секундах)
* @param secret: string - секретный ключ клиент/сервера
* @return string
*/

return createExpToken("xxxxxxx-xxxx-xxxx-xxxx", 60, "xxxxYYYYZZZZ");
```

## secretGetter.js
Функции для получения доступа к секретным токенам. 

Все функции возвращают ``string``.

```js
// Возвращает секретный токен
return getSecretToken(); 

// Возвращает путь к папке с конфиг-файлами
return getConfigFolder();

// Возвращает путь к файлу-генератору конфиг-файлов и ключей
return getScriptFile();

// Возвращает дефолтное имя файла конфига
return getDefaultNameV1();

// Возвращает IP-адрес сервера
return getServerAddress();

// Возвращает порт сервера
return getSeverPort();
```

## Виды ошибок
Следующие варианты ошибок возможный при работе с сервером.

```json
// Ошибка декодирования токена
{code: 400, status: "Undefined auth-token"}

// Неправильный UUID
{code: 400, status: "Invalid UUID-token"}

// Ошибка генерации конфиг-файла - уже существует
{code: 409, status: "File was founded and not re-generate"}

// Неизвестная ошибка генерации конфиг-файла
{code: 500, status: "Failed to generate the config-file"}

// Конфиг-файл не был создан
{code: 404, status: "File was not created"}

// Ошибка с получением констант из файла окружения
{code: 401, status: "Error with config paths"} 

// Файл не найден 
{code: 404, status: "File not found"}

// Неизвестная ошибка при удалении конфиг-файла и его ключей
{code: 500, status: "Some error has been detected with drop this file. Check logs"}

// Доступ к серверу запрещён по IP-адресу
{code: 403, status: "Access not allowed!"}

// Скачивание файла недоступно на сейчас
{code: 500, status: "Download file is not available now"}

// Временный токен просрочен
{code: 403, status: "This token was expired"}
```

## Уведомления об удачном выполнении функции

```json
// Удачное получение UUID из токена
{code: 200, data: "Success", userUuid: "xxxxxx-xxxx-xxxx-xxxx"}

// Удачное удаление файла
{code: 200, status: "Deleted"}

// Удачное получение или генерация файла
{code: 200, data: "Success", expToken: "xxxxxx-xxxx-xxxx-xxxx"}
```
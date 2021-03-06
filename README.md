# totsystems-test-java
Тестовое задание в компании TOTSystems.

[![Maintainability](https://api.codeclimate.com/v1/badges/f6fb7a41d043c58248cb/maintainability)](https://codeclimate.com/github/popkovandrey/totsystems-test-java/maintainability)

[Preview is here](https://tranquil-refuge-71409.herokuapp.com/)

## Решение

При запуске приложения реализован парсинг 2-х файлов с ценными бумагами и 4-х файлов с историей торгов. Внутреннее хранение данных организовано хэш-таблицей для ценных бумаг (data.securities) и массив с историями торгов (data.history). Выбор хэш-таблицы обусловлен быстрым связыванием по ключу (secid) с таблицей history. Стейт приложения вывел в консоль для ознакомления. 
Реализована возможность выбора столбца и направления для сортировки. А также поле для фильтрации по значению emitent_title и выпадающий список с датами историй торгов (trade_date).
При парсинге файлов history_ только для 82-х записей (из 400) есть ценные бумаги в securities_. Данное упущение можно исправить дозапросом недостающих ценных бумаг по адресу https://iss.moex.com/iss/securities.xml?q=. При нажатие кнопки "Запросить" происходит фильтрация массива history и для записей с отсутствующими ценными бумагами производится асинхронный запрос к ИИС МБ. Учтено то, что некоторые записи в history дублируются для одних и тех же secid (разные даты торгов, разные boardid). В итоге - один запрос для одной ценной бумаги.

## API

Вывод в формате json. Поиск регистронезависим.

* GET /api/securities - все ценные бумаги
* GET /api/securities/aapl - ценные бумаги с вхождением "aapl". При поиске проверяются secid, name, shortname, emitent_title, regnumber.
* PUT /api/securities/aapl?regnumber=123&name=Эпл%20Рус&emitent_titleApple%20Inc - обновление ценной бумаги с secid = aapl. Через параметры доступны поля regnumber, emitent_title, name. Поле name проверяется на совпадение - только кирилица, цифры и знак пробела.
* POST /api/securities?secid=secidtest&shortname=... Добавление новой ценной бумаги. Через параметры устанавливаются параметры secid, shortname, regnumber, name, emitent_title, primary_boardid, is_traded. Все параметры должны быть заполнены. Поле name проверяется как в PUT.  

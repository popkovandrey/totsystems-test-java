# totsystems-test-java

[Preview is here](https://tranquil-refuge-71409.herokuapp.com/)

## Решение

При запуске приложения реализован парсинг 2-х файлов с ценными бумагами и 4-х файлов с историей торгов. Внутреннее хранение данных организовано хэш-таблицей для ценных бумаг (data.securities) и массив с историями торгов (data.history). Выбор хэш-таблицы обусловлен быстрым связыванием по ключу (secid) с таблицей history. Стейт приложения вывел в консоль для ознакомления. 
Реализована возможность выбора столбца и направления для сортировки. А также поле для фильтрации по значению emitent_title и выпадающий список с датами историй торгов (trade_date).
При парсинге файлов history_ для 82-х записей (из 400) есть ценные бумаги в securities_. Данное упущение можно исправить дозапросом недостающих ценных бумаг по адресу https://iss.moex.com/iss/securities.xml?q=. При нажатие кнопки "Запросить" происходит фильтрация массива history и для записей с отсутствующими ценными бумагами производится асинхронный запрос к ИИС МБ. Учтено, что некоторые записи в history дублируются для одних и тех же secid (разные даты торгов, разные boardid). В итоге - один запрос для одной ценной бумаги. 

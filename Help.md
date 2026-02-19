```markdown
# Google Apps Script ORM для Google Sheets

Лёгкая ORM‑библиотека для Google Apps Script (GAS), которая позволяет работать с таблицами Google Sheets через имена столбцов и строк вместо координат. Освобождает от привязки к расположению данных в таблице: даже если столбцы поменяют порядок, код продолжит работать.

## Особенности

* **Именованный доступ** к данным: работайте с колонками по их именам из заголовка.
* **Гибкость структуры**: изменение порядка столбцов не ломает логику скрипта.
* **Интуитивный синтаксис**: простой и понятный API для поиска, чтения и записи данных.
* **Поддержка многострочных заголовков** (опционально). На данный момент 1 или 2 строки заголовка. Удобнее 2.
Если 2 строки заголовка: можно поддерживать несколько таблиц на листе и обращаться к ним по названию таблицы (1 строка в 1 ячейке)
* **Интеграция с GAS**: полностью совместим с экосистемой Google Apps Script.

## Установка

1. Создайте новый проект в [Google Apps Script](https://script.google.com/) или вставте код в существующий проект.
2. Скопируйте код библиотеки из репозитория в ваш проект.
3. Убедитесь, что у скрипта есть доступ к Google Sheets (разрешения запрашиваются при первом запуске).
4. Если выбран способ с отдельной библиотекой - выполните деплой и вставьте код библиотеки в ваш проект, назвав, например orm. Тогда замените обращение к коду с 
`const orm = init(_book.getSheetByName('Arhiv'));
на
`const orm = orm.init(_book.getSheetByName('Arhiv'));

## Инициализация

Используйте функцию `init()` для создания экземпляра ORM:

```javascript
/**
 * Инициализирует ORM для работы с таблицей.
 * @param {GoogleAppsScript.Spreadsheet.Sheet|Object} shOrOptions — Лист или объект с параметрами.
 * @param {number} [nHeaderLines=1] — Количество строк заголовка.
 * @returns {Sheet} Экземпляр класса Sheet для работы с данными.
 */
function init(shOrOptions, nHeaderLines = 2)
```

**Пример инициализации:**

```javascript
const _book = SpreadsheetApp.openById('1_s3_yc......');
const orm = init(_book.getSheetByName('Arhiv'));
```

## Использование

После инициализации вы получаете объект `orm`, через который можно обращаться к данным по именам столбцов.

### Пример функции поиска данных

```javascript
function isInBD(number) {
  const res = orm.guide_main.phonenumber.find(number, false);
  console.log(number);
  console.log(res?.plot);

  return {
    f: res ? true : false,
    plot: res?.plot,
    fio: res?.fio
  };
}
```

### Разбор примера

* `this.orm` — корневой объект ORM.
* `guide_main` — имя таблицы при варианте с 2 строками заголовка.
* `phonenumber` — имя столбца, по которому выполняется поиск.
* `.find(value, exactMatch)` — метод поиска:
  * `value` — искомое значение.
  * `exactMatch` — флаг точного совпадения (`false` — частичное совпадение, `true` — точное).
* Возвращает объект с полями из строки, где найдено совпадение.

## API

### Методы

* **`find(value, exactMatch = true)`** — ищет значение в столбце. Возвращает объект со всеми полями строки или `null`, если не найдено.
* **`getAll()`** — возвращает все строки таблицы в виде массива объектов.
* **`addRow(data)`** — добавляет новую строку. `data` — объект с именами столбцов и значениями.
* **`updateRow(id, data)`** — обновляет строку по идентификатору.

### Свойства

* **`columns`** — список всех имён столбцов в таблице.
* **`rows`** — количество строк данных (без учёта заголовков).

## Требования

* Google Apps Script (встроенный в Google Workspace).
* Доступ к Google Sheets API (автоматически запрашивается при запуске).
* Таблицы с чётко определёнными заголовками (первая строка или несколько строк по параметру `nHeaderLines`).

## Пример полного скрипта

```javascript
// Инициализация ORM
const sheet = init(SpreadsheetApp.getActiveSheet());

// Проверка наличия номера в базе
function checkPhoneInDB(phoneNumber) {
  const result = orm.guide_main.phonenumber.find(phoneNumber, true);
  if (result) {
    return `Найден: ${result.fio}, ${result.plot}`;
  } else {
    return 'Не найден';
  }
}

// Добавление нового контакта
addNewUser(name, phone, plot) {
  const newData = {
    fio: name,
    phonenumber: phone,
    plot: plot
  };
  orm.guide_main.getFreeRow().setValues(newData);
  //или
  //orm.guide_main.addRow(newData); - надо реализовать
}

//или так:
addNewUser(telNamber, nLand, sName, userFN) {
  if (telNamber === undefined) return;
  const newCod = this.getFreeCod();
  const _sKommandTmp = this.cfg.v.hunCom;
  const _sKommand = '....';
  const newData = {
    phonenumber: telNamber,
    cod: newCod,
    plot: nLand,
    fio: sName,
    command: _sKommand,
  }
  Object.assign(newData, {
    registered: this.frmdt,
    who: userFN,
    check: 0,
    del: 0,
    hash: this.hash(newData),
  })
  this.orm.guide_main.getFreeRow().setValues(newData);
  return _sKommand;
};

```

## Вклад в проект

Будем рады вашим пул‑реквестам и отчётам об ошибках!

1. Форкните репозиторий.
2. Создайте фича‑ветку (`git checkout -b feature/AmazingFeature`).
3. Закоммитьте изменения (`git commit -m 'Add some AmazingFeature'`).
4. Запушьте в ветку (`git push origin feature/AmazingFeature`).
5. Откройте пул‑реквест.

## Лицензия

Проект распространяется под лицензией MIT. Подробнее см. в файле [LICENSE](LICENSE).

## Контакты

* Репозиторий: [https://github.com/SNAS24/orm4GS/]
* Автор: [Станислав/Snas]
* Email: [email]
```
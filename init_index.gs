```javascript
/* exported init */
/**
 * Инициализирует ORM для работы с таблицей.
 * @param {GoogleAppsScript.Spreadsheet.Sheet|Object} shOrOptions - Лист или объект с параметрами.
 * @param {number} [nHeaderLines=1] - Кол-во строк заголовка.
 * @returns {Sheet} Экземпляр класса Sheet для работы с данными.
 */
function init(shOrOptions, nHeaderLines = 1) {
  if (shOrOptions && typeof shOrOptions === 'object' && !shOrOptions.getName)
       return initByObj({shGuide: shOrOptions, nHeaderLines})
  return initByPar(shOrOptions, nHeaderLines);
}

/**
 * Инициализирует ORM для работы с таблицей.
 * 
 * @param {GoogleAppsScript.Spreadsheet.Sheet} shGuide - Объект листа Google Таблицы.
 * @param {number} [nHeaderLines=1] - Количество строк, занимаемых заголовком (по умолчанию 1).
 * @returns {Sheet} Экземпляр класса Sheet для работы с данными.
 */
function initByPar(shGuide, nHeaderLines) {
  console.log(`#####__init ORM . Book: ${shGuide.getParent().getName()}. Sheet: ${shGuide.getName()}. nHeaderLines= ${nHeaderLines}`)
  return new Sheet(shGuide, nHeaderLines);
}

/**
 * Инициализация ORM для листа
 * @param {Object} options - Параметры инициализации
 * @param {GoogleAppsScript.Spreadsheet.Sheet} options.shGuide - Целевой лист
 * @param {number} [options.nHeaderLines=1] - Количество строк заголовка
 * @returns {Sheet} Экземпляр класса Sheet для работы с данными.
 */

function initByObj({shGuide, nHeaderLines}) {
  console.log(`#####__init ORM . Book: ${shGuide.getParent().getName()}. Sheet: ${shGuide.getName()}. nHeaderLines= ${nHeaderLines}`)
  return new Sheet(shGuide, nHeaderLines);
}


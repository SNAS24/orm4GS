/* exported Sheet */
/**
*  Class Column - класс для обработки столбцов справочника
*    имеет следующие методы:
* * find({any})
* * findAll({any})
* * searchAll({any})
* * findNot({any})
* * getValues(none)
* @param {string} guide
* @param {number} col
*/
class Column {
  constructor(guide, col) {
    this._guide = guide;
    this._colIndex = col;
    this.headerRows = this._guide._sheet._nHeaderLines;
  }
  /**
  * Ищет первую строчку в таблице полностью соответствующее [===] искомому (type = true)
  * Или похожее [==] соответствие (type = false) 
  * Returns this object: "new Proxy(row, handler)" handle on the required row in the guide
  * @param {any} val
  * @param {boolean} type
  * @returns {Guide.createRow}
  */
  find(val, type = true) {
    const rowIndex = this._guide._sheet._cacheGuide.slice(this.headerRows).findIndex((row) => {
      return type ? row[this._colIndex] === val : row[this._colIndex] == val;
    });
    return rowIndex >= 0 ? this._guide.createRow(rowIndex + this.headerRows) : null; //undefined;
  }
  /**
  *  Ищет все строки в таблице полностью соответствующее искомому
  * Returns array this objects: "new Proxy(row, handler)"
  * @param {any} val
  * @returns {[Guide.createRow,...]}
  */
  findAll(val) {
    return this._guide._sheet._cacheGuide.slice(this.headerRows).reduce((acc, row, index) => {
      row[this._colIndex] === val ? acc.push(this._guide.createRow(index + this.headerRows)) : null;
      return acc;
    }, []);
  }

  /**
  *  Ищет все строки в таблице соответствующее шаблону искомого
  * Returns array this objects: "new Proxy(row, handler)"
  * @param {any} val
  * @returns {[Guide.createRow,...]}
  */
  searchAll(val) {
    const regexp = new RegExp(val, "gi");
    return this._guide._sheet._cacheGuide.slice(this.headerRows).reduce((acc, row, index) => {
      row[this._colIndex].match(regexp) !== null ? acc.push(this._guide.createRow(index + this.headerRows)) : null;
      return acc;
    }, []);
  }

  /**
  *  Ищет все строки в таблице не соответствующее искомому
  * Returns array this objects: "new Proxy(row, handler)"
  * @param {any} val
  * @returns {[Guide.createRow,...]}
  */
  findNot(val) {
    return this._guide._sheet._cacheGuide.slice(this.headerRows).reduce((acc, row, index) => {
      row[this._colIndex] !== val ? acc.push(this._guide.createRow(index + this.headerRows)) : null;
      return acc;
    }, []);
  }
  /**
  * Возвращает массив значений соответствующего столбца в таблице
  * Returns array values
  * @returns {array}
  */
  getValues() {
    return this._guide._sheet._cacheGuide.slice(this.headerRows).reduce((acc, row) => {
      acc.push(row[this._colIndex]);
      return acc;
    }, []);
  }
  /**
  * Возвращает значение соответствующего столбца и строки таблицы для печати
  * Returns array values joining ('\n')
  * @returns {any}
  */
  // toString() {
  //   return this._guide._sheet._cacheGuide.map((item) => item.toString()).join('\n');
  // }
}

/**
*  Class Guide - класс для обработки справочника
*    имеет следующие методы:
* * getFreeRow(none)
* * createRow({number}) - возвращает объект прокси на строку
*/
class Guide {
  /**
  * @param {sheet} sheet
  * @param {number} key
  * @param {number} start
  * @param {number} end
  */
  constructor(sheet, key, start, end) {
    this._sheet = sheet;
    this._key = key;
    this._start = start;
    this._end = end;
    this._columnNames = [];
    this.headerRows = this._sheet._nHeaderLines;
  }
  /**
  * Метод возвращает число - номер следующей не занятой строки в конкретном справочнике 
  * @param {none}
  * @returns {Guide.createRow}
  */
  getFreeRow() {
    const row = this._sheet._cacheGuide.slice(this.headerRows).findIndex((row) => row.slice(this._start, this._end).every(cell => cell == ''));
    if (row == -1) return this.createRow(this._sheet._cacheGuide.length + 1);
    if (row == -1) throw new Error('Ошибка поиска свободной строки');
    return this.createRow(row + this.headerRows);
  };

  /**
  * Метод возвращает число - номер добавленной в начало строки в конкретном справочнике 
  * @param {int} rows
  * @returns {Guide.createRow}
  */
  insertAndGetRows(rows = 1) {
    this._sheet._shGuide.insertRows(this.headerRows + 1, rows);
    const row = 0;
    return this.createRow(row + this.headerRows);
  };


  /**
  * Метод возвращает объект row: new Proxy(row, handler) - добавленной в начало строки в конкретном справочнике 
  * @param {int} rows
  * @returns {Guide.createRow}
  */
  appendAndGetRows(rows = 1) {
    const row = this._sheet._cacheGuide.length; //this._end;
    const sizeRow = this._sheet._cacheGuide[0].length;
    this._sheet._shGuide.insertRowAfter(row);
    // const sizeRow = this._end - this._start; //this._guide._end - this._guide._start;
    let newData = new Array(sizeRow).fill('');
    newData[0] = row - this.headerRows + 1;
    this._sheet._cacheGuide.splice(row + 1, 0, newData);
    return this.createRow(row);
  };

  /**
  * Метод возвращает объект прокси - номер первой строки в конкретном справочнике 
  * @param {none}
  * @returns {Guide.createRow}
  */
  getFierstRows() {
    const row = 0;
    return this.createRow(row + this.headerRows);
  };

  /**
  * Возвращает объект row: new Proxy(row, handler), содержащий: 
  * <pre>
  * </pre>
  * @param {number} rowIndex - chose one of following:
  * * createRow(1);
  * * createRow(3);
  * @returns {Guide.createRow}
  */
  createRow(rowIndex) {
    const guide = this;
    const row = {
      _guide: guide,
      _rowIndex: rowIndex,

      /**
      * @param {any} values
      * @returns {boolean}
      */
      setValues(values) {
        if ((typeof (values) != "object") || values === null) {
          throw new Error('Invalid argument: only arrays and objects are supported for now');
        }
        const sizeRow = this._guide._end - this._guide._start;
        let newData = [];
        if (Array.isArray(values)) {
          newData = values;
        } else {
          newData = new Array(sizeRow).fill('');
          for (let name of this._guide._columnNames) {
            const value = values.hasOwnProperty(name) ? values[name] : this._guide._sheet._cacheGuide[this._rowIndex][this._guide[name]._colIndex];
            newData[this._guide[name]._colIndex - this._guide._start] = value;
          }
        }
        if (newData.length > sizeRow) {
          console.error(`Invalid array length: ${sizeRow} but array size: ${newData.length}`);
          throw new Error('Invalid argument');
        }
        // const isDate = obj => Object.prototype.toString.call(obj) === '[object Date]'
        // newData.forEach(cell => console.log(`!!!!: ${typeof (cell)}   ${cell}   isDate: ${isDate(cell)}`));
        if (!newData.every(cell => typeof (cell) == 'number' || typeof (cell) == 'string' || typeof (cell) == 'object' || cell instanceof Date || cell == undefined)) {
              // || cell instanceof String || cell instanceof Number)) {
          const arrTmp = newData.forEach(cell => typeof (cell));
          throw new Error(`Invalid argument: values should only contain strings and numbers: ${arrTmp}`);
        }
        this._guide._sheet._cacheGuide[this._rowIndex].splice(this._guide._start, newData.length, ...newData);
        this._guide._sheet._shGuide.getRange(this._rowIndex + 1, this._guide._start + 1, 1, newData.length).setValues([newData]);
      },
      /**
      * Возвращает значение соответствующего столбца и строки таблицы для печати
      * Returns array values joining ('\n')
      * @returns {any}
      */
      [Symbol.toStringTag]: `Объект row, номер строки: ${this._rowIndex}: \n`,

      toString() {
        return `Объект row, номер строки: ${this._rowIndex}`;
      },

      // toString() {
      //   const entries = Object.entries(this)
      //     .filter(([key]) => key !== Symbol.toStringTag)
      //     .map(([key, value]) => `${key}: ${value}`);

      //   return `[${this[Symbol.toStringTag]} | ${entries.join(', ')}]`;
      // },


      valueOf() {
        return this._rowIndex;
      },

      toStr() {
        return `Объект row, номер строки: ${this._rowIndex}`;
      },

      toDebugString() {
        return `${this[Symbol.toStringTag]} {\n` +
          Object.entries(this)
            .filter(([key]) => key !== Symbol.toStringTag)
            .map(([key, value]) => `  ${key}: ${value}`)
            .join('\n') +
          '\n}';
      },
    };
    const handler = {
      get: function (target, name, receiver) {
        const value = target[name];
        if (value instanceof Function) {
          return function (...args) {
            return value.apply(target, args);
          };
        };
        return target._guide._sheet._cacheGuide[target._rowIndex][target?._guide[name]?._colIndex];
      },
      set: function (target, name, value) {
        target._guide._sheet._cacheGuide[target._rowIndex][target._guide[name]._colIndex] = value;
        target._guide._sheet._shGuide.getRange(target._rowIndex + 1, target._guide[name]._colIndex + 1).setValue(value);
        return true;
      }
    };
    return new Proxy(row, handler);
  }
}
/**
*  Class Sheet - класс для обработки листа содержащего справочники
*    не имеет методы!
*    создает свойства листа:
* * this._cacheGuide
* * guides
* * this[guideName][key]
* * this[guideName]._columnNames
*/
class Sheet {
  /**
   * @param {any} shGuide
   * @param {number} nHeaderLines
   */
  constructor(shGuide, nHeaderLines = 2) {
    this._shGuide = shGuide;
    this._nHeaderLines = nHeaderLines;

    this._cacheGuide = this._shGuide.getDataRange().getValues();
    let lastGuideName = null;
    let guides = {};
    if (nHeaderLines < 2) {
      const nSheet = this._shGuide.getName();
      guides[nSheet] = { key: this.cellToName(nSheet), colIndex: 0, colEnd: shGuide.getMaxColumns(), }
    } else {
      guides = this._cacheGuide[0].reduce((acc, cell, colIndex) => {
        if (cell !== "") {
          const key = this.cellToName(cell);
          acc[key] = { key, colIndex };
          lastGuideName = key;
        } else {
          acc[lastGuideName].colEnd = colIndex;
        }
        return acc;
      }, {});
    };


    // this.guideNames = new Set(); //// !!!!!!!
    // this.h = []; ///////////////// !!!!!!!!!!!
    for (let name of Object.keys(guides)) {
      this[name] = new Guide(this, name, guides[name].colIndex, guides[name].colEnd);
      // this.guideNames.add(name); ////// !!!!!!!!!!!!!!
      // this.h.push(name); ///////////////// !!!!!!!!!!!
    }
    this._cacheGuide[this._nHeaderLines - 1].forEach((cell, colIndex) => {
      if (cell !== "") {
        const key = this.cellToName(cell);
        const guideName = Object.keys(guides).find((name) => {
          return guides[name].colIndex <= colIndex && colIndex <= guides[name].colEnd;
        });
        this[guideName][key] = new Column(this[guideName], colIndex);
        this[guideName]._columnNames.push(key);
      }
    });
  }
  /**
  * Set name to Lower Case
  * @param {string} cell
  * @returns {string}
  */
  cellToName(cell) { return String(cell).trim().toLowerCase(); }
}






/**
 * @typedef {{
 *  __col: number;
 *  __row: number;
 * }} Column.Item
 */

/**
 * @typedef { ParamInit.Item & { __val: string} } ParamInit.Item.String
 */

/**
 * @typedef { ParamInit.Item & { __val: number } } ParamInit.Item.Number
 */

/**
 * @typedef { ParamInit.Item & { __val: Date } } ParamInit.Item.Date
 */

/**
 * @typedef { ParamInit.Item & { __val: unknown } } ParamInit.Item.Unknown
 */

/**
 * @typedef {{
 *  key: string;
 *  __col: string;
 *  columnIndex: number;
 * }} Column
 */

/**
 * @typedef {Object.<string, ParamInit.Item & { __val: string}>} ParamInit.CollectionItem
 */

/**
 * @typedef {{
 *  collection: Sheet.CollectionItem[];
 *  headers: Sheet.CollectionHeader[];
 * }} Sheet.Collection
 */

/**
 * @typedef {{
 *  'hash': ParamInit.Item.String;
 *  'цель': ParamInit.Item.String;
 * }} ParamInit.LogItem
 */

/**
 * @typedef {{
 *  headers: ParamInit.CollectionHeader[];
 *  collection: ParamInit.LogItem[];
 * }} ParamInit.Log
 */

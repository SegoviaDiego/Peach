export const products = {
  collection: "Product",
  // actions
  handleChange: "HANDLE_PRODUCT_CHANGE",
  removeFromInputs: "REMOVE_FROM_PRODUCT_INPUTS",
  clearInputs: "CLEAR_PRODUCT_INPUTS",
  filter: "FILTER_CHANGE",
  buttons: "NAVIGATE_BUTTONS",
  create: "CREATE_PRODUCT",
  delete: "DELETE_PRODUCT",
  modify: "MODIFY_PRODUCT",
  inStock: "INCREASE_STOCK",
  outStock: "DECREASE_STOCK",
  load: "LOAD_PRODUCTS",
  syncToSystel: "SYNC_TO_SYSTEL",
  startRealTime: "START_LOADING_PRODUCTS_IN_REAL_TIME",
  stopRealTime: "STOP_LOADING_PRODUCTS_IN_REAL_TIME",
  ping: "PRODUCT_PING",
  // mutations
  startLoading: "START_LOADING",
  stopLoading: "STOP_LOADING",
  showSpinner: "SHOW_SPINNER",
  hideSpinner: "HIDE_SPINNER",
  // Routes
  routes: {
    default: 1,
    more: 2,
    createItem: 3,
    deleteItems: 4,
    editItems: 5,
    inStock: 6,
    outStock: 7
  }
};

export const log = {
  // general
  collection: "Log",
  // Logs
  inStock: "Log_Ingreso",
  outStock: "Log_Egreso",
  movLog: "Log_Mov",
  // actions
  loadIngreso: "Log_Ingreso",
  loadEgreso: "Log_Egreso",
  loadMov: "Log_Mov",
  loadMovByRange: "Load_Mov_By_range",
  createMov: "create_Mov",
  filter: "FILTER_CHANGE",
  setDate: "SET_LOGS_DATE",
  setType: "SET_LOGS_TYPE",
  // mutations
  startLoading: "START_LOADING",
  stopLoading: "STOP_LOADING",
  showSpinner: "SHOW_SPINNER",
  hideSpinner: "HIDE_SPINNER"
};

export const totals = {
  // general
  collection: "Total",
  // actions
  load: "LOAD_TOTALS",
  filter: "FILTER_CHANGE",
  setDate: "SET_TOTALS_DATE",
  setCierreIndex: "SET_CIERRE_INDEX",
  totalIndex: "TOTAL_INDEX",
  // mutations
  startLoading: "START_LOADING",
  stopLoading: "STOP_LOADING",
  showSpinner: "SHOW_SPINNER",
  hideSpinner: "HIDE_SPINNER"
};

export const sell = {
  // general
  collection: "Sell",
  // Logs
  log: "Log_Sell",
  // actions
  load: "LOAD_SELL",
  saveSell: "SAVE_SELL",
  handleChange: "HANDLE_SELL_CHANGE",
  removeFromSell: "REMOVE_FROM_SELL",
  clearSells: "CLEAR_SELLS",
  create: "CREATE_SELL",
  filter: "FILTER_CHANGE",
  setDate: "SET_LOGS_DATE",
  // mutations
  startLoading: "START_LOADING",
  stopLoading: "STOP_LOADING"
};

export const settings = {
  // actions
  loadPreferences: "LOAD_PREFERENCES",
  savePreferences: "SAVE_PREFERENCES",
  loadDatabase: "LOAD_DATABASE",
  saveDatabase: "SAVE_DATABASE",
  loadUsers: "LOAD_Users",
  saveUsers: "SAVE_Users",
  // mutations
  startLoading: "START_LOADING",
  stopLoading: "STOP_LOADING"
};

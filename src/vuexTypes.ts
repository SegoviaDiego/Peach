export const products = {
  collection: "Product",
  // actions
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



export const AcceptedFileTypeXlsx = { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] };
export const AcceptedFileTypeCsv = { 'text/csv': ['.csv'] };
export const AlarmAcceptedFileTypes = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/bmp': ['.bmp'],
  'image/png': ['.png'],
  'text/plain': ['.txt'],
  'application/pdf': ['.pdf'],
  'application/vnd.ms-excel': ['.xls'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'image/tiff': ['.tiff'],
  ...AcceptedFileTypeXlsx,
};
export const DefaultMaxFileSize = 200_000_000; // 200 Mb
export const DefaultMaxFileSizeCSV = 2_097_152; // 2 Mb
export const MaxPidsDataFileSizeCSV = 10_485_760; // 10 Mb

export const ONE_MIN_IN_MS = 60_000;
export const ONE_SECOND_MS = 1000;
export const TEN_SECOND_MS = 10_000;

export const TIME_FORMAT_24 = 'H:mm';

export const TIME_INTERVAL_15 = 15;

export const DEFAULT_LAG_MINUTES = 3;


export const defaultDbData = {
  dbName: '',
  host: '0.0.0.0',
  port: null,
  dbUser: '',
  dbPassword: '',
};

export const defaultDLDbData = {
  dlPlant: '',
  dlUnit: '',
  dbName: '',
  host: '0.0.0.0',
  port: null,
  dbUser: '',
  dbPassword: '',
  lag: DEFAULT_LAG_MINUTES,
};

export const defaultSMTPDbData = {
  host: '0.0.0.0',
  port: null,
  emailsFrom: '',
  emailsTo: '',
};

export const certaintySwitcherOptions = [
  { label: 'TRUE', value: true },
  { label: 'FALSE', value: false },
];

export const scatterDataPeriodLimit = 10;
export const scatterConditionsLimit = 10;

export const scatterChartAnalysisKey = (id: number | string) => `scatterChartAnalysis_${id}`;

export const anomalyRefOptions = {
  stringRefs: ['branches', 'models', 'powerPlants', 'reasons', 'units', 'certainty'],
  withStartCaseLabel: ['status', 'priority'],
};

export const APP_WRAPPER_ID = 'AppWrapper';

export enum AppWrapperClasses {
  ADD = 'add',
  REMOVE = 'remove',
}

export const STATUS_CODE = {
  CONFLICT: 409,
};

export const legendColors = [
  '#232a35',
  '#0bb4ff',
  '#e60049',
  '#e6d800',
  '#50e991',
  '#9b19f5',
  '#ffa300',
  '#dc0ab4',
  '#b3d4ff',
  '#00bfa0',
  '#ff6b6b',
  '#9b9b9b',
  '#00bcd4',
  '#ffdc6b',
  '#b65bff',
  '#795548',
  '#455a64',
  '#ffb997',
  '#8bc34a',
  '#ef6bff',
  '#2196f3',
  '#d9c45c',
  '#6bfff3',
];

export const allValue = 'All';

export enum PageConstantsNew {
  STANDARD = 'Standard',
  MODELS = 'Models',
  MODEL_STATE_LIST = 'ModelStateList',
  NOT_CONFIRMED_ALARMS = 'notConfirmedAlarms',
  CONFIRMED_ALARMS = 'confirmedAlarms',
  CONFIRMED_PREVIEW_ALARMS = 'confirmedPreviewAlarms',
  POWER_PLANTS_LIST = 'powerPlantsList',
  PIDS_CATALOG_LIST = 'pidsCatalogList',
  SIMILAR_CASES = 'similarCases',
  SIMILAR_CASES_DICTIONARY = 'similarCasesDictionary',
}


export const PIDS_CATALOG_PAGE_ID = 'pids';

export const TABLE_FILTERS = 'tableFilters';
export const TABLE_SORT_DATA = 'tableSortData';
export const MAIN_APP_MENU_STATE = 'main-app-menu-state';

export enum ReportSectionNames {
  DETAILS = 'Details',
  CAUSE = 'Cause',
  RECOMMENDATIONS = 'Recommendations',
  TRENDS = 'Trends',
  CONFIRMATION = 'Confirmation',
  APPROVAL = 'Approval',
}

export const STATIC_URLS = {
  baseModelTemplate: 'static-files/base-model-template',
  pidHistoricalDataTemplate: 'static-files/pid-historical-data-template',
};

export const fileLoadErrors = {
  tooManyFiles: 'Too many files',
};

export const fileErrorTitles = {
  tooManyFiles: 'Please upload up to 5 files at a time',
};

export const USER_SETTINGS_NAV_LINK = '/account-settings';

export const PAGINATION_DEFAULT_PARAMS = { take: 10000 };

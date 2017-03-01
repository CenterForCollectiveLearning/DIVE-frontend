import {
  CLEAR_VISUALIZATION,
  REQUEST_VISUALIZATION_DATA,
  RECEIVE_VISUALIZATION_DATA,
  REQUEST_CREATE_EXPORTED_SPEC,
  RECEIVE_CREATED_EXPORTED_SPEC,
  REQUEST_CREATE_SAVED_SPEC,
  RECEIVE_CREATED_SAVED_SPEC,
  SELECT_SINGLE_VISUALIZATION_VISUALIZATION_TYPE,
  SELECT_SINGLE_VISUALIZATION_SORT_FIELD,
  SELECT_SINGLE_VISUALIZATION_SORT_ORDER,
  SELECT_VISUALIZATION_DATA_CONFIG,
  SELECT_VISUALIZATION_DISPLAY_CONFIG,
  SET_SHARE_WINDOW,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const SUBSET_OPTIONS = [
  {
    value: 50,
    label: '50'
  },
  {
    value: 100,
    label: '100'
  },
  {
    value: 200,
    label: '200'
  },
  {
    value: 'all',
    label: 'All'
  }
];

const LEGEND_POSITION_OPTIONS = [
  {
    value:'top',
    label:'Yes'
  },
  {
    value:'none',
    label:'No'
  }
];

const SCALE_OPTIONS = [
  {
    value:'mirrorLog',
    label:'Logarithmic'
  },
  {
    value: 'linear',
    label: 'Linear'
  }
];

const baseState = {
  tableData: [],
  visualizationData: [],
  bins: [],
  sortFields: [],
  sortOrders: [],
  spec: {},
  sampleSize: null,
  subset: null,
  visualizationType: null,
  exported: false,
  exportedSpecId: null,
  shareWindow: null,
  isExporting: false,
  isSaving: false,
  isFetching: false,
  lastUpdated: null,
  configOptions: {
    'legendPosition': LEGEND_POSITION_OPTIONS,
    'scaleType': SCALE_OPTIONS,
    'subset': SUBSET_OPTIONS
  },
  config: {
    display: {
      hScaleType: 'linear',
      legendPosition: 'none',
      vScaleType: 'linear',
    },
    data: {
      subset: null
    }
  }
}

export default function visualization(state = baseState, action) {
  const SORT_ORDERS = [
    {
      id: 'asc',
      name: 'Ascending',
      iconName: 'fa fa-rotate-270 fa-sort-amount-asc',
      selected: true
    },
    {
      id: 'desc',
      name: 'Descending',
      iconName: 'fa fa-rotate-270 fa-sort-amount-desc',
      selected: false
    }
  ];

  switch (action.type) {
    case CLEAR_VISUALIZATION:
      return baseState;

    case REQUEST_VISUALIZATION_DATA:
      return { ...state, isFetching: true };

    case RECEIVE_VISUALIZATION_DATA:
      const headers = action.visualizationData[0].filter((header) =>
        (typeof header === 'string' || header instanceof String)
      );

      const SORT_FIELDS = headers.map((field, index) => {
        var selected = false;
        if (index == 0)
          selected = true;
        return new Object({
          id: index,
          name: field,
          selected: selected
        })
      });

      let config;
      if (action.subset) {
        config = { ...state.config, data: { ...state.config.data, subset: action.subset }};
      }

      return {
        ...state,
        config: config,
        exported: action.exported,
        exportedSpecId: action.exportedSpecId,
        spec: action.spec,
        bins: action.bins,
        tableData: action.tableData,
        visualizationData: action.visualizationData,
        subset: action.subset,
        sampleSize: action.sampleSize,
        sortFields: SORT_FIELDS,
        sortOrders: SORT_ORDERS,
        lastUpdated: Date.now(),
        isFetching: false
      };

    case SELECT_SINGLE_VISUALIZATION_SORT_ORDER:
      const sortOrders = state.sortOrders.map((order) =>
        new Object({
          ...order,
          selected: order.id === action.selectedSortOrderId
        })
      );
      return { ...state, sortOrders: sortOrders };

    case SELECT_SINGLE_VISUALIZATION_SORT_FIELD:
      const sortFields = state.sortFields.map((field) =>
        new Object({
          ...field,
          selected: field.id == action.selectedSortFieldId
        })
      );
      return { ...state, sortFields: sortFields };

    case SELECT_SINGLE_VISUALIZATION_VISUALIZATION_TYPE:
      return { ...state, visualizationType: action.selectedType };

    case SELECT_VISUALIZATION_DISPLAY_CONFIG:
      var modifiedConfig = state.config.display;
      modifiedConfig[action.key] = action.value;
      return { ...state, config: { ...state.config, display: modifiedConfig, lastUpdated: Date.now() }};

    case SELECT_VISUALIZATION_DATA_CONFIG:
      var modifiedConfig = state.config.data;
      modifiedConfig[action.key] = action.value;
      return { ...state, config: { ...state.config, data: modifiedConfig, lastUpdated: Date.now() }};

    case REQUEST_CREATE_EXPORTED_SPEC:
      return { ...state, isExporting: true };

    case RECEIVE_CREATED_EXPORTED_SPEC:
      return { ...state, exportedSpecId: action.exportedSpecId, isExporting: false };

    case REQUEST_CREATE_SAVED_SPEC:
      return { ...state, isSaving: true };

    case RECEIVE_CREATED_SAVED_SPEC:
      return { ...state, exportedSpecId: action.exportedSpecId, isSaving: false };

    case SET_SHARE_WINDOW:
      return { ...state, shareWindow: action.shareWindow };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}

import {
  SELECT_REGRESSION_TYPE,
  SELECT_REGRESSION_MODE,
  SELECT_REGRESSION_INDEPENDENT_VARIABLE,
  SELECT_REGRESSION_DEPENDENT_VARIABLE,
  SELECT_REGRESSION_INTERACTION_TERM,
  RECEIVE_FIELD_PROPERTIES,
  REQUEST_RUN_REGRESSION,
  RECEIVE_RUN_REGRESSION,
  PROGRESS_RUN_REGRESSION,
  ERROR_RUN_REGRESSION,
  RECEIVE_CONTRIBUTION_TO_R_SQUARED,
  RECEIVE_CREATED_SAVED_REGRESSION,
  WIPE_PROJECT_STATE,
  RECEIVE_SET_FIELD_IS_ID,
  RECEIVE_SET_FIELD_TYPE,
  CLEAR_ANALYSIS
} from '../constants/ActionTypes';

const regressionModes = [ {
  id: 'automated',
  label: 'Automated',
  selected: false,
}, {
  id: 'builder',
  label: 'Builder',
  selected: false
}];

const baseState = {
  fieldProperties: [],
  regressionType: null,
  dependentVariableId: null,
  independentVariableIds: [],
  interactionTermIds: [],
  regressionResult: {
    exported: false,
    exportedRegressionId: null,
    loading: false,
    progress: null,
    error: null,
    data: null
  },
  builderSpec: {
  },
  regressionModes: regressionModes,
  selectedMode: null,
  contributionToRSquared: []
}

export default function regressionSelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_REGRESSION_MODE:
      var regressionResult;
      if (action.selectedModeId == 'builder') {
        regressionResult = baseState.regressionResult;
      } else {
        regressionResult = state.regressionResult;
      }

      const selectedRegressionModes = state.regressionModes.map((modeObject) =>
        new Object({ ...modeObject, selected: ( modeObject.id == action.selectedModeId )})
      )
      return { ...state, regressionModes: selectedRegressionModes, selectedMode: action.selectedModeId, regressionResult: regressionResult }

    case SELECT_REGRESSION_TYPE:
      return { ...state, regressionType: action.regressionType }

    case SELECT_REGRESSION_DEPENDENT_VARIABLE:
      const independentVariables = state.fieldProperties
        .filter((property) => property.id != action.dependentVariableId && !( property.generalType == 'c' && property.isUnique ) && !( property.generalType == 'c' && property.uniqueValues.length > 2 ))
        .map((property) => property.id)

      return { ...state, dependentVariableId: action.dependentVariableId, independentVariableIds: independentVariables };

    case SELECT_REGRESSION_INDEPENDENT_VARIABLE:
      var independentVariableIds = state.independentVariableIds.slice();
      var selectedId = parseInt(action.independentVariableId);

      if (state.independentVariableIds.find((independentVariableId) => independentVariableId == selectedId)) {
        independentVariableIds = independentVariableIds.filter((independentVariableId) => independentVariableId != selectedId);
      } else {
        independentVariableIds.push(selectedId);
      }

      return { ...state, independentVariableIds: independentVariableIds};

    case SELECT_REGRESSION_INTERACTION_TERM:
      var interactionTermIds = state.interactionTermIds.slice();
      var selectedId = parseInt(action.interactionTermId);

      if(state.interactionTermIds.find((interactionTermId)=> interactionTermId == selectedId)) {
        interactionTermIds = interactionTermIds.filter((interactionTermId) => interactionTermId != selectedId);
      } else {
        interactionTermIds.push(selectedId);
      }

      return { ...state, interactionTermIds: interactionTermIds}

    case RECEIVE_FIELD_PROPERTIES:
      const selectedIndependentVariables = action.fieldProperties
        .filter((property) => property.id != state.dependentVariableId && !( property.generalType == 'c' && property.isUnique ) && !( property.generalType == 'c' && property.uniqueValues && property.uniqueValues.length > 2 ))
        .map((property) => property.id);

      return { ...state, fieldProperties: action.fieldProperties, independentVariableIds: selectedIndependentVariables };

    case RECEIVE_SET_FIELD_TYPE:
      var fieldProperties = state.fieldProperties.slice().map((fieldProperty) =>
        fieldProperty.id == action.fieldProperty.id ?
          action.fieldProperty : fieldProperty
      );

      return { ...state, fieldProperties: fieldProperties, updatedAt: action.receivedAt };

    case RECEIVE_SET_FIELD_IS_ID:
      var fieldProperties = state.fieldProperties.slice().map((fieldProperty) =>
        fieldProperty.id == action.fieldProperty.id ?
          action.fieldProperty : fieldProperty
      );
      return { ...state, fieldProperties: fieldProperties, updatedAt: action.receivedAt };

    case REQUEST_RUN_REGRESSION:
      return { ...state, regressionResult: { ...state.regressionResult, loading: true } };

    case RECEIVE_RUN_REGRESSION:
      return { ...state,
        regressionResult: {
          exported: action.data.exported,
          exportedRegressionId: action.data.exportedRegressionId,
          loading: false,
          data: action.data
        }
      };

    case ERROR_RUN_REGRESSION:
      return { ...state, regressionResult: { ...state.regressionResult, error: action.error } };

    case PROGRESS_RUN_REGRESSION:
      if (action.progress && action.progress.length){
        return { ...state, regressionResult: { ...state.regressionResult, progress: action.progress} };
      }
      return state;

    case ERROR_RUN_REGRESSION:
      return { ...state, regressionResult: { loading: false, error: action.error } };

    case RECEIVE_CREATED_SAVED_REGRESSION:
      return { ...state,
        regressionResult: {
          ...state.regressionResult,
          exportedRegression: true,
          exportedRegressionId: action.exportedRegressionId
        }
      };

    case RECEIVE_CONTRIBUTION_TO_R_SQUARED:
      return { ...state, contributionToRSquared: (action.data.data || []) };

    case WIPE_PROJECT_STATE, CLEAR_ANALYSIS:
      return baseState;

    default:
      return state;
  }
}

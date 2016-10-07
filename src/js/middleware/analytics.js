import {
  CREATED_PROJECT,  // Projects
  UPDATED_PROJECT,
  SELECT_DATASET,  // Datasets
  DELETED_DATASET,
  RECEIVE_UPLOAD_DATASET,
  RECEIVE_DATASET,
  RECEIVE_DATASETS,
  SELECT_TRANSFORM_DATASET,  // Transform
  RECEIVE_SET_FIELD_TYPE,  // Field Properties
  RECEIVE_SET_FIELD_IS_ID,
  RECEIVE_SET_FIELD_COLOR,
  SELECT_DATASET_LAYOUT_TYPE,
  SELECT_AGGREGATION_FUNCTION,
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
  CREATE_PROJECT,
  RECEIVE_EXACT_SPECS,  // Visualizations
  RECEIVE_INDIVIDUAL_SPECS,
  RECEIVE_SUBSET_SPECS,
  RECEIVE_EXPANDED_SPECS,
  RECEIVE_VISUALIZATION_DATA,
  SELECT_SORTING_FUNCTION,
  SELECT_RECOMMENDATION_TYPE,
  RECEIVE_CREATED_EXPORTED_SPEC,
  RECEIVE_CREATED_SAVED_SPEC,
  SELECT_CONDITIONAL,
  SELECT_VISUALIZATION_TYPE,
  SELECT_AGGREGATION_AGGREGATION_VARIABLE,  // Aggregation
  SELECT_AGGREGATION_INDEPENDENT_VARIABLE,
  SELECT_AGGREGATION_AGGREGATION_FUNCTION,
  SELECT_AGGREGATION_AGGREGATION_WEIGHT_VARIABLE,
  SELECT_AGGREGATION_CONFIG_X,
  SELECT_AGGREGATION_CONFIG_Y,
  RECEIVE_AGGREGATION,
  ERROR_AGGREGATION,
  RECEIVE_ONE_D_AGGREGATION,
  ERROR_ONE_D_AGGREGATION,
  RECEIVE_AGGREGATION_STATISTICS,
  ERROR_AGGREGATION_STATISTICS,
  SELECT_COMPARISON_INDEPENDENT_VARIABLE,  // Comparison
  SELECT_COMPARISON_DEPENDENT_VARIABLE,
  RECEIVE_NUMERICAL_COMPARISON,
  UPDATE_COMPARISON_INPUT,
  RECEIVE_ANOVA,
  RECEIVE_ANOVA_BOXPLOT_DATA,
  RECEIVE_PAIRWISE_COMPARISON_DATA,
  SELECT_REGRESSION_TYPE,  // Regression
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
  RECEIVE_CREATED_INTERACTION_TERM,
  RECEIVE_CREATE_DOCUMENT,  // Compose
  RECEIVE_DELETE_DOCUMENT,
  REQUEST_SAVE_DOCUMENT,
  SELECT_COMPOSE_CONTENT,
  REMOVE_COMPOSE_CONTENT,
  MOVE_COMPOSE_BLOCK,
  SELECT_DOCUMENT,
  SET_DOCUMENT_TITLE
} from '../constants/ActionTypes';

export function analyticsMiddleware({ getState }){
  return (next) => (action) => {
    switch(action.type) {
      case CREATED_PROJECT:
        window.amplitude.logEvent('[PROJECT] Created Project');
        break;
      case UPDATED_PROJECT:
        window.amplitude.logEvent('[PROJECT] Updated Project');
        break;

      case SELECT_DATASET:
        window.amplitude.logEvent('[DATASETS] Selected Dataset');
        break;
      case DELETED_DATASET:
        window.amplitude.logEvent('[DATASETS] Deleted Dataset');
        break;
      case RECEIVE_UPLOAD_DATASET:
        window.amplitude.logEvent('[DATASETS] Received Upload Dataset');
        break;
      case RECEIVE_DATASET:
        window.amplitude.logEvent('[DATASETS] Received Inspect Dataset');
        break;
      case SELECT_DATASET_LAYOUT_TYPE:
        window.amplitude.logEvent('[DATASETS] Changed Dataset Layout Type');
        break;

      // Transform
      case SELECT_TRANSFORM_DATASET:
        window.amplitude.logEvent('[TRANSFORM] Changed Dataset');
        break;

      // Field Properties
      case RECEIVE_SET_FIELD_TYPE:
        window.amplitude.logEvent('[FIELD PROPERTIES] Set Field Type');
        break;
      case RECEIVE_SET_FIELD_IS_ID:
        window.amplitude.logEvent('[FIELD PROPERTIES] Set Field as ID');
        break;
      case RECEIVE_SET_FIELD_COLOR:
        window.amplitude.logEvent('[FIELD PROPERTIES] Set Field Color');
        break;

      // Visualization
      case RECEIVE_EXACT_SPECS:
        window.amplitude.logEvent('[VISUALIZATION] Received Exact Specs');
        break;
      case RECEIVE_INDIVIDUAL_SPECS:
        window.amplitude.logEvent('[VISUALIZATION] Received Individual Specs');
        break;
      case RECEIVE_SUBSET_SPECS:
        window.amplitude.logEvent('[VISUALIZATION] Received Subset Specs');
        break;
      case RECEIVE_EXPANDED_SPECS:
        window.amplitude.logEvent('[VISUALIZATION] Received Expanded Specs');
        break;
      case RECEIVE_CREATED_EXPORTED_SPEC:
        window.amplitude.logEvent('[VISUALIZATION] Exported Spec');
        break;
      case RECEIVE_CREATED_SAVED_SPEC:
        window.amplitude.logEvent('[VISUALIZATION] Saved Spec');
        break;
      case RECEIVE_VISUALIZATION_DATA:
        window.amplitude.logEvent('[VISUALIZATION] Received Visualization Data');
        break;
      case SELECT_CONDITIONAL:
        window.amplitude.logEvent('[VISUALIZATION] Selected Conditional');
        break;

      case SELECT_SORTING_FUNCTION:
        window.amplitude.logEvent('[VISUALIZATION] Selected Sorting Type');
        break;
      case SELECT_RECOMMENDATION_TYPE:
        window.amplitude.logEvent('[VISUALIZATION] Selected Recommendation Type');
        break;
      case SELECT_VISUALIZATION_TYPE:
        window.amplitude.logEvent('[VISUALIZATION] Selected Visualization Type');
        break;

      // Aggregation
      case SELECT_AGGREGATION_AGGREGATION_VARIABLE:
        window.amplitude.logEvent('[AGGREGATION] Selected Aggregation Variable');
        break;
      case SELECT_AGGREGATION_INDEPENDENT_VARIABLE:
        window.amplitude.logEvent('[AGGREGATION] Selected Independent Variable');
        break;
      case SELECT_AGGREGATION_AGGREGATION_FUNCTION:
        window.amplitude.logEvent('[AGGREGATION] Selected Aggregation Function');
        break;
      case SELECT_AGGREGATION_AGGREGATION_WEIGHT_VARIABLE:
        window.amplitude.logEvent('[AGGREGATION] Selected Aggregation Weight');
        break;
      case SELECT_AGGREGATION_CONFIG_X:
        window.amplitude.logEvent('[AGGREGATION] Selected X Config');
        break;
      case SELECT_AGGREGATION_CONFIG_Y:
        window.amplitude.logEvent('[AGGREGATION] Selected Y Config');
        break;
      case RECEIVE_AGGREGATION:
        window.amplitude.logEvent('[AGGREGATION] Received Aggregation');
        break;
      case ERROR_AGGREGATION:
        window.amplitude.logEvent('[AGGREGATION] Aggregation Error');
        break;
      case RECEIVE_ONE_D_AGGREGATION:
        window.amplitude.logEvent('[AGGREGATION] Received 1D Aggregation');
        break;
      case ERROR_ONE_D_AGGREGATION:
        window.amplitude.logEvent('[AGGREGATION] 1D Aggregation Error');
        break;
      case RECEIVE_AGGREGATION_STATISTICS:
        window.amplitude.logEvent('[AGGREGATION] Received Aggregation Statistics');
        break;
      case ERROR_AGGREGATION_STATISTICS:
        window.amplitude.logEvent('[AGGREGATION] Aggregation Statistics Error');
        break;

      // Comparison
      case SELECT_COMPARISON_INDEPENDENT_VARIABLE:
        window.amplitude.logEvent('[COMPARISON] Selected Comparison Independent Varible');
        break;
      case SELECT_COMPARISON_DEPENDENT_VARIABLE:
        window.amplitude.logEvent('[COMPARISON] Selected Comparison Dependent Varible');
        break;
      case RECEIVE_NUMERICAL_COMPARISON:
        window.amplitude.logEvent('[COMPARISON] Received Numerical Comparison');
        break;
      case UPDATE_COMPARISON_INPUT:
        window.amplitude.logEvent('[COMPARISON] Updated Comparison Input');
        break;
      case RECEIVE_ANOVA:
        window.amplitude.logEvent('[COMPARISON] Received ANOVA');
        break;
      case RECEIVE_ANOVA_BOXPLOT_DATA:
        window.amplitude.logEvent('[COMPARISON] Received ANOVA Boxplot Data');
        break;
      case RECEIVE_PAIRWISE_COMPARISON_DATA:
        window.amplitude.logEvent('[COMPARISON] Received Pairwise Comparison Data');
        break;

      // Regression
      case ERROR_RUN_REGRESSION:
        window.amplitude.logEvent('[REGRESSION] Error Running Regression');
        break
      case RECEIVE_CREATED_INTERACTION_TERM:
        window.amplitude.logEvent('[REGRESSION] Created Interaction Term');
        break
      case SELECT_REGRESSION_TYPE:
        window.amplitude.logEvent('[REGRESSION] Selected Regression Type');
        break
      case SELECT_REGRESSION_MODE:
        window.amplitude.logEvent('[REGRESSION] Selected Regression Mode');
        break
      case SELECT_REGRESSION_INDEPENDENT_VARIABLE:
        window.amplitude.logEvent('[REGRESSION] Selected Independent Variable');
        break
      case SELECT_REGRESSION_DEPENDENT_VARIABLE:
        window.amplitude.logEvent('[REGRESSION] Selected Dependent Variable');
        break
      case SELECT_REGRESSION_INTERACTION_TERM:
        window.amplitude.logEvent('[REGRESSION] Selected Interaction Term');
        break
      case RECEIVE_RUN_REGRESSION:
        window.amplitude.logEvent('[REGRESSION] Ran Regression');
        break
      case RECEIVE_CONTRIBUTION_TO_R_SQUARED:
        window.amplitude.logEvent('[REGRESSION] Received Contribution to R Squared');
        break
      case RECEIVE_CREATED_SAVED_REGRESSION:
        window.amplitude.logEvent('[REGRESSION] Saved Regression');
        break


      case RECEIVE_CREATE_DOCUMENT:
        window.amplitude.logEvent('[COMPOSE] Created Document');
        break;
      case RECEIVE_DELETE_DOCUMENT:
        window.amplitude.logEvent('[COMPOSE] Deleted Document');
        break;
      case SELECT_COMPOSE_CONTENT:
        window.amplitude.logEvent('[COMPOSE] Selected Compose Content');
        break;
      case REMOVE_COMPOSE_CONTENT:
        window.amplitude.logEvent('[COMPOSE] Removed Compose Content');
        break;
      case MOVE_COMPOSE_BLOCK:
        window.amplitude.logEvent('[COMPOSE] Moved Compose Block');
        break;
      case SELECT_DOCUMENT:
        window.amplitude.logEvent('[COMPOSE] Selected Document');
        break;
      case SET_DOCUMENT_TITLE:
        window.amplitude.logEvent('[COMPOSE] Set Document Title');
        break;

    }

    return next(action);
  }
}

import {
  RECEIVE_SPECS,
  SELECT_VISUALIZATION_TYPE,
  RECEIVE_VISUALIZATION_DATA,
  CLEAR_VISUALIZATION,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const visualizationTypes = [
  {
    type: "tree",
    imageName: "treemap",
    label: "Treemap",
    selected: false,
    disabled: false
  },
  {
    type: "bar",
    imageName: "bar",
    label: "Bar",
    selected: false,
    disabled: false
  },
  {
    type: "hist",
    imageName: "bar",
    label: "Histogram",
    selected: false,
    disabled: false
  },
  {
    type: "pie",
    imageName: "pie",
    label: "Pie",
    selected: false,
    disabled: false
  },
  {
    type: "line",
    imageName: "line",
    label: "Line",
    selected: false,
    disabled: false
  },
  {
    type: "scatter",
    imageName: "scatterplot",
    label: "Scatter",
    selected: false,
    disabled: false
  }
]

const baseState = {
  visualizationTypes: visualizationTypes,
  updatedAt: 0
}

export default function filters(state=baseState, action) {
  switch(action.type){
    case SELECT_VISUALIZATION_TYPE:
      const reselectedVisualizationTypes = state.visualizationTypes.map((typeObject) =>
        new Object({ ...typeObject, selected: (typeObject.type == action.selectedType && !typeObject.selected) })
      );

      return { ...state, visualizationTypes: reselectedVisualizationTypes, updatedAt: Date.now() }

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}

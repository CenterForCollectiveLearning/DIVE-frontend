import {
  SELECT_VISUALIZATION_TYPE
} from '../constants/ActionTypes';

export default function filters(state={
  visualizationTypes: [
    {
      type: "TREEMAP",
      imageName: "treemap",
      label: "Treemap",
      selected: false,
      disabled: false
    },
    {
      type: "BAR",
      imageName: "bar",
      label: "Bar",
      selected: false,
      disabled: false
    },
    {
      type: "PIE",
      imageName: "pie",
      label: "Pie",
      selected: false,
      disabled: false
    },
    {
      type: "LINE",
      imageName: "line",
      label: "Line",
      selected: false,
      disabled: false
    },
    {
      type: "SCATTERPLOT",
      imageName: "scatterplot",
      label: "Scatter",
      selected: false,
      disabled: false
    }
  ]
}, action) {
  switch(action.type){
    case SELECT_VISUALIZATION_TYPE:
      var newVisualizationTypes = state.visualizationTypes;

      const previousSelectedIndex = state.visualizationTypes.findIndex((typeObject, i, types) =>
        typeObject.selected
      );
      if (previousSelectedIndex >= 0) {
        newVisualizationTypes[previousSelectedIndex].selected = false;
      }

      const newSelectedIndex = state.visualizationTypes.findIndex((typeObject, i, types) =>
        typeObject.type == action.selectedType
      );
      if (newSelectedIndex >= 0) {
        newVisualizationTypes[newSelectedIndex].selected = true;
      }
      return { ...state, visualizationTypes: newVisualizationTypes }
    default:
      return state;
  }
}


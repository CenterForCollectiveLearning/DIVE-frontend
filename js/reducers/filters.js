import {
  SELECT_VISUALIZATION_TYPE
} from '../constants/ActionTypes';

export default function filters(state={
  visualizationTypes: [
    {
      type: "tree",
      imageName: "treemap",
      label: "Treemap",
      selected: false,
      disabled: false
    },
    {
      type: "hist",
      imageName: "bar",
      label: "Bar",
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
      disabled: true
    },
    {
      type: "scatter",
      imageName: "scatterplot",
      label: "Scatter",
      selected: false,
      disabled: true
    }
  ]
}, action) {
  switch(action.type){
    case SELECT_VISUALIZATION_TYPE:
      var visualizationTypes = state.visualizationTypes;

      const selectedIndex = state.visualizationTypes.findIndex((typeObject, i, types) =>
        typeObject.type == action.selectedType
      );
      if (selectedIndex >= 0) {
        visualizationTypes[selectedIndex].selected = !visualizationTypes[selectedIndex].selected;
      }

      return { ...state, visualizationTypes: visualizationTypes }
    default:
      return state;
  }
}


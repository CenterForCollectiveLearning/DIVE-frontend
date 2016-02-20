import {
  RECEIVE_SPECS,
  SELECT_VISUALIZATION_TYPE,
  RECEIVE_VISUALIZATION_DATA,
  CLEAR_VISUALIZATION,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const allVisualizationTypes = [
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
  currentVisualizationTypes: [],
  galleryVisualizationTypes: [],
  builderVisualizationTypes: []
}

export default function filters(state=baseState, action) {
  switch(action.type){

    case RECEIVE_SPECS:
      var allVizTypesInSpecs = action.specs
        .map((s) => s.vizTypes)
        .reduce((previousVizTypes, currentVizTypes) => [ ...previousVizTypes, ...currentVizTypes ]);
      var uniqueVizTypesInSpecs = [ ...new Set(allVizTypesInSpecs) ];
      var relevantVizTypes = allVisualizationTypes.map((f) => new Object({ ...f, disabled: (uniqueVizTypesInSpecs.indexOf(f.type) == -1) }));
      return { ...state, currentVisualizationTypes: relevantVizTypes, galleryVisualizationTypes: relevantVizTypes };

    case RECEIVE_VISUALIZATION_DATA:
      var vizTypesInSpec = action.spec.vizTypes;
      var relevantVizTypes = allVisualizationTypes.map((f) => new Object({ ...f, disabled: (vizTypesInSpec.indexOf(f.type) == -1) }));
      return { ...state, currentVisualizationTypes: relevantVizTypes, builderVisualizationTypes: relevantVizTypes };

    case CLEAR_VISUALIZATION:
     return { ...state, currentVisualizationTypes: state.galleryVisualizationTypes };

    case SELECT_VISUALIZATION_TYPE:
      var visualizationTypes = state.currentVisualizationTypes;

      var selectedIndex = state.currentVisualizationTypes.findIndex((typeObject, i, types) =>
        typeObject.type == action.selectedType
      );
      if (selectedIndex >= 0) {
        visualizationTypes[selectedIndex].selected = !visualizationTypes[selectedIndex].selected;
      }

      return { ...state, currentVisualizationTypes: visualizationTypes }

    case WIPE_PROJECT_STATE:
      return baseState;
    default:
      return state;
  }
}

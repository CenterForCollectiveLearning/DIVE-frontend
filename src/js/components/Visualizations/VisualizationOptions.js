export const MAX_ELEMENTS = {
  preview: {
    all: 2000,
    scatter: 500,
    treemap: 200
  },
  full: {
    all: 3009,
    scatter: 1000,
    treemap: 400
  }
}

// Properties shared by both full and minimal options
const baseOptions = {
  backgroundColor: 'transparent',
  fontName: 'Roboto, Helvetica, Arial, sans-serif',
  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
}

const gray = "#777";
const titleTextStyle = {
  color: "#000",
  fontSize: 16,
  italic: false,
  bold: true
};

export const fullOptions = {
  ...baseOptions,
  headerColor: 'white',
  headerHeight: 0,
  fontColor: "#333",
  textStyle: {
    color: "#333"
  },
  chartArea: {
    top: '5%',
    height: '78%',
    left: '15%',
    width: '80%'
  },
  legend: {
    textStyle: {
      color: "#333"
    }
  },
  hAxis: {
    minValue: 0,
    titleTextStyle: titleTextStyle,
    textStyle: {
      color: gray,
      italic: false,
    }
  },
  vAxis: {
    minValue: 0,
    titleTextStyle:  titleTextStyle,
    textStyle: {
      color: gray,
      italic: false,
    }
  },
  vAxes: [
    {
      textStyle: {
        color: "#777",
        italic: false
      }
    }
  ]
};

export const minimalOptions = {
  ...baseOptions,
  axisTitlesPosition: 'none',
  chartArea: {
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  },
  enableInteractivity: false,
  fontSize: 0,
  headerHeight: 0,
  hAxis: {
    baselineColor: 'transparent',
    textPosition: 'none',
    gridlines: {
      count: 0,
      color: 'transparent'
    }
  },
  height: 140,
  highlightOnMouseOver: false,
  hintOpacity: 0,
  legend: {
    position: 'none'
  },
  pointSize: 2,
  showTooltips: false,
  textStyle: {
    color: 'transparent',
    fontSize: 0
  },
  tooltip: {
    trigger: 'none'
  },
  vAxis: {
    baselineColor: 'transparent',
    textPosition: 'none',
    minValue: 0,
    gridlines: {
      count: 0,
      color: 'transparent'
    }
  },
  vAxes: [
    {
      baselineColor: 'transparent',
      textPosition: 'none',
      gridlines: {
        count: 0
      }
    }
  ]
};

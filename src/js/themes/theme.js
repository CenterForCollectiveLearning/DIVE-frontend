
export default {
  getPalette() {
    return {
      accent1Color: "#2D5365",
      accent2Color: "#0C83BA",
      transparent: "#00000000",
      white: "#FFFFFF"
    };
  },
  getComponentThemes(palette) {
    return {
      raisedButton: {
        primaryColor: palette.accent2Color
      },
      flatButton: {
        color:        palette.accent2Color,
        primaryTextColor: palette.white
      },
      tabs: {
        backgroundColor: palette.transparent
      }
    }
  }
}

// most theme variables listed below
// {
//   getPalette() {
//     return {
//       primary1Color: String,
//       primary2Color: String,
//       primary3Color: String,
//       accent1Color: String,
//       accent2Color: String,
//       accent3Color: String,
//       textColor: String,
//       canvasColor: String,
//       borderColor: String,
//       disabledColor: String
//     };
//   },
//   getComponentThemes(palette) {
//     return {
//       appBar: {
//         color: String,
//         textColor: String,
//         height: Number
//       },
//       button: {
//         height: Number,
//         minWidth: Number,
//         iconButtonSize: Number
//       },
//       checkbox: {
//         boxColor: String,
//         checkedColor: String,
//         requiredColor: String,
//         disabledColor: String,
//         labelColor: String,
//         labelDisabledColor: String
//       },
//       datePicker: {
//         color: String,
//         textColor: String,
//         calendarTextColor: String,
//         selectColor: String,
//         selectTextColor: String,
//       },
//       dropDownMenu: {
//         accentColor: String,
//       },
//       flatButton: {
//         color: String,
//         textColor: String,
//         primaryTextColor: String,
//         secondaryTextColor: String,
//         disabledColor: String
//       },
//       floatingActionButton: {
//         buttonSize: Number,
//         miniSize: Number,
//         color: String,
//         iconColor: String,
//         secondaryColor: String,
//         secondaryIconColor: String,
//         disabledColor: String,
//         disabledTextColor: String
//       },
//       leftNav: {
//         width: Number,
//         color: String,
//       },
//       menu: {
//         backgroundColor: String,
//         containerBackgroundColor: String,
//       },
//       menuItem: {
//         dataHeight: Number,
//         height: Number,
//         hoverColor: String,
//         padding: Number,
//         selectedTextColor: String,
//       },
//       menuSubheader: {
//         padding: Number,
//         borderColor: String,
//         textColor: String,
//       },
//       paper: {
//         backgroundColor: String,
//       },
//       radioButton: {
//         borderColor: String,
//         backgroundColor: String,
//         checkedColor: String,
//         requiredColor: String,
//         disabledColor: String,
//         size: Number,
//         labelColor: String,
//         labelDisabledColor: String
//       },
//       raisedButton: {
//         color: String,
//         textColor: String,
//         primaryColor: String,
//         primaryTextColor: String,
//         secondaryColor: String,
//         secondaryTextColor: String,
//         disabledColor: String,
//         disabledTextColor: String
//       }
//     }
//   }
// }

import React from 'react';
import Mui from 'material-ui-io';
let ThemeManager = new Mui.Styles.ThemeManager();
import CustomTheme from '../../themes/theme.js';

class BaseComponent extends React.Component {
    getChildContext() {
        ThemeManager.setTheme(CustomTheme);
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    }
}

BaseComponent.childContextTypes = {
    muiTheme: React.PropTypes.object
};

module.exports = BaseComponent;


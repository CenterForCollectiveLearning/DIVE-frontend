import React from 'react';
import Mui from 'material-ui';
let ThemeManager = new Mui.Styles.ThemeManager();

class BaseComponent extends React.Component {
    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    }
}

BaseComponent.childContextTypes = {
    muiTheme: React.PropTypes.object
};

module.exports = BaseComponent;

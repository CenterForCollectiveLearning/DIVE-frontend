import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { updateProject, deleteProject, submitFeedback } from '../../actions/ProjectActions.js';
import styles from '../App/App.sass';

import DropDownMenu from './DropDownMenu';
import BlockingModal from './BlockingModal';
import RaisedButton from './RaisedButton';
import Input from './Input';
import TextArea from './TextArea';

class FeedbackModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feedbackType: 'feature',
      description: ''
    };
  }

  submit = () => {
    const { project, user, closeAction } = this.props;
    const { feedbackType, description } = this.state;

    submitFeedback(project.properties.id, user.id, user.email, user.username, type, description)
    // closeAction();
  }

  selectFeedbackType = (feedbackType) => {
    this.setState({ feedbackType: feedbackType });
  }

  enteredFeedbackDescription = (event) => {
    this.setState({ description: event.target.value });
  }
    // Or contact us directly: <a href="mailto:dive@media.mit.edu?Subject=DIVE%20Feedback" target="_top">dive@media.mit.edu</a>
  render() {
    const { closeAction } = this.props;
    const { feedbackType, description } = this.state;

    var footer =
      <div className={ styles.footerContent }>
        <div className={ styles.rightActions }>
          <RaisedButton primary normalHeight minWidth={ 100 } onClick={ this.submit }>Submit</RaisedButton>
        </div>
      </div>;

    return (
      <BlockingModal
        scrollable={ false }
        closeAction={ this.props.closeAction }
        heading="Help Us Make DIVE Better"
        footer={ footer }>
        <div className={ styles.fillContainer }>
          <div className={ styles.controlSection }>
            <div className={ styles.label }>Category</div>
            <DropDownMenu
              value={ feedbackType }
              options={[
                { id: 'bug', name: 'Bug'},
                { id: 'feature', name: 'Feature Request'},
                { id: 'idea', name: 'Idea'},
                { id: 'complaint', name: 'Complaint'},
                { id: 'compliment', name: 'Compliment'},
              ]}
              valueMember="id"
              displayTextMember="name"
              onChange={ this.selectFeedbackType }/>
          </div>
          <div className={ styles.controlSection }>
            <div className={ styles.label }>Description</div>
            <TextArea
              type="textarea"
              placeholder={ description }
              value={ description }
              onChange={ this.enteredFeedbackDescription }/>
          </div>
        </div>
      </BlockingModal>
    );
  }
}

FeedbackModal.propTypes = {
  closeAction: PropTypes.func,
  user: PropTypes.object,
  project: PropTypes.object
};

function mapStateToProps(state) {
  return { submitFeedback };
}

export default connect(mapStateToProps, { updateProject, deleteProject })(FeedbackModal);

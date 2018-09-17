import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Login from '../Login';
import { updateUserInfo } from '../../actions/auth';
import { checkConnection, wentOffline, wentOnline } from '../../actions/online';
import Title from '../Title';
import Footer from '../Footer';
import Paragraph from '../Paragraph';
import Button from '../Button';
import Options from '../Options';

class App extends Component {
  componentDidMount() {
    window.addEventListener('online', this.handleOnlineEvent);
    window.addEventListener('offline', this.handleOfflineEvent);

    this.props.checkConnection(navigator.onLine);

    chrome.storage.local.get(['username'], result => {
      if (result.username) {
        this.props.updateUserInfo(result);
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnlineEvent);
    window.removeEventListener('offline', this.handleOfflineEvent);
  }

  render() {
    return (
      <div className="app">

        <div>
          <Title t={chrome.i18n.getMessage('optionsTitle')} />
          {
            !this.props.online ?
              <Paragraph t={chrome.i18n.getMessage('optionsOfflineMessage')} /> :
              this.renderOnline()
          }
        </div>

        <footer>
          <Footer t={chrome.i18n.getMessage('optionsFooter')} />
        </footer>

      </div>
    );
  }

  renderOnline() {
    return this.props.username ? <Options /> : <Login />;
  }

  handleOnlineEvent = () => {
    this.props.wentOnline();
  }

  handleOfflineEvent = () => {
    this.props.wentOffline();
  }
}

App.propTypes = {
  username: PropTypes.string.isRequired,
  online: PropTypes.bool.isRequired,
  updateUserInfo: PropTypes.func.isRequired,
  checkConnection: PropTypes.func.isRequired,
  wentOnline: PropTypes.func.isRequired,
  wentOffline: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    username: state.auth.username,
    online: state.online,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateUserInfo: userInfo => dispatch(updateUserInfo(userInfo)),
    checkConnection: online => dispatch(checkConnection(online)),
    wentOffline: () => dispatch(wentOffline()),
    wentOnline: () => dispatch(wentOnline()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

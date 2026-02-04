import React, { useEffect, useState } from 'react';

import { makeStyles, ThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';

import Home from './pages/home';
import store from './services/store';
import Theme from './theme';
import MiniApp from 'js-miniapp-sdk';

const useStyles = makeStyles((theme) => ({
  App: {
    width: '100%',
    textAlign: 'center',
  },
  toastStyle: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '10px',
    backgroundColor: '#444',
    color: 'white',
    borderRadius: '5px',
    zIndex: '9999',
    textAlign: 'center',
  },
}));

function App() {
  const classes = useStyles();
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    try {
      const platform = MiniApp.getPlatform();
      function updateLoadingStatus() {
        if (document.readyState === 'complete') {
          miniAppDidFinishLoad();
        }
      }
      if (platform === 'iOS') {
        updateLoadingStatus();
      } else {
        document.onreadystatechange = function () {
          updateLoadingStatus();
        };
      }

      window['annoyingTimer']= setInterval(()=>{
        console.log('annoyingTimer ', new Date().getTime())
      }, 10000)

      window["startICChipKyc"] = startICChipKycFlow;
    } catch (e) {
      console.log(e);
    }
  }, []);

  function startICChipKycFlow(params){
    try {
      console.log('Exposed startICChipKycFlow:', params);
      MiniApp.oneClickSdk
        .startICChipKyc(params)
        .then((response) => {
          console.log('Exposed startICChipKycFlow success:', response);
          sendSSPStatus(response);
        })
        .catch((error) => {
          console.error('Exposed startICChipKycFlow error:', error);
          sendSSPStatus(error);
        });
    } catch (error) {
      console.error('Try-Catch Exception in Exposed startICChipKycFlow:', error);
    }
  }

  function sendSSPStatus(payload){
    //MiniApp.invokeLinkInterface
    window.LinkIBBridge.invokeLinkInterface('sendSSPStatus', payload)
      .then((response) => {
        console.log('sendSSPStatus SUCCESS:', response);
      })
      .catch((error) => {
        console.error('sendSSPStatus ERROR:', error);
      });
  }

  function miniAppDidFinishLoad() {
    try {
      MiniApp.miniappUtils
        .miniAppFinishedLoading()
        .then((response) => {
          console.log('miniAppFinishedLoading(): ', response);
          setToastVisible(true);
          const timer = setTimeout(() => setToastVisible(false), 5000);
          return () => clearTimeout(timer);
        })
        .catch((miniAppError) => {
          console.log('miniAppFinishedLoading - Error: ', miniAppError);
        });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={Theme}>
        <div className={classes.App}>
          <Home />
          {toastVisible && (
            <div className={classes.toastStyle}>
              HostApp was notified successfully.
            </div>
          )}
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

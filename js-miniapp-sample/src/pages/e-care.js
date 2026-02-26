import React, { useState } from 'react';

import {
  Button,
  TextField,
  CardContent,
  CardActions,
  makeStyles,
} from '@material-ui/core';
import { red, green } from '@material-ui/core/colors';
import MiniApp from 'js-miniapp-sdk';
import GreyCard from '../components/GreyCard';

const useStyles = makeStyles((theme) => ({
  scrollable: {
    overflowY: 'auto',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: 'center',
  },
  card: {
    height: 'auto',
    left: '50%',
    position: 'relative',
    transform: 'translate(-50%, 0)'
  },
  actions: {
    justifyContent: 'center',
  },
  content: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 18,
    color: theme.color.primary,
    fontWeight: 'bold',
    paddingBottom: 0,
  },
  formInput: {
    marginTop: 10,
    marginBottom: 10,
    background: 'white',
    width: '90%',
  },
  success: {
    color: green[500],
    fontSize: 14,
    textAlign: 'center',
  },
  error: {
    color: red[500],
    fontSize: 14,
    textAlign: 'center',
  },
}));

const ECare = () => {
  const classes = useStyles();

  const [sendInfoType, setSendInfoType] = useState('');
  const [sendInfoName, setSendInfoName] = useState('');
  const [sendInfoStatus, setSendInfoStatus] = useState('');

  // launchAppUsingDeeplink state
  const [deeplinkUrl, setDeeplinkUrl] = useState('');
  const [deeplinkStatus, setDeeplinkStatus] = useState('');

  // closeMiniApp state
  const [closeStatus, setCloseStatus] = useState('');

  const sendInfoToHostApp = () => {
    if (sendInfoType && sendInfoType.length>0) {
      setSendInfoStatus('Navigation Type cannot be empty');
      return;
    }
    if (sendInfoName && sendInfoName.length>0) {
      setSendInfoStatus('Screen Name cannot be empty');
      return;
    }
    const info = {
      "key": sendInfoType, // Must Label: Navigation Type
      "value": sendInfoName, // Must Label: Screen name
      "description": "information to be logged", // Must
    };
    MiniApp.universalBridge
      .sendInfoToHostapp(info)
      .then(() => {
        setSendInfoStatus('SUCCESS');
      })
      .catch((err) => {
        setSendInfoStatus(err && err.message ? err.message : 'Failed to send info');
      });
  };

  const launchAppUsingDeeplink = () => {
    setDeeplinkStatus('');
    if (!deeplinkUrl) {
      setDeeplinkStatus('Please enter a Deeplink URL');
      return;
    }
    MiniApp.miniappUtils
      .launchAppUsingDeeplink(deeplinkUrl)
      .then(() => {
        setDeeplinkStatus('SUCCESS');
      })
      .catch((err) => {
        setDeeplinkStatus(
          err && err.message ? err.message : 'Failed to launch Deeplink'
        );
      });
  };

  const closeMiniApp = () => {
    setCloseStatus('');
    MiniApp.miniappUtils
      .closeMiniApp(false)
      .then(() => {
        setCloseStatus('SUCCESS');
      })
      .catch((err) => {
        setCloseStatus(err && err.message ? err.message : 'Failed to close MiniApp');
      });
  };

  return (
    <div className={classes.scrollable}>
      <h1>eCare MiniApp SLA</h1>
      {/* Send Info to Host App Card */}
      <GreyCard className={classes.card}>
        <CardContent className={classes.content}>
          <TextField
            variant="outlined"
            className={classes.formInput}
            id="navigation-type"
            label="Navigation Type"
            value={sendInfoType}
            onChange={(e) => setSendInfoType(e.target.value)}
          />
        </CardContent>
        <CardContent className={classes.content}>
          <TextField
            variant="outlined"
            className={classes.formInput}
            id="screen-name"
            label="Screen Name"
            value={sendInfoName}
            onChange={(e) => setSendInfoName(e.target.value)}
          />
        </CardContent>
        <CardActions className={classes.actions}>
          <Button
            color="primary"
            variant="contained"
            onClick={sendInfoToHostApp}
          >
            Open Screen
          </Button>
        </CardActions>
        {sendInfoStatus !== '' && (
          <CardContent
            className={
              sendInfoStatus === 'SUCCESS' ? classes.success : classes.error
            }
          >
            {sendInfoStatus}
          </CardContent>
        )}
      </GreyCard>

      <br />

      {/* Launch App Using Deeplink Card */}
      <GreyCard className={classes.card}>
        <CardContent className={classes.content}>
          Launch App Using Deeplink
        </CardContent>
        <CardContent className={classes.content}>
          <TextField
            variant="outlined"
            className={classes.formInput}
            id="deeplink-url"
            label="Deeplink URL"
            value={deeplinkUrl}
            onChange={(e) => setDeeplinkUrl(e.target.value)}
          />
        </CardContent>
        <CardActions className={classes.actions}>
          <Button
            color="primary"
            variant="contained"
            onClick={launchAppUsingDeeplink}
          >
            Launch App
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setDeeplinkUrl('');
              setDeeplinkStatus('');
            }}
          >
            Clear
          </Button>
        </CardActions>
        {deeplinkStatus !== '' && (
          <CardContent
            className={
              deeplinkStatus === 'SUCCESS' ? classes.success : classes.error
            }
          >
            {deeplinkStatus}
          </CardContent>
        )}
      </GreyCard>

      <br />

      {/* Close MiniApp Card */}
      <GreyCard className={classes.card}>
        <CardContent className={classes.content}>Close MiniApp</CardContent>
        <CardContent
          style={{ fontSize: 14, color: '#666', textAlign: 'center' }}
        >
          Closes the MiniApp without a confirmation dialog.
        </CardContent>
        <CardActions className={classes.actions}>
          <Button color="primary" variant="contained" onClick={closeMiniApp}>
            Close MiniApp
          </Button>
        </CardActions>
        {closeStatus !== '' && (
          <CardContent
            className={
              closeStatus === 'SUCCESS' ? classes.success : classes.error
            }
          >
            {closeStatus}
          </CardContent>
        )}
      </GreyCard>
    </div>
  );
};

export default ECare;

import React, { useReducer, useState } from 'react';

import { Button, Card, Grid, Typography, makeStyles } from '@material-ui/core';
import MiniApp from 'js-miniapp-sdk';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '2em',
  },
  root: {
    height: 'auto',
    width: '100%',
    overflowY: 'auto',
  },
  grid: {
    display: 'flex',
    height: '20%',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px',
  },
  contentSection: {
    height: 'auto',
    padding: '10px',
  },
  label: {
    display: 'block',
    fontSize: 12,
    width: '100%',
    color: theme.color.primary,
  },
}));

const initialState = {
  simInstalled: {
    result: null,
    error: false,
  },
};

function dataFetchReducer(state, action) {
  switch (action.type) {
    case 'SIM_INSTALLED_FETCH':
      return { ...state, simInstalled: { result: null, error: false } };
    case 'SIM_INSTALLED_SUCCESS':
      return {
        ...state,
        simInstalled: { result: action.result, error: false },
      };
    case 'SIM_INSTALLED_FAILED':
      return {
        ...state,
        simInstalled: { result: null, error: action.error },
      };
    default:
      throw Error('Unknown action type');
  }
}

function Sim() {
  const classes = useStyles();
  const [state, dispatch] = useReducer(dataFetchReducer, initialState);
  const [rakutenSimResult, setRakutenSimResult] = useState('');

  const handleIsSimInstalled = async () => {
    dispatch({ type: 'SIM_INSTALLED_FETCH' });
    try {
      const result = await MiniApp.isSimInstalled();
      if (result) {
        dispatch({ type: 'SIM_INSTALLED_SUCCESS', result });
        alert('Success! Sim is installed');
      } else {
        dispatch({
          type: 'SIM_INSTALLED_FAILED',
          error: 'Sim is not installed',
        });
        alert('Sim is not installed');
      }
    } catch (error) {
      dispatch({
        type: 'SIM_INSTALLED_FAILED',
        error:
          error.message || 'Encountered error while calling isSimInstalled',
      });
      alert('Fail! Sim installed check failed');
    }
  };

  async function checkRakutenSim() {
    try {
      const isInstalled = await MiniApp.isRakutenSimInstalled();
      setRakutenSimResult(
        isInstalled
          ? 'Rakuten SIM is installed'
          : 'Rakuten SIM is NOT installed'
      );
    } catch (error) {
      setRakutenSimResult(
        error.message || 'Error occurred while checking Rakuten SIM'
      );
    }
  }

  function clearRakutenSim() {
    setRakutenSimResult('');
  }

  return (
    <div>
      <div className={classes.container}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleIsSimInstalled}
        >
          Check if Sim Installed
        </Button>
        {(state.simInstalled.result != null || state.simInstalled.error) && (
          <Typography
            variant="body1"
            color={state.simInstalled.error ? 'error' : 'textSecondary'}
            style={{ marginTop: '20px', wordBreak: 'break-all' }}
          >
            {state.simInstalled.error
              ? state.simInstalled.error
              : `Sim is installed: ${state.simInstalled.result}`}
          </Typography>
        )}
      </div>
      <Card className={classes.root}>
        <Grid className={classes.grid} align="center">
          <h2>Rakuten SIM Check</h2>
          <div className={classes.contentSection}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => checkRakutenSim()}
            >
              Check Rakuten SIM
            </Button>
            <label className={classes.label}>{rakutenSimResult}</label>
            <Button
              variant="contained"
              color="primary"
              onClick={() => clearRakutenSim()}
            >
              Clear
            </Button>
          </div>
        </Grid>
      </Card>
    </div>
  );
}

export default Sim;

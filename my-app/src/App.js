import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

// const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

function App() {
  const classes = useStyles();
  const [input, setInput] = useState('');
  var [results, setResults] = useState(useRef([]));
  const [nominations, setNominations] = useState([]);

  useEffect(() => {
    fetch("https://www.omdbapi.com/?s=" + input + "&apikey=83cb5848&")
    .then((response) => response.json())
    .then(data => {
      results.current = data.Search ? data.Search.map((result) => {
        return result["Title"] + " (" + result["Year"] + ")";
      }) : [];
      setResults(results.current);
    })
  });

  const addNomination = (movie) => {
    nominations.push(movie);
    setNominations(nominations);
  };

  const removeNomination = (movie) => {
    const movieIndex = nominations.indexOf(movie);
    if (movieIndex > -1) {
      nominations.splice(movieIndex, 1);
    }
    setNominations(nominations);
  };

  return (
    <div className="App">
      <h1>The Shoppies</h1>
      <p>Please choose five of your favourite films to nominate.</p>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <FormControl fullWidth className={clsx(classes.margin, classes.textField)} variant="filled">
              <InputLabel htmlFor="movie-search">Movie Title</InputLabel>
              <FilledInput
                id="search"
                type='text'
                value={input}
                onChange={event => {setInput(event.target.value)}}
              />
              <FormHelperText id="movie-search-helper-text">Enter a movie title to search.</FormHelperText>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            {input && <h3>Results for "{input}":</h3>}
            <List
              component="nav"
              aria-labelledby="search-results-list"
              className={classes.root}
            >
              {results.length > 0 && results.map((movie) => {
                return (
                  <ListItem key={movie}>
                    <ListItemText
                      primary={movie}
                    />
                    <ListItemSecondaryAction>
                      {<Button variant="contained" disabled={nominations.includes(movie)} onClick={() => addNomination(movie)}>Nominate Movie</Button>}
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <h3>Your Nominations:</h3>
              {nominations.length > 4 && <p> You're done nominating! </p>}
            <List
              component="nav"
              aria-labelledby="nominations-list"
              className={classes.root}
            >
              {nominations.length > 0 && nominations.map((movie) => {
                return (
                  <ListItem key={movie}>
                    <ListItemText
                      primary={movie}
                    />
                    <ListItemSecondaryAction>
                      <Button variant="contained" onClick={() => removeNomination(movie)}>Remove Nomination</Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;

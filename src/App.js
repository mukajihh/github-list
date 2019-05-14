import React from 'react';
import { Paper, IconButton, InputBase, Card, CardActionArea, CardContent, Typography, Grid } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBack from '@material-ui/icons/ArrowBack';
import './App.scss';
import CommitList from './commit-list/commit-list';

class App extends React.Component {
  
  state = {
    username: '',
    userSearched: '',
    repositories: [],
    noRepositories: false,
    commits: [],
    showRepositories: false,
    showCommits: false
  }


  searchRepositoriesByUsername = () => {
    fetch('http://api.github.com/users/'+ this.state.username +'/repos')
    .then( response => {
      return response.json();
    })
    .then( repositories => {
      if (repositories.length) {
        this.setState({
          userSearched: this.state.username,
          repositories: repositories,
          noRepositories: false,
          showRepositories: true,
          showCommits: false
        });
      } else {
        this.setState({
          userSearched: '',
          repositories: [],
          noRepositories: true,
          showRepositories: false,
          showCommits: false
        });
      }
    })
    ;
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.searchRepositoriesByUsername();
    }
  }

  onCardClick = repository => {
    fetch('http://api.github.com/repos/' + this.state.userSearched + '/' + repository.name + '/commits')
    .then(response => {
      return response.json();
    })
    .then(commits => {
      if (!commits.length) {
        commits = [];
      }
      if (commits.length >= 20) {
        commits = commits.splice(0, 20);
      }
      
      this.setState({
        commits: commits,
        showCommits: true,
        showRepositories: false
      })
    });
  }

  backToRepositories = () => {
    this.setState({
      commits: [],
      showCommits: false,
      showRepositories: true
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Typography component="p" variant="h5">
            GitHub repositories list
          </Typography>
          <Typography component="p">
            Introduce a GitHub username to iniciate
          </Typography>
          <Paper elevation={1}>
            <InputBase
              placeholder="GitHub Username"
              value={this.state.username}
              onChange={this.handleChange('username')}
              onKeyPress={this.handleKeyPress}
            />
            <IconButton
              aria-label="Search"
              onClick={this.searchRepositoriesByUsername}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </header>

        <main>
          {this.state.showRepositories &&
            <Grid container spacing={0} className="repositories">
              <Grid item xs={12}>
                <Grid container justify="center" spacing={24}>
                  {this.state.noRepositories &&
                    <span>couldn't found repositories</span>
                  }
                  {this.state.repositories.map(repository => (
                    <Grid key={repository.id} item className="card-container">
                      <Card className="card">
                        <CardActionArea onClick={() => this.onCardClick(repository)}>
                          <CardContent className="card-content">
                            <Typography gutterBottom variant="h5" component="h2">
                              {repository.name}
                            </Typography>
                            <Typography component="p">
                              {repository.description}
                            </Typography>
                            <Typography component="span">
                              {repository.language}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          }
          {this.state.showCommits &&
            <div className="commits-container">
              <div className="back-container">
                <IconButton onClick={this.backToRepositories}>
                  <ArrowBack />
                </IconButton>
                <span>Back to repositories</span>
              </div>
              <CommitList commits={this.state.commits}></CommitList>
            </div>
          }
        </main>
      </div>
    );
  }
}
export default App;

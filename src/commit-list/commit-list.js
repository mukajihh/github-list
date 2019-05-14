import React from 'react';
import { Grid, List, ListItem, ListItemText, Paper, TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import './commit-list.scss';

class CommitList extends React.Component {
  
  state = {
    search: '',
    commits: this.props.commits,
    commitsFiltered: this.props.commits
  }

  filterList = (event) => {
    let filtered = this.state.commits;
    filtered = filtered.filter(commit => {
      return commit.commit.message.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
    })
    this.setState({
      commitsFiltered: filtered
    })
  }

  handleChange = name => event => {
    this.filterList(event);
    this.setState({ [name]: event.target.value });
  };

  componentWillReceiveProps(props) {
    this.setState({
      commits: props.commits,
      commitsFiltered: props.commits
    })
  }

  render() {
    return (
      <div className="commit-list">
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <TextField
              className="search-field"
              variant="outlined"
              label="Search"
              value={this.state.search}
              onChange={this.handleChange('search')}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
              }}
            />

            {this.state.commitsFiltered.length > 0 &&
              <Paper elevation={1}>
                <List dense>
                  {this.state.commitsFiltered.map(commit => (
                    <ListItem key={commit.sha}>
                      <ListItemText
                        primary={commit.commit.message}
                        secondary={commit.commit.author.name}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            }
            {this.state.commitsFiltered.length === 0 &&
              <span>couldn't found commits</span>
            }
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default CommitList;

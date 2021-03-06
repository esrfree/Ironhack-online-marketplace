import React, { Component, useDebugValue } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import auth from './../auth/auth-helper'
import { read, update } from './api-user.js'

import { Card, CardActions, CardContent, FormControlLabel, Switch } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  }
})

class EditProfile extends Component {
    constructor({ match }) {
        super()
        this.state = {
          name: '',
          email: '',
          password: '',
          seller: false,
          redirectToProfile: false,
          error: ''
        }
        this.match = match
    }

    componentDidMount = () => {
      const jwt = auth.isAuthenticated();

      read(
        { userId: this.match.params.userId },
        { t: jwt.token }
      )
      .then( data => {
        if (data.error) {
          this.setState({ error: data.error })
        }
        else {
          this.setState({ name: data.name, email: data.email, seller: data.seller })
        }
      })
    }

    clickSubmit = () => {
        const jwt = auth.isAuthenticated();
        const user = {
            name: this.state.name || undefined,
            email: this.state.email || undefined,
            password: this.state.password || undefined,
            seller: this.state.seller
        }

        update(
          { userId: this.match.params.userId }, 
          { t: jwt.token },
          user )
          .then( data => {
              if (data.error) this.setState({ error: data.error })
              else {
                /* On successful update, the user details stored in sessionStorage
                for auth purposes should also be updated. */
                auth.updateUser( data, () => {
                  this.setState({ 'userId': data._id, redirectToProfile: true })
                })
              }
          })
    }

    handleChange = (event, name) => {
        this.setState({ [name]: event.target.value })
    }

    handleCheck = (event ,checked) => {
      this.setState({'seller': checked})
    }

    render() {
        const {classes} = this.props;

        if (this.state.redirectToProfile) {
          return (<Redirect to={'/user/' + this.state.userId} />)
        }
        
        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography type="headline" component="h2" className={classes.title}>
                      Edit Profile
                    </Typography>
                    <TextField id="name" label="Name" className={classes.textField} value={this.state.name} onChange={event => this.handleChange(event, 'name')} margin="normal"/><br/>
                    <TextField id="email" type="email" label="Email" className={classes.textField} value={this.state.email} onChange={event => this.handleChange(event, 'email')} margin="normal"/><br/>
                    <TextField id="password" type="password" label="Password" className={classes.textField} value={this.state.password} onChange={event => this.handleChange(event, 'password')} margin="normal"/><br/>
                    <Typography type="subheading" component="h4" className={classes.subheading} >
                      Seller Account
                    </Typography>
                    <FormControlLabel 
                      control={ <Switch 
                                  classes={{ checked: classes.checked,
                                              bar: classes.bar
                                          }}
                                  color='primary'
                                  checked={this.state.seller}
                                  onChange={ this.handleCheck }                                                        
                                /> }
                      label={this.state.seller ? 'Active' : 'Inactive'}
                    />
                    { this.state.error && (
                    <Typography component="p" color="error">
                        <Icon color="error" className={classes.error}>error</Icon>
                        {this.state.error}
                    </Typography>
                    )}
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
                </CardActions>
            </Card>
        )
    }
}

/* To validate the required injection of style declarations as props to the component, we add
the PropTypes requirement validator to the defined component.
*/
EditProfile.propTypes = { classes: PropTypes.object.isRequired }

/*
Exporting the component with the defined styles passed in using withStyles from Material-UI.
Using withStyles like this creates a Higher-Order Component(HOC) that has access to the defined
style objects as props.
*/  
export default withStyles(styles)(EditProfile)
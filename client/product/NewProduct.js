import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom';
import auth from '../auth/auth-helper'; 
import { create } from './api-product.js';


import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    card: {
      maxWidth: 600,
      margin: 'auto',
      textAlign: 'center',
      marginTop: theme.spacing(5),
      paddingBottom: theme.spacing(2)
    },
    title: {
      marginTop: theme.spacing(2),
      color: theme.palette.openTitle,
      fontSize: '1.2em'
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
    },
    input: {
        display: 'none'
    },
    filename:{
        marginLeft:'10px'
    }
  })

  class NewProduct extends Component {
    constructor({ match }) {
        super()
        this.state = {
            name: '',
            description: '',
            images: [],
            category: '',
            quantity: '',
            price: '',
            redirect: false,
            error: ''
        }
        this.match = match;
    }
    

    componentDidMount = () => {
        this.productData = new FormData()
    }

    handleChange = (event, name) => {
        const value = name === 'image'
        ? event.target.files[0]
        : event.target.value

        this.productData.set(name, value)
        this.setState({ [name]: value })
    }

    clickSubmit = () => {
        const jwt = auth.isAuthenticated()

        create(
            {shopId: this.match.params.shopId},
            {t: jwt.token},
            this.productData   
        )
        .then( data => {
            if (data.error) this.setState({error: data.error})
            else this.setState({error: '', redirect: true})
        })
    }


    render() {
        const {classes} = this.props;

        if (this.state.redirect) {
            return (<Redirect to={'/seller/shop/edit/'+this.match.params.shopId}/>)
        }

        return(
            <div>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography type='headline' component='h2' className={classes.title}>
                            New Product
                        </Typography> <br/>
                        <input 
                            accept='image/*'
                            type='file' 
                            onChange={ event => this.handleChange(event, 'image') } 
                            className={classes.input} 
                            id='icon-button-file' 
                        />
                        <label htmlFor='icon-button-file'>
                            <Button color='secondary' variant='contained' component='span'>
                                Upload Photo
                                <PhotoCameraIcon/>
                            </Button>
                        </label>
                        <span className={classes.filename}>{this.state.image ? this.state.image.name : ''}</span><br/>
                        <TextField 
                            id='name' 
                            label='Name' 
                            className={classes.textField} 
                            value={this.state.name}
                            onChange={ event => this.handleChange(event, 'name') }
                            margin='normal'
                        /> <br/>
                        <TextField 
                            id='multiline-flexible'
                            label='Description'
                            multiline
                            rows='2'
                            value={this.state.description}
                            onChange={ event => this.handleChange(event, 'description') }
                            className={classes.textField}
                            margin='normal'
                        /> <br/>
                        <TextField 
                            id='category'
                            label='Category'
                            value={this.state.category}
                            onChange={ event => this.handleChange(event, 'category') }
                            className={classes.textField}
                            margin='normal'
                        /> <br/>
                        <TextField 
                            id='quantity'
                            label='Quantity'
                            value={this.state.quantity}
                            onChange={ event => this.handleChange(event, 'quantity') }
                            className={classes.textField}
                            margin='normal'
                        /> <br/>
                        <TextField 
                            id='price'
                            label='Price'
                            value={this.state.price}
                            onChange={ event => this.handleChange(event, 'price') }
                            className={classes.textField}
                            margin='normal'
                        /> <br/>
                        {
                            this.state.error && (
                                <Typography component='p' color='error'>
                                    <Icon color='error' className={classes.error}>error</Icon>
                                    {this.state.error}
                                </Typography> )
                        }
                    </CardContent>
                    <CardActions>
                        <Button color='primary' variant='contained' onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
                        <Link to={'/seller/shop/edit/'+this.match.params.shopId} className={classes.submit}>
                            <Button variant="contained">Cancel</Button>
                        </Link>
                    </CardActions>
                </Card>
            </div>
        )
      }
  }


  /* To validate the required injection of style declarations as props to the component, we add
the PropTypes requirement validator to the defined component.
*/
NewProduct.propTypes = { classes: PropTypes.object.isRequired }

/*
Exporting the component with the defined styles passed in using withStyles from Material-UI.
Using withStyles like this creates a Higher-Order Component(HOC) that has access to the defined
style objects as props.
*/  
export default withStyles(styles)(NewProduct)
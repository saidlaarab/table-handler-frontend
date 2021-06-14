import React, {Component} from 'react';
import SkyLight from 'react-skylight';
import {Button, TextField} from '@material-ui/core';

class AddItem extends Component {
    constructor(props) {
        super(props);
        this.state = {id: null , reference:'', occurrence:'', index:'', affectation:''}
    }

    handleChange = (e) => {
        if(e.target.name === "occurrence" && isNaN(e.target.value)){
            this.setState({[e.target.name]: 0});    
        }
        this.setState({[e.target.name]: e.target.value});
    }

    handleSave = (e) => {
        e.preventDefault();

        const newItem = {
                        reference: this.state.reference,
                        occurrence: this.state.occurrence,
                        index:  this.state.index,
                        affectation: this.state.affectation
                       };

        this.props.addItem(newItem);
        this.refs.addDialog.hide();
    };

    handleCancel = (e) =>{
        e.preventDefault();
        this.refs.addDialog.hide();
    };
    
    render() { 
        return ( 
        <React.Fragment>
            <SkyLight hideOnOverlayClicked ref='addDialog'>
                <h3>Add a new Item</h3>
                <form>
                    <TextField label='Référence' placeholder='Référence' name='reference' onChange={this.handleChange}/><br/>
                    <TextField label='Occurrence' placeholder='Occurrence' name='occurrence' type = "number" onChange={this.handleChange}/><br/>
                    <TextField label='Index' placeholder='Index'  name='index'  onChange={this.handleChange}/><br/>
                    <TextField label='Affectation' placeholder='Affectation' name='affectation' onChange={this.handleChange}/><br/>
                    <div>
                        <Button variant='outlined' color='primary' onClick={this.handleSave} style={{minWidth:'92px'}}> Save </Button>
                        <Button variant='outlined' color='secondary' onClick={this.handleCancel}>Cancel</Button>
                    </div>
                </form>
            </SkyLight>
            <Button variant='contained' color='primary' onClick={() => this.refs.addDialog.show()}
                    style={{margin: '10px'}}            
            >
                Add New Item
            </Button>
        </React.Fragment> );
    }
}
 
export default AddItem;
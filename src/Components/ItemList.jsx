import React, {Component} from 'react'; 
import {SERVER_URL} from '../constants';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import AddItem from './AddItem';
import {CSVLink} from 'react-csv';
import {Button, Grid} from '@material-ui/core';

import {Snackbar} from '@material-ui/core';

class ItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {items: [], open:false, message:''};
    }

    fetchItems = () =>{
        // const token = sessionStorage.getItem("jwt");

        fetch(SERVER_URL+'/items',{
            // headers:{
            //     "Authorization" : token
            // }
        })
        .then((response) => response.json())
        .then((responseData) => {
            
            this.setState({items: responseData});
        
        })
        .catch(err => console.error(err));
    };

    addItem = (item) => {
        // const token = sessionStorage.getItem("jwt");

        fetch(SERVER_URL + '/items',
            { method: 'POST',
              headers: {
                  'Content-Type' : 'application/json'
                //   'Authorization': token
                },
              body: JSON.stringify(item)
            }
        )
        .then( result  => {
            this.fetchItems();
            this.setState({open:true, message:'Item successfully added.'});
        })
        .catch(err => console.log('Can\'t add the new item! ' + err));

    };

    renderEditable = (cellInfo) => {
        return(
            <div
                contentEditable
                suppressContentEditableWarning
                
                onBlur = { e =>{
                        const data = [...this.state.items];
                        data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                        this.setState({items: data});
                    }
                }
                
                dangerouslySetInnerHTML = {
                    {__html:this.state.items[cellInfo.index][cellInfo.column.id]}
                }

                style = {{backgroundColor: '#fafafa'}}
            />
        );
    };

    componentDidMount() {
        this.fetchItems();
    }
        
    deleteItem = (id) =>{

        // const token = sessionStorage.getItem("jwt");
        const link = SERVER_URL + '/items/' + id;

        fetch(link, {
            method: 'DELETE'
            // headers:{
            //     'Authorization': token
            // }
        })
        .then(result => {
            this.fetchItems(); // update the item list
            this.setState({open:true, message:'Item deleted.'});
        })
        .catch(err => this.setState({open:true, message:'Deletion failed.'}));
    };

    updateItem = (item) =>{
        
        // const token = sessionStorage.getItem("jwt");
        var link = SERVER_URL + '/items/';
        fetch(link,{
            method:'PUT',
            headers:{
                'Content-Type' : 'application/json'
            //     'Authorization' : token 
            },
            body:JSON.stringify(item)
        })
        .then(result => {
            this.fetchItems(); // update the item list
            this.setState({open:true, message:'Item updated.'});
        })
        .catch(err => this.setState({open:true, message:'Update failed!'}));
    };

    handleClose = () => this.setState({open:false});

    handleLogout = () => {
        this.props.logout();
    };

    render() { 
        const columns = [{
            Header: 'ID',
            accessor:'id'
        },{
            Header: 'Référence',
            accessor:'reference',
            Cell: this.renderEditable
        },{
            Header: 'Occurrence',
            accessor:'occurrence',
            Cell: this.renderEditable
        },{
            Header: 'Index',
            accessor:'index',
            Cell: this.renderEditable
        },{
            Header: 'Affectation',
            accessor: 'affectation',
            Cell: this.renderEditable
        
        },{
            id: 'updateButton',
            sortable:false,
            filterable:false,
            width:100,
            // accessor:'_links.self.href',
            Cell:({row}) => <Button size='small' variant='text' color='primary' className='btn btn-info btn-link'
            onClick={() => this.updateItem(row)}>Update</Button>
        },{
            id: 'delButton',
            sortable:false,
            filterable:false,
            width:100,
            accessor:'id',
            Cell:({value}) => <Button size='small' variant='text' color='secondary' className='btn btn-info btn-link'
            onClick={() => this.deleteItem(value)}>Delete</Button>
        }];

        return (<div>
            <Grid container>
                <Grid item style={{padding:'10px'}}>
                    <AddItem addItem={this.addItem} />
                </Grid>
                <Grid item style={{padding:'20px', textDecoration:'none', lineHeight:'36px'}}>
                    <CSVLink data={this.state.items} separator=';'>Export into CSV file</CSVLink>
                </Grid>
                <Grid item style={{padding:'20px'}}>
                    <Button variant='contained'
                            color='secondary'
                            // onClick={this.handleLogout}
                    >
                        Logout
                    </Button>
                </Grid>
            </Grid>

            <ReactTable 
                data={this.state.items}
                columns={columns}
                filterable={true}
                defaultPageSize={10}
            />
            <Snackbar
                style = {{width:'300', color:'green'}}
                open = {this.state.open}
                onClose = {this.handleClose}
                autoHideDuration = {2000}
                message = {this.state.message}
            />
        </div>);
    }
}
 
export default ItemList;
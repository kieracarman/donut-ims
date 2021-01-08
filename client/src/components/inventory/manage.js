import React, {Component} from 'react';
import axios from 'axios';
import { ReactSortable } from 'react-sortablejs';
import { List } from 'react-bootstrap-icons';

export default class UpdateList extends Component {
  constructor(props) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeUnit = this.onChangeUnit.bind(this);
    this.onChangeQuantity = this.onChangeQuantity.bind(this);
    this.onChangeZone = this.onChangeZone.bind(this);
    this.onChangeMinimumQuantity = this.onChangeMinimumQuantity.bind(this);
    this.onChangeDefaultOrder = this.onChangeDefaultOrder.bind(this);
    this.onChangeVendor = this.onChangeVendor.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.removeItem = this.removeItem.bind(this);

    this.state = {
      inventory: [],
      newItemName: '',
      newItemUnit: '',
      newItemQuantity: '',
      newItemZone: '',
      newItemMinimumQuantity: '',
      newItemDefaultOrder: '',
      newItemVendor: '',
      isSorting: false,
    }
  }

  // Starting lifecycle and calling for data from database
  componentDidMount() {
    axios.get('/api/inv/') 
      .then(response => {
        this.setState({inventory: response.data});
      })
      .catch(function (error) {
        console.log(error);
      })
  }

    // Function to change name state value
  onChangeName(e) {
    this.setState({
      newItemName: e.target.value
    });
  }

  // Function to change unit state value
  onChangeUnit(e) {
    this.setState({
      newItemUnit: e.target.value
    });
  }

  // Function to change quantity state value
  onChangeQuantity(e) {
    this.setState({
      newItemQuantity: e.target.value
    });
  }

  // Function to change zone state value
  onChangeZone(e) {
    this.setState({
      newItemZone: e.target.value
    });
  }

  // Function to change minimum quantity state value
  onChangeMinimumQuantity(e) {
    this.setState({
      newItemMinimumQuantity: e.target.value
    });
  }

  // Function to change default order state value
  onChangeDefaultOrder(e) {
    this.setState({
      newItemDefaultOrder: e.target.value
    });
  }

  // Function to change vendor state value
  onChangeVendor(e) {
    this.setState({
      newItemVendor: e.target.value
    });
  }

  // Helping function to change state value, since it is an array
  // it must be copied before modifying
  onChangeItem(id) {
    // Creating copy of current inventory state and
    // concatenating new object
    const holderArray = this.state.inventory.concat({
      _id: id,
      name: this.state.newItemName,
      unit: this.state.newItemUnit,
      quantity: this.state.newItemQuantity,
      zone: this.state.newItemZone,
      minimumQuantity: this.state.newItemMinimumQuantity,
      defaultOrder: this.state.newItemDefaultOrder,
      vendor: this.state.newItemVendor
    })

    // Setting new state
    this.setState({
      inventory: holderArray
    })
  }

  onDeleteItem(index) {
    // Creating copy of current inventory state
    const holderArray = this.state.inventory.slice()

    // Removing chosen item from array
    holderArray.splice(index, 1)

    // Setting new state
    this.setState({
      inventory: holderArray
    })
  }

  // Function called when button is pressed
  async onSubmit(e) {
    e.preventDefault()

    const newItem = {
      name: this.state.newItemName,
      unit: this.state.newItemUnit,
      quantity: this.state.newItemQuantity,
      zone: this.state.newItemZone,
      minimumQuantity: this.state.newItemMinimumQuantity,
      defaultOrder: this.state.newItemDefaultOrder,
      vendor: this.state.newItemVendor,
    }

    await axios.post('/api/inv/', newItem)
      .then(res => {
        this.onChangeItem(res.data.id);
        console.log(res.data.message);
      })

    this.setState({
      newItemName: '',
      newItemUnit: '',
      newItemQuantity: '',
      newItemZone: '',
      newItemMinimumQuantity: '',
      newItemDefaultOrder: '',
      newItemVendor: '',
    })
  }

  // Function called when button is pressed
  async removeItem(id, index) {
    // After patch has been confirmed to database
    // change state to change component
    await axios.delete('/api/inv/' + id) 
      .then(res => {
        // Helper function to remove item from state
        this.onDeleteItem(index)
        console.log(res.data.message)
      });
  }
  
  updateList(newState) {
    // Check if we are still sorting
    if (!this.state.isSorting) return;
    this.setState({
      isSorting: false
    })

    // Create a new array from the sorted array returned from sorting function
    const sortedList = newState.slice()

    // Update sortIndex to match new sort
    sortedList.forEach((item, index) => {
      item.sortIndex = index
    });

    // Create a new array of ids with their sort index to send to backend
    const sortData = sortedList.map((item) => {
      return({
        id: item._id,
        sortIndex: item.sortIndex
      });
    });
    
    // Call function to send sort data to backend
    this.sendSortedList(sortData);

    // Update state with new sorted inventory list
    this.setState({
      inventory: sortedList
    })
  }

  async sendSortedList(list) {
    await axios.patch('/api/inv/', list)
      .then(res => {
        console.log(res.data.message);
      });
  }

  // Mapping out GET data
  listItems() {
    return this.state.inventory.map((item, index) => {
        return(
          <tr key={item._id}>
            <td><List className='drag-handle' /></td>
            <td className='text-left'>{item.name}</td>
            <td>{item.unit}</td>
            <td>{item.quantity}</td>
            <td>{item.zone}</td>
            <td>{item.minimumQuantity}</td>
            <td>{item.defaultOrder}</td>
            <td>{item.vendor}</td>
            <td>
              <button type="button" id='btnDelete' className="btn-block btn-danger btn" onClick={ () =>
                window.confirm("Are you sure you want to delete this item?") &&
                this.removeItem(item._id, index)}>Remove</button>
            </td>
          </tr>
        );
      })
  }

  render() {
    return (
      <div className="container">
        <h2>New Item</h2>
        <form onSubmit={this.onSubmit}>
          <table className="table table-borderless">
            <thead>
              <tr>
                <th className='text-left' style={{width: '29%'}}>Item</th>
                <th style={{width: '10%'}}>Unit</th>
                <th style={{width: '7%'}}>Quantity</th>
                <th style={{width: '12%'}}>Zone</th>
                <th style={{width: '7%'}}>MinQty</th>
                <th style={{width: '7%'}}>Default</th>
                <th className='text-left' style={{width: '20%'}}>Vendor</th>
                <th style={{width: '5%'}}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="text" className="form-control" value={this.state.newItemName} onChange={this.onChangeName}/></td>
                <td><input type="text" className="form-control" value={this.state.newItemUnit} onChange={this.onChangeUnit}/></td>
                <td><input type="number" className="form-control" value={this.state.newItemQuantity} onChange={this.onChangeQuantity}/></td>
                <td><input type="text" className="form-control" value={this.state.newItemZone} onChange={this.onChangeZone}/></td>
                <td><input type="number" className="form-control" value={this.state.newItemMinimumQuantity} onChange={this.onChangeMinimumQuantity}/></td>
                <td><input type="number" className="form-control" value={this.state.newItemDefaultOrder} onChange={this.onChangeDefaultOrder}/></td>
                <td><input type="text" className="form-control" value={this.state.newItemVendor} onChange={this.onChangeVendor}/></td>
                <td><input type="submit" value="Add" className="btn btn-block btn-success"/></td>
              </tr>
            </tbody>
          </table>
        </form>
        <br />
        <h2>Edit Items</h2>
        <table className="table table-striped table-bordered table-hover" style={{marginTop:20}}>
          <thead>
            <tr>
              <th style={{width: '3%'}}></th>
              <th className='text-left' style={{width: '26%'}}>Item Name</th>
              <th style={{width: '7%'}}>Unit</th>
              <th style={{width: '10%'}}>Quantity</th>
              <th style={{width: '15%'}}>Zone</th>
              <th style={{width: '7%'}}>MinQty</th>
              <th style={{width: '7%'}}>Default</th>
              <th style={{width: '20%'}}>Vendor</th>
              <th style={{width: '5%'}}></th>
            </tr>
          </thead>
          <ReactSortable
            handle='.drag-handle'
            animation={150}
            direction='vertical'
            delay={2}
            delayOnTouchOnly={true}
            tag='tbody'
            list={this.state.inventory}
            onUpdate={() => this.setState({ isSorting: true })}
            setList={(newState) => this.updateList(newState)}
          >
            {this.listItems()}
          </ReactSortable>
        </table> 
        <footer style={{marginTop:"70px"}}>
        </footer>
      </div>
    )
  }
}

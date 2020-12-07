import React, {Component} from 'react';
import axios from 'axios';

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
      currentPage: 1,
      paginationCount: 40,
    }
  }

  // Starting lifecycle and calling for data from database
  componentDidMount() {
    axios.get('/inv/')
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

    await axios.post('/inv/', newItem)
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
    await axios.delete('/inv/' + id)
      .then(res => {
        // Helper function to remove item from state
        this.onDeleteItem(index)
        console.log(res.data.message)
      });
  }

  // Function call for previous page button
  previousPage = () => {
    if (this.state.currentPage !== 1) {
      this.setState({
        currentPage: this.state.currentPage - 1
      })
    }
  }

  // Function call for next page button
  nextPage = () => {
    if (this.state.currentPage + 1 <= Math.ceil(this.state.inventory.length/this.state.paginationCount)) {
      this.setState((prevState) => ({currentPage: (prevState.currentPage + 1)}))
    }
  }

  // Mapping out GET data
  inventoryList() {
    // Slicing data for table pagination
    return this.state.inventory.slice(
      (this.state.paginationCount * (this.state.currentPage - 1)),
      (this.state.paginationCount * (this.state.currentPage))).map((inventory, index) => {
        return(
          <tr key={inventory._id}>
            <td>{inventory.name}</td>
            <td className="text-center">{inventory.unit}</td>
            <td className="text-center">{inventory.quantity}</td>
            <td className="text-center">{inventory.zone}</td>
            <td className="text-center">{inventory.minimumQuantity}</td>
            <td className="text-center">{inventory.defaultOrder}</td>
            <td className="text-center">{inventory.vendor}</td>
            <td>
              <button type="button" id='btnDelete' className="btn-block btn-danger btn" onClick={ e =>
                window.confirm("Are you sure you want to delete this item?") &&
                this.removeItem(inventory._id, index)}>Remove</button>
            </td>
          </tr>
        );
      })
  }

  render() {
    // Conditional setup for rendering previous/next page button
    let previousEligible = false
    if (this.state.currentPage <= 1) {
      previousEligible = false
    }
    else {
      previousEligible = true
    }

    let nextEligible = true
    if (this.state.currentPage + 1 > Math.ceil(this.state.inventory.length/this.state.paginationCount)) {
      nextEligible = false
    }
    else {
      nextEligible = true
    }

    return (
      <div className="container">
        <h3>New Item</h3>
        <form onSubmit={this.onSubmit}>
          <table className="table table-borderless">
            <thead>
              <th style={{width: '32%'}}>Item</th>
              <th style={{width: '10%'}}>Unit</th>
              <th style={{width: '7%'}}>Quantity</th>
              <th style={{width: '12%'}}>Zone</th>
              <th style={{width: '7%'}}>MinQty</th>
              <th style={{width: '7%'}}>Default</th>
              <th style={{width: '20%'}}>Vendor</th>
              <th style={{width: '5%'}}></th>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="text" className="form-control" value={this.state.newItemName} onChange={this.onChangeName}/>
                </td>
                <td>
                  <input type="text" className="form-control" value={this.state.newItemUnit} onChange={this.onChangeUnit}/>
                </td>
                <td>
                  <input type="number" className="form-control" value={this.state.newItemQuantity} onChange={this.onChangeQuantity}/>
                </td>
                <td>
                  <input type="text" className="form-control" value={this.state.newItemZone} onChange={this.onChangeZone}/>
                </td>
                <td>
                  <input type="number" className="form-control" value={this.state.newItemMinimumQuantity} onChange={this.onChangeMinimumQuantity}/>
                </td>
                <td>
                  <input type="number" className="form-control" value={this.state.newItemDefaultOrder} onChange={this.onChangeDefaultOrder}/>
                </td>
                <td>
                  <input type="text" className="form-control" value={this.state.newItemVendor} onChange={this.onChangeVendor}/>
                </td>
                <td>
                  <input type="submit" value="Add" className="btn btn-block btn-success"/>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <br />
        <h3>Edit Items</h3>
        <table className="table table-striped table-bordered table-hover" style={{marginTop:20}}>
          <thead>
            <tr>
              <th style={{width: '32%'}}>Item Name</th>
              <th style={{width: '7%'}}>Quantity</th>
              <th style={{width: '10%'}}>Unit</th>
              <th style={{width: '12%'}}>Zone</th>
              <th style={{width: '7%'}}>MinQty</th>
              <th style={{width: '7%'}}>Default</th>
              <th style={{width: '20%'}}>Vendor</th>
              <th style={{width: '5%'}}></th>
            </tr>
          </thead>
          <tbody>
            {this.inventoryList()}
          </tbody>
        </table> 
        {previousEligible && <button className="btn btn-info" onClick={this.previousPage}>Previous Page</button>}
        {nextEligible && <button className="btn btn-info" onClick={this.nextPage} style={{float: 'right'}}>Next Page</button>}
        
        <footer style={{marginTop:"70px"}}>
        </footer>
      </div>
    )
  }
}

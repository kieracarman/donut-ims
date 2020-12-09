import React, {Component} from 'react';
import axios from 'axios';

export default class UpdateList extends Component {
  constructor(props) {
    super(props);

    this.updateQuantity = this.updateQuantity.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);

    this.state = {
      inventory: [],
      amount: '',
      currentPage: 1,
      paginationCount: 40,
      errors: {}
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

  // Helper function to change state value
  onChangeAmount(e) {
    this.setState({
      amount: e.target.value
    });
  }

  // Helper function to change state value, since it is an array
  // we must create copy and modify copy
  onChangeQuantity(e, index) {
    const newQuantity = this.state.inventory.slice()
    newQuantity[index].quantity = e
    this.setState({
      inventory: newQuantity
    })
  }

  // Function called when button is pressed
  async updateQuantity(id, amount, index) {
    var newQuantity = Number(amount)
    if (newQuantity < 0) {
      alert("Inventory cannot be less than 0")
    }
    // Setting up object to be sent in patch request
    const obj = {
      quantity: newQuantity
    }

    // After patch has been confirmed to database change state to change component
    await axios.patch('/inv/'+id, obj)
      .then(res => {
        this.onChangeQuantity(newQuantity, index)
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

  // Mapping out GET data and creating input/buttons
  listItems() {
    // Slicing data for pagination table
    return this.state.inventory.slice(
      (this.state.paginationCount * (this.state.currentPage - 1)),
      (this.state.paginationCount * (this.state.currentPage))).map((inventory, index) => {
        return(
          <tr key={inventory._id}>
            <td>{inventory.name}</td>
            <td className="text-center">{inventory.quantity}</td>
            <td className="text-center">{inventory.unit}</td>
            <td>
              <input type='number' className="form-control" onChange={this.onChangeAmount} />
            </td>
            <td>
              <div className="btn-toolbar">
                <button type="button" id='btnUpdate' className="btn-block btn-primary btn" onClick={() => this.updateQuantity(inventory._id, this.state.amount, index)}>Update</button>
              </div>
            </td>
          </tr>
        );
      })
  }

  // Mapping out GET data to make a separate table for each zone
  listZones() {
    // Slicing data for pagination table
    return this.state.inventory.slice(
      (this.state.paginationCount * (this.state.currentPage - 1)),
      (this.state.paginationCount * (this.state.currentPage))).map((inventory, index) => {
        return(
          <h4>{inventory.zone}</h4>
        );
      })
  }

  render() {
    // Conditional setup for rendering previous/next page buttons
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
        <h3>Update Inventory</h3>
        <table className="table table-striped table-bordered table-hover" style={{marginTop:20}}>
          <thead>
            <tr>
              <th style={{width: '74%'}}>Item</th>
              <th style={{width: '7%'}}>Quantity</th>
              <th style={{width: '5%'}}>Unit</th>
              <th style={{width: '7%'}}>Update</th>
              <th style={{width: '7%'}}></th>
            </tr>
          </thead>
          <tbody>
            {this.listItems()}
          </tbody>
        </table>
        {previousEligible && <button className="btn btn-info" onClick={this.previousPage}>Previous Page</button>}
        {nextEligible && <button className="btn btn-info" onClick={this.nextPage} style={{float: 'right'}}>Next Page</button>}
      </div>
    )
  }
}

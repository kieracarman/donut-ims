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

  // Mapping out items from GET data and creating input/buttons
  listItems(zone) {
    const filteredByZone = this.state.inventory.filter(obj => obj.zone === zone);
    return filteredByZone.map((inventory, index) => {
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
    const zones = [...new Set(this.state.inventory.map(z => z.zone))];
    return zones.map((z, index) => {
      return(
        <div key={index}>
          <h3>{z}</h3>
          <table className="table table-striped table-bordered table-hover" style={{marginTop:20}}>
            <thead>
              <tr>
                <th style={{width: '72%'}}>Item</th>
                <th style={{width: '7%'}}>Quantity</th>
                <th style={{width: '7%'}}>Unit</th>
                <th style={{width: '7%'}}>Update</th>
                <th style={{width: '7%'}}></th>
              </tr>
            </thead>
            <tbody>
              {this.listItems(z)}
            </tbody>
          </table>
          <br />
        </div>
      );
    })
  }

  render() {
    return (
      <div className="container">
        <h2>Update Inventory</h2>
        <br />
        {this.listZones()}
      </div>
    )
  }
}

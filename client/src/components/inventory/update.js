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
    axios.get('/api/inv/')
      .then(response => {
        this.setState({inventory: response.data});
      })
      .catch((error) => {
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
  onChangeQuantity(id, e) {
    const newQuantity = this.state.inventory.slice()
    const index = Number(this.state.inventory.findIndex(x => x._id === id))
    newQuantity[index].quantity = e
    this.setState({
      inventory: newQuantity
    })
  }

  // Function called when button is pressed
  async updateQuantity(id, amount) {
    var newQuantity = Number(amount)
    if (newQuantity < 0) {
      alert("Inventory cannot be less than 0")
    }
    // Setting up object to be sent in patch request
    const obj = {
      quantity: newQuantity
    }
    
    // After patch has been confirmed to database change state to change component
    await axios.patch(`/api/inv/${id}`, obj) 
      .then(res => {
        this.onChangeQuantity(id, newQuantity)
        console.log(res.data.message)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  // Mapping out items from GET data and creating input/buttons
  listItems(zone) {
    const filteredByZone = this.state.inventory.filter(obj => obj.zone === zone);
    return filteredByZone.map((item, index) => {
      return(
        <tr key={item._id}>
          <td>{item.name}</td>
          <td className="text-center">{item.quantity}</td>
          <td className="text-center">{item.unit}</td>
          <td>
            <input type='number' className="form-control" onChange={this.onChangeAmount} />
          </td>
          <td>
            <div className="btn-toolbar">
              <button type="button" id='btnUpdate' className="btn-block btn-primary btn" onClick={
              () => this.updateQuantity(item._id, this.state.amount)
              }>Update</button>
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

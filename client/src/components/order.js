import React, {Component} from 'react';
import axios from 'axios';

export default class UpdateList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inventory: [],
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

  // Mapping out items from GET data and creating input/buttons
  listItems(vendor) {
    const itemsNeedingReorder = this.state.inventory.filter(obj => obj.quantity <= obj.minimumQuantity);
    const filteredByVendor = itemsNeedingReorder.filter(obj => obj.vendor === vendor);
    return filteredByVendor.map((inventory, index) => {
      return(
        <tr key={inventory._id}>
          <td>{inventory.name}</td>
          <td className="text-center">{inventory.defaultOrder}</td>
          <td className="text-center">{inventory.unit}</td>
        </tr>
      );
    })
  }

  // Mapping out GET data to make a separate table for each zone
  listVendors() {
    const vendors = [...new Set(this.state.inventory.map(v => v.vendor))];
    return vendors.map((v, index) => {
      return(
        <div key={index}>
          <h3>{v}</h3>
          <table className="table table-striped table-bordered table-hover" style={{marginTop:20}}>
            <thead>
              <tr>
                <th style={{width: '80%'}}>Item</th>
                <th style={{width: '10%'}}>Order</th>
                <th style={{width: '10%'}}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {this.listItems(v)}
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
        {this.listVendors()}
      </div>
    )
  }
}

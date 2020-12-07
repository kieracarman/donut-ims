const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  zone: { type: String, required: true },
  minimumQuantity: { type: Number, required: true },
  defaultOrder: { type: Number, required: true },
  vendor: { type: String, required: true },
});

module.exports = mongoose.model('Inventory', inventorySchema);

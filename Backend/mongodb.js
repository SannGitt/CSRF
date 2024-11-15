const mongoose = require('mongoose');

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/proj')
  .then(() => {
    console.log('Mongoose connected');
  })
  .catch(e => {
    console.log('Failed to connect to MongoDB', e);
  });

// Define the login schema
const logInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  walletBalance: {
    type: Number,
    default: 5000, // Default wallet balance on signup
  },
});

// Create the login collection
const LogInCollection = mongoose.model('LogInCollection', logInSchema);

// Define the product schema
const productSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true, // Description is required
  },
  price: {
    type: Number,
    required: true, // Price is required
    min: 0, // Price cannot be negative
  },
});

// Create the product collection
const ProductCollection = mongoose.model('ProductCollection', productSchema);

// Export the models
module.exports = {
  LogInCollection,
  ProductCollection,
};

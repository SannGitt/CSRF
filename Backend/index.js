const express = require('express');
const path = require('path');
const cors = require('cors');
const { LogInCollection, ProductCollection } = require('./mongodb');

const app = express();
const port = process.env.PORT || 4200;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../fontend/build')));

// Handle any other requests by serving the React app's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../fontend/build'));
});

// Handle signup
app.post('/signup', async (req, res) => {
  const { name, password } = req.body;

  // Check for empty fields
  if (!name || !password) {
    return res.status(400).json({ message: 'Name and password are required' });
  }

  const data = { name, password, walletBalance: 5000 }; // Default wallet balance on signup

  try {
    const existingUser = await LogInCollection.findOne({ name });

    if (existingUser) {
      if (existingUser.password === password) {
        res.send('User details already exist');
      } else {
        res.send('User already exists with a different password');
      }
    } else {
      await LogInCollection.insertMany([data]);
      res.status(201).json({
        message: 'User created successfully',
        walletBalance: data.walletBalance,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

// Handle login
app.post('/login', async (req, res) => {
  try {
    const user = await LogInCollection.findOne({ name: req.body.name });

    if (user) {
      if (user.password === req.body.password) {
        res.status(200).json({
          message: 'Login successful',
          name: req.body.name,
          walletBalance: user.walletBalance, // Send wallet balance with login response
        });
      } else {
        res.status(401).send('Incorrect password');
      }
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

// Handle adding products to the cart (simulated for now)
app.post('/add-to-cart', async (req, res) => {
  const { name, productId, quantity } = req.body;

  try {
    const product = await ProductCollection.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cartItem = { productId: product._id, price: product.price, quantity };

    // Simulate cart logic for now, can be extended to persist cart in DB
    res.status(200).json({ message: 'Product added to cart', cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while adding to cart' });
  }
});

// Handle checkout
app.post('/checkout', async (req, res) => {
  const { name, totalAmount } = req.body; // Extract name and total amount from request

  try {
    // Find the user in the database
    const user = await LogInCollection.findOne({ name });

    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Send error if user is not found
    }

    // Check if the user has enough balance
    if (user.walletBalance >= totalAmount) {
      // Deduct the total amount from the user's wallet balance
      user.walletBalance -= totalAmount;
      await user.save(); // Save the updated user back to the database

      return res.status(200).json({
        remainingBalance: user.walletBalance, // Send remaining balance back to frontend
      });
    } else {
      return res.status(400).json({ message: 'Insufficient wallet balance' }); // Handle insufficient balance
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during checkout' });
  }
});

// Product management
app.post('/add-product', async (req, res) => {
  const { description, price } = req.body;

  const newProduct = new ProductCollection({
    description,
    price,
  });

  try {
    await newProduct.save();
    res.status(201).send('Product added successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while adding the product');
  }
});


// Handle password change
app.post('/change-password', async (req, res) => {
  const { name, currentPassword, newPassword, confirmPassword } = req.body;

  try {
    // Find the user in the database by name
    const user = await LogInCollection.findOne({ name });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current password matches
    if (user.password !== currentPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }

    // Update the user's password
    user.password = newPassword;
    await user.save(); // Save the updated user with the new password

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while changing the password' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

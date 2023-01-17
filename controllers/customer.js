const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const bcrypt = require('bcrypt');

function generateAccessToken(id) {
    return jwt.sign({ customer: id }, 'Shashank');
}

exports.register = async (req, res) => {
    let { email, name, phoneNumber, profilePic, password } = req.body;
  

    // Check if user already exists
    const existingUser = await Customer.find({ where: { email: email } });
    if (existingUser) {
        return res.status(500).json({ message: "user already exists" });
    }

    // Hash the password before storing it in the database
    const saltRounds = 10;
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        await Customer.create({ email, name, phoneNumber, profilePic, password: hash });
        res.status(201).json({ message: 'Successfully created' });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Registration failed, please try again later'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ err: "bad parameters . something is missing" });
        }

        const user = await Customer.findAll({ where: { email: email } });
        if (!user) {
            return res.status(404).json({ message: "user doesn't exist" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: "Password is incorrect" });
        }

        const token = generateAccessToken(user.id);
        res.status(200).json({ success: true, message: "user is successfully logged in", token });
    } catch (err) {
        res.status(500).json({ success: false, message: "something went wrong" });
    }
};

exports.updateCustomer = async (req, res) => {
    let { name, phoneNumber, profilePic } = req.body;
    try {
        const updatedCustomer = await Customer.update({ name, phoneNumber, profilePic }, { where: { id: req.params.id } });
        res.status(201).json({ success: true, message: 'Customer updated successfully', updatedCustomer });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Failed to update customer, please try again later' });
    }
};

exports.viewCustomer = (req, res) => {
    Customer.findAll({ where: { id: req.params.id } })
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'Customer found',
              
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                success: false,
                message: 'Failed to find customer, please try again later'
            });
        });
};

exports.viewAllCustomers = (req, res) => {
    Customer.findAll()
        .then(customers => {
            res.status(200).json({
                success: true,
                message: 'Customers found',
                customers
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                success: false,
                message: 'Failed to find customers, please try again later'
            });
        });
};

exports.deleteCustomer = (req, res) => {
    Customer.destroy({ where: { id: req.params.id } })
        .then(customer => {
            res.status(204).json({
                success: true,
                message: 'Customer deleted successfully',
                customer
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                success: false,
                message: 'Failed to delete customer, please try again later'
            });
        });
};

exports.activateDeactivateCustomer = (req, res) => {
    Customer.findOne({ where: { id: req.params.id } })
        .then(customer => {
            customer.update({ isActive: !customer.isActive })
                .then(customer => {
                    res.status(201).json({
                        success: true,
                        message: customer.isActive ? 'Customer activated' : 'Customer deactivated',
                        customer
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json({
                        success: false,
                        message: 'Failed to activate/deactivate customer, please try again later'
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Failed to find customer, please try again later'
            });
        });
};
           
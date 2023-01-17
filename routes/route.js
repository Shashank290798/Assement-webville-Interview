const express = require('express');

const customerController = require('../controllers/customer');

const middleware = require('../middleware/auth')


const router = express.Router();
router.post('/register', customerController.register);

router.post('/login', customerController.login);

router.put('/update/:id',middleware.authenticate, customerController.updateCustomer);

router.get('/view/:id',middleware.authenticate, customerController.viewCustomer);

router.get('/viewAll',middleware.authenticate, customerController.viewAllCustomers);

router.delete('/delete/:id',middleware.authenticate, customerController.deleteCustomer);

router.put('/activateDeactivate/:id',middleware.authenticate, customerController.activateDeactivateCustomer);

module.exports = router;
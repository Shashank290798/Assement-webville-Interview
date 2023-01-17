const jwt = require('jsonwebtoken');

const customer = require('../models/customer')

const authenticate = (req,res,next)=>{
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'Shashank');
        req.customer = decoded.customer;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token is not valid' });
    }
}

module.exports={
    authenticate
}
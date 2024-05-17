const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket');


router.get('/api/ticket-service/get-all-tickets/:page/:user?', async (req, res) => {
    try {
        const page =  parseInt(req.params.page) || 0; 
        const user = req.params.user || false 
        console.log('inside ticket')
        console.log(page);
        const limit = 2;
        let skip = (page - 1) * limit;
        if(skip<0)
            {
                skip = 0
            }
        let total
        let totalCount 
        let findTickets 
        if(user)
        {
            total = await Ticket.find({visibility:true}).countDocuments();
            totalCount = Math.ceil(total / limit);
           findTickets = await Ticket.find({visibility:true}).skip(skip).limit(limit);
        }else
        {
            total = await Ticket.countDocuments();
         totalCount = Math.ceil(total / limit);
        findTickets = await Ticket.find({}).skip(skip).limit(limit);
        }
        
        return res.json({ message: 'Tickets fetched successfully', data: findTickets, totalCount });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});






module.exports = router;

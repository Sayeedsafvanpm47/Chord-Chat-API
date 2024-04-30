const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket');
const { producer } = require('../../../common/src/messaging/producer');
const { consumer } = require('../../../common/src/messaging/consumer');

router.get('/api/ticket-service/get-all-tickets/:page', async (req, res) => {
    try {
        const page = req.params.page;
        console.log(page);
        const limit = 2;
        const skip = (page - 1) * limit;
        const total = await Ticket.find({ visibility: true }).countDocuments();
        let totalCount = Math.ceil(total / limit);
        const findTickets = await Ticket.find({ visibility: true }).skip(skip).limit(limit);

       
    

    

        

        return res.json({ message: 'Tickets fetched successfully', data: findTickets, totalCount });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;

          const cron = require('node-cron')
          const Ticket = require('../models/ticket')

          cron.schedule('0 0 * * * *',async ()=>{
                    try {
                     console.log('checking cron')
                              const currentDate = new Date();
                              const expiredTickets = await Ticket.updateMany(
                              { expiringAt: { $lte: currentDate }, expired: false },
                              {$set:{expired: true,visibility:false } }
                              );
                              console.log(expiredTickets.nModified ? `${expiredTickets.nModified} tickets expired.` : 'No tickets have been modified');
                    } catch (error) {
                              console.error('Error updating expired tickets:', error);
                    }
          },{timezone:'Asia/Kolkata'})

          module.exports = cron 
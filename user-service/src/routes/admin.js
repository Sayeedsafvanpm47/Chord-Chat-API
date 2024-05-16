const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {BadRequestError} = require('chordchat-common')

router.get('/api/user-service/get-all-users/:page',async (req,res)=>{
          try {
                 
                  const page = req.params.page || 1
                  const limit = 10
                  const total = await User.countDocuments()
                  let totalCount = Math.ceil(total/limit)
                  let skip = (page-1) * limit 
                  let users =  await User.find({}).skip(skip).limit(limit)
                  return res.json({message:'Users fetched successfully',data:users,totalCount})

          } catch (error) {
                     throw new BadRequestError('Request failed!')
          }
})

router.patch('/api/user-service/block-user/:id',async (req,res)=>{
          try {
                  
                    const _id = req.params.id 
                    console.log(_id)
                    const findUser = await User.findOne({_id:_id})
                  
                   console.log(findUser,'user deets')
                    if(findUser)
                    {
                            findUser.active = !findUser.active 
                              await findUser.save()
                              return res.json({message:findUser.active ? 'User is unblocked' : 'User is blocked',data:findUser})
                            
                    }else
                    {
                              return res.json({message:'Failed to change the user status'})

                    }
                  
                      
                   
          } catch (error) {
                    console.log(error)
          }
})

router.patch("/api/user-service/toggle-job-view/:id", async (req, res) => {
        try {
                  
                const _id = req.params.id 
                console.log(_id)
                const findUser = await User.findOne({_id:_id})
              
               console.log(findUser,'user deets')
                if(findUser)
                {
                        findUser.jobProfile = !findUser.jobProfile 
                          await findUser.save()
                          return res.json({message:findUser.jobProfile ? 'User job profile active' : 'User job profile hidden',data:findUser})
                        
                }else
                {
                          return res.json({message:'Failed to change the user status'})

                }
              
                  
               
      } catch (error) {
                console.log(error)
      }
      });


      router.get("/api/user-service/get-all-jobs/:page", async (req, res) => {
        try {
          const page = parseInt(req.params.page) || 0;
          console.log(req.currentUser, "currentUser view");
          let jobs;
          let total = await User.find({
                jobProfile: {$in: [true, false]}
            }).countDocuments();
          const limit = 2;
          let skip = (page-1) * limit 
          let totalCount = Math.ceil(total / limit);
          if (page) {
             jobs = await User.find({
                jobProfile: {$in: [true, false]}
            })
              .skip(skip)
              .limit(limit);
           console.log(jobs,'jobs found 1')
      
          } 
        console.log(jobs,'jobs found')
          return res.json({ data: jobs, totalCount });
        } catch (error) {
                console.log(error)
          return res.status(500).json({ message: "Internal server error" });
        }
      });
      

      


module.exports = router 
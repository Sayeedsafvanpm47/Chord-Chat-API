const userRepository = require('../repositories/userRepository')


const findUser = async (id)=>{
          return userRepository.findUser(id)
}

const updateUserProfile = async (id,details)=>{
          return userRepository.updateUserProfile(id,details)
}

const createJob = async (id,details)=>{
          return userRepository.createJob(id,details)
}

const getTotalJobs = async ()=>{
          return userRepository.getTotalJobs()
}

const getJobs = async (id,page)=>{
          return userRepository.getJobs(id,page)
}

const searchJobs = async (searchJobs)=>{
          return userRepository.searchJobs(searchJobs)
}

const deleteJob = async (id)=>{
          return userRepository.deleteJob(id)
}

const findUsers = async (searchTerm)=>{
          return userRepository.findUsers(searchTerm)
}

const toggleFollow = async (sourceId,targetId)=>{
          return userRepository.toggleFollow(sourceId,targetId)
}
module.exports = {
findUser,updateUserProfile,createJob,getTotalJobs,getJobs,searchJobs,deleteJob,findUsers,toggleFollow
}
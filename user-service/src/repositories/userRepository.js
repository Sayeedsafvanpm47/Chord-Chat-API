const User = require("../models/user");

const findUser = async (id) => {
  const findExistingUser = await User.findOne({ _id: id });
  return findExistingUser;
};

const updateUserProfile = async (id, details) => {
  const findExistingUser = await findUser(id);
  if (findExistingUser) {
    const { firstname, lastname, imageData, username, encryptedPassword } =
      details;
    if (firstname) findExistingUser.firstname = firstname;
    if (lastname) findExistingUser.lastname = lastname;
    if (imageData) findExistingUser.image = imageData;
    if (username) findExistingUser.username = username;
    if (encryptedPassword) findExistingUser.password = encryptedPassword;
    await findExistingUser.save();
    return findExistingUser;
  }
};

const createJob = async (id, details) => {
  const findExistingUser = await findUser(id);
  if (findExistingUser) {
    const { description, price, location, instrument } = details;
    if (description) findExistingUser.jobDescription = description;
    if (price) findExistingUser.hiringRate = price;
    if (location) findExistingUser.location = location;
    if (instrument) findExistingUser.instrument = instrument;
    findExistingUser.jobProfile = true;
    await findExistingUser.save();
  }
  return findExistingUser;
};
const getTotalJobs = async()=>{
          const totalJobs = await User.find({ jobProfile: true }).countDocuments();
          const limit = 2;

          let totalCount = Math.ceil(totalJobs / limit);
          return totalCount 
}
const getJobs = async (id, page) => {
 console.log(page,'page in repo')
  const limit = 2;
  if (page) {
    const skip = (page - 1) * limit;
    const jobs = await User.find({ jobProfile: true }).skip(skip).limit(limit);
    return jobs 
    
  } else {
    return false 
  }
};

const searchJobs = async (searchTerm)=>{
          const searchJobs = await User.find({jobDescription:{$regex:searchTerm,$options:"i"}})
          return searchJobs
}

const deleteJob = async (id)=>{
  const findExistingUser = await User.findOne({_id:id})
  if(findExistingUser)
          {
                    findExistingUser.jobDescription = ''
                    findExistingUser.instrument = ''
                    findExistingUser.jobProfile = false 
                    findExistingUser.location = ''
                    await findExistingUser.save()
          }
          return findExistingUser
}

const findUsers = async (searchTerm)=>{
  const findUsers = await User.find({
    email: { $regex: searchTerm, $options: "i" },
  });
  return findUsers 
}

const toggleFollow = async (sourceId,targetId)=>{
  const targetUser = await findUser(targetId)
  console.log(targetUser,'tar')
  const currentUser = await findUser(sourceId)
  console.log(currentUser,'curr')

  if (targetUser && currentUser) {
    const isFollowing = currentUser.idols.includes(targetId);
    console.log(isFollowing,'is following status')

    if (isFollowing) {
      const targetUserIndexInFollowers = targetUser.fans.indexOf(
        sourceId
      );
      console.log(targetUserIndexInFollowers,'target user fans')
      const currentUserIndexInIdols = currentUser.idols.indexOf(targetId);
      console.log(currentUserIndexInIdols,'current user idols')
      targetUser.fans.splice(targetUserIndexInFollowers, 1);
      currentUser.idols.splice(currentUserIndexInIdols, 1);
      await targetUser.save();
      await currentUser.save();
      return 'Unfollowed'
    } else {
      targetUser.fans.push(sourceId);
      currentUser.idols.push(targetId);
      await targetUser.save();
      await currentUser.save();
      return 'Followed'
    }
  }
}
module.exports = {
  findUser,
  updateUserProfile,
  createJob,
  getTotalJobs,
  getJobs,
  searchJobs,
  deleteJob,
  findUsers,
  toggleFollow
};

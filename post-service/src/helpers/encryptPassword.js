const bcrypt = require('bcrypt');
let pass 
async function encryptPassword(password) {
    const saltRounds = 10;
    pass = await bcrypt.hash(password, saltRounds);
    return pass 
}

async function decryptPassword(entered_password,existing_password)
{
          const compareTrue = await bcrypt.compare(entered_password, existing_password);
          if (compareTrue) {
                    return true 
                } 
                return false 
         
 }

module.exports = {
          encryptPassword,decryptPassword
}
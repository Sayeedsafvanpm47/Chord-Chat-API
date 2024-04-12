async function generateOtp() {
          const min = 100000; // Minimum value for a 6-digit number
          const max = 999999; // Maximum value for a 6-digit number
          return Math.floor(Math.random() * (max - min + 1)) + min;
      }
module.exports = generateOtp 
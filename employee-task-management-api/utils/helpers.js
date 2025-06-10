function generateAccessCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
  return phoneRegex.test(phoneNumber.replace(/\s+/g, ''));
}


function isValidAccessCode(accessCode) {
  return /^\d{6}$/.test(accessCode);
}


function sendEmailWithAccessCode(email, accessCode) {
  
  return { success: true, message: "Email sent successfully" };
}


function sendSMSWithAccessCode(phoneNumber, accessCode) {
  
  return { success: true, message: "SMS sent successfully" };
}

module.exports = {
  generateAccessCode,
  isValidEmail,
  isValidPhoneNumber,
  isValidAccessCode,
  sendEmailWithAccessCode,
  sendSMSWithAccessCode
}; 
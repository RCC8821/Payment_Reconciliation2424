// users.js  (नई फाइल बना लो, या यहीं router में डाल दो)
const USERS = [
  {
    email: "nandu24@gmail.com",
    password: "nandu$123",       // real app में bcrypt से hash करो
    type: "admin"
  },
  {
    email: "Ramprasad@gmail.com",
    password: "Ram$123",
    type: "Payment"
  },
  {
    email: "Rcc24@gmail.com",
    password: "RCC@123",
    type: "RCC"
  }
  // यहाँ जितने चाहो users add कर दो
];

module.exports = USERS;
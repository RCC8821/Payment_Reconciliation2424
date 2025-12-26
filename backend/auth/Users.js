// users.js  (नई फाइल बना लो, या यहीं router में डाल दो)
const USERS = [
  {
    email: "nandu24@gmail.com",
    password: "nandu$123",       // real app में bcrypt से hash करो
    type: "admin"
  },
  {
    email: "employee1@example.com",
    password: "emp123",
    type: "employee"
  },
  {
    email: "employee2@example.com",
    password: "emp456",
    type: "employee"
  }
  // यहाँ जितने चाहो users add कर दो
];

module.exports = USERS;
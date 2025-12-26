
const express = require('express');
const { google } = require('googleapis');
const { validateEnv } = require('./config/env');
const cors = require("cors");

// Login auth
const authLogin = require('./auth/Login');

///// Payment ///////
const Payment  = require('./payment/Payment')
const Form = require('./payment/Form')



const app = express();
// 1. CORS (Pehle daalo)
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Ya 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Body Parsing (Sirf Ek Baar + 10MB Limit)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Handle OPTIONS Preflight (Safe & Working)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  next();
});

// 4. Validate Environment
validateEnv();


app.get('/',(req,res)=>{
    res.json({message:"Run Server "})
})

///// Login APi  

app.use('/api',authLogin)

////payment Api 

app.use('/api',Payment)
app.use('/api',Form)

// 8. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`CORS enabled for: ${process.env.CLIENT_URL || 'all origins'}`);
});

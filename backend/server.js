
const express = require('express');
const { google } = require('googleapis');
const { validateEnv } = require('./config/env');
const cors = require("cors");

// Login auth
const authLogin = require('./auth/Login');

///// Payment ///////
const Payment  = require('./payment/Payment')
const Form = require('./payment/Form')
const Actual_Bank_In= require('./payment/Actual_Bank_In')
const Bank_to_bank_transfer=require('./payment/bank_to_bank_Transfer')

//////////// RCC OFFICE EXPENSES
const Approvel_1=require('./RCC_OFFICE_EXPENSES/Approvel_1')
const Approvel_2=require('./RCC_OFFICE_EXPENSES/Approvel_2')


/////////////  VRN OFFICE EXPENSES 

const VRN_Approvel1 = require('./VRN_OFFICE_EXPENSES/VRN_Approvel_1')
const VRN_Approvel2 = require('./VRN_OFFICE_EXPENSES/VRN_Approvel_2')


////////////////// Dimension Office Expenses 


const Dim_Approvel1 = require('./DIMENSION_OFFICE_EXPENSES/DIM_Approvel_1')
const dimension_Approvel2 = require('./DIMENSION_OFFICE_EXPENSES/DIM_Approvel_2')

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
app.use('/api',Actual_Bank_In)
app.use('/api',Bank_to_bank_transfer)

///// RCC OFFICE EXPESES

app.use('/api/Expenses',Approvel_1)
app.use('/api/Expenses',Approvel_2)


////// VRN OFFICE EXPENSES 

app.use('/api/vrn-Expenses',VRN_Approvel1)
app.use('/api/vrn-Expenses',VRN_Approvel2)


//////// Dimension Offie Expenses

app.use('/api/Dim-Expenses',Dim_Approvel1)
app.use('/api/Dim-Expenses',dimension_Approvel2)

// 8. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`CORS enabled for: ${process.env.CLIENT_URL || 'all origins'}`);
});

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/authAPI"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Added schema to be able to make the validation on choosen password and not hashed value
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     unique: true,
//     required: true,
//     minlength: 4,
//     maxlength: 15,
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 8,
//   },
//   accessToken: {
//     type: String,
//     default: () => crypto.randomBytes(128).toString('hex'),
//     unique: true,
//   }
// });

// userSchema.pre('save', async function (next) {
//   const user = this;

//   if (!user.isModified('password')) {
//     return next(); 
//   }
//   const salt = bcrypt.genSaltSync();
//   user.password = bcrypt.hashSync(password, salt);

//   next(); // Values are written to the database
// })

// const authenticateUser = async (req, res, next) => {
//   try {
//     const accessToken = req.header('Authorization'); //Another part of the request as body
//     const user = await User.findOne({ accessToken });

//     if (!user) {
//       throw 'User not found!';
//     }
//     req.user = user; // have access to req.user in endpoint
//     next();
//   } catch (err) {
//     const errorMessage = 'Please try logging in again';
//     console.log(errorMessage);
//     res.status(401).json({error: errorMessage})
//   }
// }

// const User = mongoose.model('User', userSchema);
const User = mongoose.model('User', {
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 4,
    maxlength: 15,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex'),
    unique: true,
  }
});

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Endpoint to register user
app.post('/users', async (req, res) => {
  try {
    const { name, password } = req.body; // If we didnt use the schema we could do a validation here instead
    const salt = bcrypt.genSaltSync();
    const user = await new User({
      name,
      password: bcrypt.hashSync(password, salt),
    }).save();
    res.status(200).json({ userId: user._id, accessToken : user.accessToken });

  } catch (err) {
    res.status(400).json({ message: 'Could not create user', errors: err });
  }
})
// Endpoint login
app.post('/sessions', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({userId: user._id, accessToken: user.accessToken })
    } else {
      throw 'User not found';
    }
  } catch (err) {
    res.status(404).json({ error: err });
  }
})

// Authenticated endpoint to GET user specific information
// app.get('/users/:id/secret', authenticateUser);
// app.get('/users/:id/secret', async (req, res) => {
//   console.log(`${req.user.name} authenticated!`)
//   const user = await User.findOne({ _id: req.params.id });
//   const secretMessage = `This is a secret message for ${user.name}`;
//   const publicMessage = `This is a public message for ${user.name}`;

//   // Decide private or public
//   if (req.user._id === user._id) { // .$oid för att komma in i objektet?
//     //Private
//     res.status(200).json({ secretMessage });
//   } else {
//     //Public information or Forbidden (403) if the users dont match
//     res.status(200).json({ publicMessage });
//   }
// })


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

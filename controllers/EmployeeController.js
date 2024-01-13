const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const employeeModel = require('../models/EmployeeModel');
const documentModel = require('../models/DocumentModel');

module.exports = {

    login: async(req, res) => {
        try {
            const { email, password } = req.body;
            // Find the employee by email
            const employee = await employeeModel.findOne({ email });
        
            if (!employee) {
              return res.status(401).json({ message: 'Invalid email or password.' });
            }
        
            // Compare the provided password with the stored hashed password
            const passwordMatch = await bcrypt.compare(password, employee.password);
        
            if (!passwordMatch) {
              return res.status(401).json({ message: 'Invalid email or password.' });
            }
            const token = jwt.sign({ id: employee._id, email: email }, 'your-secret-key', { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful.',token:token });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error.' });
          }
    },

    register: async(req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body;
            const existingEmployee = await employeeModel.findOne({ email });
            let employeeObject = {
                firstName,
                lastName,
                email,
                password
            }
            if (req.body.password) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(req.body.password, salt);
                employeeObject.password = hash;
            }
            if (existingEmployee) {
                return res.status(400).json({ message: 'Employee already exists.' });
            }
        
            // Create a new employee
            const newEmployee = new employeeModel(employeeObject);
            await newEmployee.save();
        
            res.status(201).json({ message: 'Employee registered successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error.' });
          }
    },
    
    profile: async(req, res) => {
        try {
            // req.user contains the user information from the token
            const employeeId = req.user.id;
        
            // Find the employee in the database by ID
            const employee = await employeeModel.findById(employeeId);
        
            if (!employee) {
              return res.status(404).json({ message: 'Employee not found.' });
            }
        
            // Send the employee profile in the response
            res.json({ firstName: employee.firstName, lastName: employee.lastName, email: employee.email });
          } catch (error) {
            res.status(500).json({ message: 'Internal server error.' });
          }
    },
    
    upload: async(req, res) => {
        try {
            let employeeId = req.user.id;
            let documentArray = []
            req.files.forEach(element => {
              documentArray.push({
                employeeId,
                fileName: element.originalname,
                storageName: element.filename
              })
            });
            await documentModel.insertMany(documentArray)
            res.json({ message: 'Documents uploaded successfully.' });

        } catch (error) {
            res.status(500).json({ message: 'Internal server error.' });
        }
    },

    download: async(req, res) => {
      try {
          const document = await documentModel.findById(req.params.id);
          if (!document) {
            return res.status(404).json({ error: 'Document not found' });
          }

          const filePath = path.join('public/uploads', document.storageName); // Assuming files are stored in the 'uploads' directory
          res.download(filePath, document.fileName, (err) => {
            if (err) {
              console.error(`Error downloading file: ${err.message}`);
              res.status(500).json({ error: 'Internal Server Error' });
            }
          });
      } catch (error) {
        console.log(error)
          res.status(500).json({ message: 'Internal server error.' });
      }
  },

  documents: async(req, res) => {
    try {
        // req.user contains the user information from the token
        const employeeId = req.user.id;
    
        // Find the employee in the database by ID
        const documents = await documentModel.find({
          employeeId
        });
    
        // Send the employee profile in the response
        res.json(documents);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
      }
},
}
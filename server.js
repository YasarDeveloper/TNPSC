const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = knex({
  client: 'pg',
  connection: {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'yasar123',
    port: 5432,
  },
});

app.post('/api/updateData', async (req, res) => {
  const updatedData = req.body;

  try {
    await db('student')
      .where({ id: updatedData.id })
      .update({
        name: updatedData.StudentName,
        age: updatedData.Age,
        // created_user: updatedData.CreatedUserName,
        updated_user: updatedData.userId,
        subject1: updatedData.Subject1,
        mark1: updatedData.Mark1,
        subject2: updatedData.Subject,
        mark2: updatedData.Mark2,
      });

    res.status(200).json({ success: true, message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ success: false, message: 'Error updating data' });
  }
});

app.delete('/api/deleteData/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the record from the 'students' table
    const deletedCount = await db('student')
      .where('id', id)
      .del();

    if (deletedCount > 0) {
      res.status(200).send('Record deleted successfully.');
    } else {
      res.status(404).send('Record not found.');
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/getInitialData/:id', async (req, res) => {
  const { id } = req.params; // Get the userId from query parameters
  console.log("**********************");
  console.log(id);
  if (!id) {
    return res.status(400).json({ error: 'UserId is required' });
  }

  try {
    // Call the PostgreSQL function instead of performing a direct query
    const dbData = await db.raw('SELECT * FROM get_students_by_user(?)', [id]);

    const initialData = dbData.rows.map((row) => ({
      id: row.id,
      StudentName: row.name,
      Age: row.age,
      CreatedUserName: row.created_user, // This will need to be adjusted if the function returns username directly
      UpdatedUserName: row.updated_user, // This will need to be adjusted if the function returns username directly
      Subject1: row.subject1,
      Mark1: row.mark1,
      Subject2: row.subject2,
      Mark2: row.mark2,
    }));

    res.json(initialData);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { userName, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertedData = await db('users')
      .returning('*')
      .insert({
        username: userName,
        password: hashedPassword,
      });

    res.status(201).send({ success: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error registering user" });
  }
});


app.post('/api/auth/login', async (req, res) => {
  const { userName, password } = req.body;

  try {
    // Retrieve user by userName
    const user = await db.select('*').from('users').where('username', '=', userName).first();

    console.log(user)

    if (!user) {
      return res.status(400).json('User not found');
    }
    // Compare submitted password with stored hashed password
    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      // Login successful
      res.json({ message: 'Login successful', userId: user.id });
    } else {
      // Passwords do not match
      res.status(400).json('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json('An error occurred during the login process');
  }
});


app.post('/api/saveFormData', async (req, res) => {
  const formData = req.body;

  try {
    // Use Knex to insert data into PostgreSQL
    const insertedData = await db('student')
      .returning('*')
      .insert({
        name: formData.StudentName,
        age: formData.Age,
        created_user: formData.userId,
        // updated_user: formData.UpdatedUserName,
        subject1: formData.Subject1,
        mark1: formData.Mark1,
        subject2: formData.Subject,
        mark2: formData.Mark2,
      });

    res.status(201).json(insertedData[0]);
  } catch (error) {
    console.error('Error inserting data into PostgreSQL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db('users').where({ username }).first();
    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ message: 'Login successful', userId: user.id });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
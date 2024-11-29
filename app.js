/*Comando de inicialização node app.js  -- Arquivo POSTMAN na pasta raiz do projeto*/

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');

const profileController = require('./controllers/profileController');
const contractController = require('./controllers/contractController');
const jobController = require('./controllers/jobController');
const depositController = require('./controllers/depositController');

const app = express();
app.use(bodyParser.json());

app.get('/profiles', profileController.getAllProfiles);
app.get('/profiles/:id', profileController.getProfileById);
app.post('/profiles', profileController.createProfile);

app.get('/contracts', contractController.getAllContracts);
app.get('/contracts/:id', contractController.getContractById);
app.post('/contracts', contractController.createContract);

app.post('/jobs', jobController.createJob);
app.get('/contracts/:contractId/unpaid-jobs', jobController.getUnpaidJobs);

app.post('/profiles/:profileId/deposits', depositController.createDeposit);

const PORT = process.env.PORT || 3000;app.listen(PORT, async () => {
    try {
        await sequelize.sync();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Unable to start server:', error);
    }
});

module.exports = app;

app.get('/jobs/active', jobController.getActiveJobs);

app.get('/jobs/paid', jobController.getPaidJobs);

app.delete('/reset-database', async (req, res) => {
    try {
        await sequelize.sync({ force: true });
        res.json({ message: 'Database reset successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/contracts/:id', contractController.deleteContract);
app.delete('/jobs/:id', jobController.deleteJob);

app.delete('/contracts/:id', contractController.deleteContract);
app.delete('/jobs/:id', jobController.deleteJob);

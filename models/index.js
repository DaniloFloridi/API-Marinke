const Profile = require('./Profile');
const Contract = require('./Contract');
const Job = require('./Job');
const Payment = require('./Payment');
const Deposit = require('./Deposit');

Profile.hasMany(Contract, { foreignKey: 'clientId', as: 'ClientContracts' });
Profile.hasMany(Contract, { foreignKey: 'contractorId', as: 'ContractorContracts' });
Contract.belongsTo(Profile, { foreignKey: 'clientId', as: 'Client' });
Contract.belongsTo(Profile, { foreignKey: 'contractorId', as: 'Contractor' });

Contract.hasMany(Job, { foreignKey: 'contractId' });
Job.belongsTo(Contract, { foreignKey: 'contractId' });

Job.hasMany(Payment, { foreignKey: 'jobId' });
Payment.belongsTo(Job, { foreignKey: 'jobId' });

Profile.hasMany(Deposit, { foreignKey: 'clientId' });
Deposit.belongsTo(Profile, { foreignKey: 'clientId' });

module.exports = {
    Profile,
    Contract,
    Job,
    Payment,
    Deposit
};

const { Job, Contract, Profile } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const jobController = {
    getActiveJobs: async (req, res) => {
        try {
            const activeJobs = await Job.findAll({
                where: { paid: false },
                include: [{
                    model: Contract,
                    where: { status: 'active' },
                    include: [
                        { model: Profile, as: 'Client' },
                        { model: Profile, as: 'Contractor' }
                    ]
                }]
            });
            res.json(activeJobs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createJob: async (req, res) => {
        const { description, price, contractId } = req.body;
        const transaction = await sequelize.transaction();

        try {
            const existingUnpaidJob = await Job.findOne({
                where: {
                    contractId,
                    paid: false
                },
                transaction
            });

            if (existingUnpaidJob) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Contract already has an unpaid job' });
            }

            const contract = await Contract.findByPk(contractId, {
                include: [
                    { model: Profile, as: 'Client' },
                    { model: Profile, as: 'Contractor' }
                ],
                transaction
            });

            if (!contract) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Contract not found' });
            }

            if (contract.status !== 'active') {
                await transaction.rollback();
                return res.status(400).json({ message: 'Can only create jobs for active contracts' });
            }

            if (contract.Client.balance < price) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Insufficient client balance' });
            }

            const job = await Job.create({
                description,
                price,
                contractId,
                operationDate: new Date(),
                paid: false
            }, { transaction });

            await transaction.commit();
            res.status(201).json(job);
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({ error: error.message });
        }
    },

    getUnpaidJobs: async (req, res) => {
        const { contractId } = req.params;
        try {
            const jobs = await Job.findAll({
                where: {
                    contractId,
                    paid: false
                },
                include: [{
                    model: Contract,
                    include: [
                        { model: Profile, as: 'Client' },
                        { model: Profile, as: 'Contractor' }
                    ]
                }]
            });
            res.json(jobs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getPaidJobs: async (req, res) => {
        try {
            const paidJobs = await Job.findAll({
                where: { 
                    paid: true,
                    paymentDate: { 
                        [Op.not]: null 
                    }
                },
                include: [{
                    model: Contract,
                    include: [
                        { model: Profile, as: 'Client' },
                        { model: Profile, as: 'Contractor' }
                    ]
                }],
                order: [['paymentDate', 'DESC']]
            });
            
            res.json({
                count: paidJobs.length,
                totalPaid: paidJobs.reduce((sum, job) => sum + job.price, 0),
                jobs: paidJobs
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteJob: async (req, res) => {
        const { id } = req.params;
        
        try {
            const job = await Job.findByPk(id);
            if (!job) {
                return res.status(404).json({ message: 'Job not found' });
            }

            await job.destroy();
            res.json({ message: 'Job deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};module.exports = jobController;
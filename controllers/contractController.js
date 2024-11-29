const { Contract, Profile, Job } = require('../models');
const sequelize = require('../config/database');

const contractController = {
    getAllContracts: async (req, res) => {
        try {
            const contracts = await Contract.findAll({
                include: [
                    { model: Profile, as: 'Client' },
                    { model: Profile, as: 'Contractor' }
                ]
            });
            res.json(contracts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getContractById: async (req, res) => {
        const { id } = req.params;
        try {
            const contract = await Contract.findByPk(id, {
                include: [
                    { model: Profile, as: 'Client' },
                    { model: Profile, as: 'Contractor' }
                ]
            });
            if (!contract) {
                return res.status(404).json({ message: 'Contract not found' });
            }
            res.json(contract);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createContract: async (req, res) => {
        const { terms, clientId, contractorId, status } = req.body;
        try {
            const [client, contractor] = await Promise.all([
                Profile.findByPk(clientId),
                Profile.findByPk(contractorId)
            ]);

            if (!client || !contractor) {
                return res.status(404).json({ message: 'Client or Contractor not found' });
            }

            if (clientId === contractorId) {
                return res.status(400).json({ message: 'Client and Contractor must be different profiles' });
            }

            if (client.type !== 'client' || contractor.type !== 'contractor') {
                return res.status(400).json({ message: 'Invalid profile types for contract' });
            }

            const contract = await Contract.create({
                terms,
                clientId,
                contractorId,
                status,
                operationDate: new Date()
            });

            const fullContract = await Contract.findByPk(contract.id, {
                include: [
                    { model: Profile, as: 'Client' },
                    { model: Profile, as: 'Contractor' }
                ]
            });

            res.status(201).json(fullContract);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteContract: async (req, res) => {
        const { id } = req.params;
        const transaction = await sequelize.transaction();
        
        try {
            const contract = await Contract.findByPk(id);
            if (!contract) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Contract not found' });
            }

            await Job.destroy({ 
                where: { contractId: id },
                transaction 
            });
            
            await contract.destroy({ transaction });
            await transaction.commit();
            
            res.json({ message: 'Contract and associated jobs deleted successfully' });
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = contractController;
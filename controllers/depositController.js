const { Deposit, Profile, Job, Contract } = require('../models');
const sequelize = require('../config/database');

const depositController = {
    createDeposit: async (req, res) => {
        const { profileId } = req.params;
        const { amount } = req.body;
        
        const transaction = await sequelize.transaction();
        
        try {
            const profile = await Profile.findByPk(profileId);
            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }

            const deposit = await Deposit.create({
                clientId: profileId,
                depositValue: amount,
                operationDate: new Date()
            }, { transaction });

            profile.balance += amount;
            await profile.save({ transaction });

            const unpaidJobs = await Job.findAll({
                where: { paid: false },
                include: [{
                    model: Contract,
                    where: { 
                        clientId: profileId,
                        status: 'active'
                    }
                }],
                order: [['createdAt', 'ASC']],
                transaction
            });

            let remainingAmount = amount;
            for (const job of unpaidJobs) {
                if (remainingAmount >= job.price) {
                    job.paid = true;
                    job.paymentDate = new Date();
                    await job.save({ transaction });
                    remainingAmount -= job.price;
                }
            }

            await transaction.commit();
            res.json({ 
                deposit,
                paidJobs: unpaidJobs.filter(job => job.paid).length,
                remainingBalance: profile.balance
            });
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = depositController;
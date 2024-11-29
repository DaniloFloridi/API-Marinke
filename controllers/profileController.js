const { Profile } = require('../models');

const profileController = {
    getAllProfiles: async (req, res) => {
        try {
                    const { limit = 10, offset = 0 } = req.query;
                    const profiles = await Profile.findAndCountAll({
                        limit: parseInt(limit),
                        offset: parseInt(offset)
                    });
            res.json(profiles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getProfileById: async (req, res) => {
        const { id } = req.params;
        try {
            const profile = await Profile.findByPk(id);
            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            res.json(profile);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createProfile: async (req, res) => {
        const { firstName, lastName, profession, balance, type } = req.body;
        try {
            console.log('Creating profile with data:', req.body);

            const profile = await Profile.create({
                firstName,
                lastName,
                profession,
                balance,
                type
            });
            
            console.log('Profile created successfully:', profile.toJSON());
            res.status(201).json(profile);
        } catch (error) {
            console.error('Profile creation error:', {
                name: error.name,
                message: error.message,
                sql: error.sql,
                parameters: error.parameters
            });
            
            res.status(400).json({ 
                error: error.name,
                message: error.message,
                details: error.errors?.map(e => ({
                    field: e.path,
                    type: e.type,
                    message: e.message
                })) || []
            });
        }
    }
};

module.exports = profileController;
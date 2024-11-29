const authMiddleware = async (req, res, next) => {
    const profileId = req.headers['profile-id'];
    if (!profileId) {
        return res.status(401).json({ message: 'Profile ID required' });
    }
    req.profile = await Profile.findByPk(profileId);
    next();
};

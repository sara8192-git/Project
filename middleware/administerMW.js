const administerMW = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const role = req.user.role.find(r => r === "Admin")
    if (!role) {
        return res.status(401).json({ message: 'Admin Unauthorized' })
    }
    
    next()
}
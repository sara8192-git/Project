const nurseMW = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const role = req.user.role.find(
        r => r === "Nurse")
    
    if (!role) {
        return res.status(401).json({ message: 'Nurse Unauthorized' })
    }

    next()
}

module.exports = nurseMW

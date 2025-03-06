const secretaryMW = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const role = req.user.role=="Secretary"||req.user.role === "Admin"
    if (!role) {
        return res.status(401).json({ message: 'Secretary Unauthorized' })
    }

    next()
}

module.exports = secretaryMW
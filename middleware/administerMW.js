const administerMW = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    console.log(req.user.role);

    const role = req.user.role === "Admin";
    // if (!role) {
    //     return res.status(401).json({ message: 'Admin Unauthorized' })
    // }
    
    next()
}

module.exports = administerMW

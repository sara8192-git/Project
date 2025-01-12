const administerMW = (req, res, next) => {
    const role=req.User.role.find(r=>r==="Admin")
    if(!role){
        return res.status(401).json({ message: 'Admin Unauthorized' })
    }
    next()
}
module.exports = administerMW
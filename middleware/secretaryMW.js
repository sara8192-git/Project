const secretaryMW = (req, res, next) => {
    const role=req.User.role.find(r=>r==="Secretary")
    if(!role){
        return res.status(401).json({ message: 'Secretary Unauthorized' })
    }
    next()
}
module.exports = secretaryMW
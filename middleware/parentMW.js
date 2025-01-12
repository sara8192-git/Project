const parentMW = (req, res, next) => {
    const role=req.User.role.find(r=>r==="Parent")
    if(!role){
        return res.status(401).json({ message: 'Parent Unauthorized' })
    }
    next()
}
module.exports = parentMW
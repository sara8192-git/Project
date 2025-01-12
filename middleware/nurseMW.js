const nourseMW = (req, res, next) => {
    const role=req.User.role.find(r=>r==="Nurse")
    if(!role){
        return res.status(401).json({ message: 'Nurse Unauthorized' })
    }
    next()
}
module.exports = nourseMW
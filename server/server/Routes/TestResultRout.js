const express = require("express")
const router = express.Router()
const secretaryMW = require("../middleware/secretaryMW")
const nurseMW = require("../middleware/nurseMW")
const administerMW = require("../middleware/administerMW")
const parentMW = require("../middleware/parentMW")
const TestResultController = require("../Controllers/TestResultController")
const verifyJWT = require("../middleware/verifyJWT")

router.use(verifyJWT)
router.post('/',nurseMW, TestResultController.creatTestResults);

router.get("/", nurseMW, TestResultController.getAllTestResults)
router.get("/:_id", parentMW, TestResultController.getTestResultById)
router.delete("/:_id", nurseMW, TestResultController.deleteTestResults)
router.put("/", nurseMW, TestResultController.updateTestResults)

router.get('/testResults/check', TestResultController.checkIfReported);
module.exports = router

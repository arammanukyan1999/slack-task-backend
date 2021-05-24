const express = require('express')
const {signUp,signIn} = require("../controllers/UserController")
const {createWorkspace,suggestedSubDomain,updateWorkspace,getWorkspace,deleteWorkspace} = require("../controllers/WorkspaceController")
const verifyUser = require('../middlewares/verifyUser')
const UserRouter = express.Router()
const router = express.Router()
router.use(verifyUser)




UserRouter.post('/signup',signUp)
UserRouter.post('/signin', signIn)

router.get("/workspace",getWorkspace)
router.post("/workspace",createWorkspace)
router.patch("/workspace/:id",updateWorkspace)
router.delete("/workspace/:id",deleteWorkspace)
router.post("/suggested-subDomain",suggestedSubDomain)

module.exports = {UserRouter,router}
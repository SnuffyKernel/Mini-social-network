const Router = require("express").Router;
const profileController = require("../controllers/profile-controller");
const router = new Router();
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/create-profile", authMiddleware, profileController.createProfile);
router.post("/check-active", authMiddleware, profileController.checkActive);
router.post("/get-profile", authMiddleware, profileController.getProfile);
router.post("/upload-img", authMiddleware, profileController.uploadImg)
router.post("/update-status", authMiddleware, profileController.updateStatus)

module.exports = router;

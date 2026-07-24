const router=require("express").Router();

const {generateStrategy}=require("../controller/aiController");

router.post("/",generateStrategy);

module.exports=router;
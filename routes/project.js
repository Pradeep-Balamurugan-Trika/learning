var express = require("express");
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send("1");
  })

router.post("/createProject",async(req, res) => {
  var project= await projectModel.model().find({ project_code: req.body.project_code });
  if (project[0] == null) {
    await projectModel.model().insertMany([
      {
        project_name: req.body.project_name,
        project_code: req.body.project_code,
      }
    ]);
    res.status(201).send("project created");
  } else {
    res.status(409).send("project already exist");
  }
})

module.exports = router;

// router.get("/getProject", (req, res) => {
//   var number = req.query.number;
//   employeeModel.getEmployees(number)
//     .then(result => {
//       console.log(result);
//       res.status(200).json(result).send();
//     })
//     .catch(error => {
//       res.status(404).json(error).send();
//     })
// });

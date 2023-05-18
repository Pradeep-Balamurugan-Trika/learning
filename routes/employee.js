var express = require("express");
const verifyToken = require("../auth/validateToken");
var router = express.Router();


/**
 * @swagger
 * /employee/register:
 *   post:
 *     summary: Employee register
 *     tags:
 *       - Employee
 *     description: To register a new employee and storing in mongoDB
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Employee
 *         description: employee details
 *         in: body
 *         default : '{"name":"Hary Barnes","gender":"male","number":"9898989898","age":"24","password":"abc","department":"Client Support"}'
 *         schema: 
 *            $ref: '#/definitions/Employee'
 *     responses:
 *       200:
 *         description: Successfully registered Employee
 */

/**
 * @swagger
 * definitions:
 *   Employee:
 *     properties:
 *       name:
 *         type: string
 *       gender:
 *         type: string
 *       number:
 *         type: number
 *       age:
 *         type: number
 *       password:
 *         type: string
 *       department:
 *         type: string
 */

router.post("/register", async (req, res) => {
    var number = req.body.number;
    var employees = await employeeModel
        .model()
        .find({ employee_number: number });
    if (employees[0] == null) {
        var departments = await departmentModel.model().find({
            name: req.body.department,
        });
        if (departments[0] != null) {
            var ObjectId;
            await departments.forEach((data) => {
                ObjectId = data._id;
            });

            await employeeModel.model().insertMany([
                {
                    employee_name: req.body.name,
                    employee_gender: req.body.gender,
                    employee_number: req.body.number,
                    employee_age: req.body.age,
                    employee_password: req.body.password,
                    department_id: ObjectId,
                },
            ]).catch((error) => {
                res.status(400).json("incorrect or invalid details");
            });
            res.status(201).json("Successfuly registered");
        } else {
            res.status(400).json("incorrect or invalid details");
        }
    } else {
        res.status(409).json("user already exist");
    }
    // res.send();
});


/**
 * @swagger
 * /employee/login:
 *   get:
 *     summary: Employee Login
 *     tags:
 *       - Employee
 *     description:  Logging in as employee
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: number
 *         description: Employee number
 *         in: query
 *         type: number
 *         required: true
 *     responses:
 *       200:
 *         description: Employee login successful
 */
router.get("/login", (req, res) => {
    var number = req.query.number;
    employeeModel
        .getEmployee(number)
        .then((result) => {
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
            let token = jwt.sign(result[0], jwtSecretKey, { expiresIn: '10h' });

            res.status(200).json({ "token ": token }).send();
        })
        .catch((error) => {
            res.status(404).json(error).send();
        });
});

/**
 * @swagger
 * /employee/getEmployeeProject:
 *   get:
 *     summary: Employee project
 *     tags:
 *       - Employee
 *     description:  to get projects that is assigned to the employee
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: x-access-token
 *         in: header
 *         type: string
 *         required: true
 *       - name: number
 *         description: Employee number
 *         in: query
 *         type: number
 *         required: true
 *     responses:
 *       200:
 *         description: Employee login successful
 */
router.get("/getEmployeeProject", verifyToken, async (req, res) => {
    var employees = await employeeModel
        .model()
        .find({ employee_number: req.query.number });
    if (employees[0] != null) {
        employeeModel.getEmployeeProjects(req.query.number).then((result) => {
            console.log(result);
            res.status(200).json(result).send();
        });
    } else {
        res.status(400).send("Employee doesn't exist");
    }
});

/**
 * @swagger
 * /employee/addProjectToEmployee:
 *   put:
 *     summary: Update the projects assigned for an employee
 *     tags:
 *       - Employee
 *     description:  to add the new project to the employee
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Employeeproject
 *         description: employee project
 *         in: body
 *         default : '{"number":"8056773334","project_code":"#storewebsite0405023"}'
 *         schema: 
 *            $ref: '#/definitions/Employeeproject'
 *     responses:
 *       200:
 *         description: Successfully updated
 */

/**
 * @swagger
 * definitions:
 *   Employeeproject:
 *     properties:
 *       number:
 *         type: number
 *       project_code:
 *         type: string
 */
router.put("/addProjectToEmployee", async (req, res) => {
    var employees = await employeeModel
        .model()
        .find({ employee_number: req.body.number });
    if (employees[0] != null) {
        var projects = await projectModel
            .model()
            .find({ project_code: req.body.project_code });
        if (projects[0] != null) {
            var project_objId = projects[0]._id
            var isContainProject = await employeeModel
                .model()
                .find({
                    $and: [
                        { _id: employees[0]._id },
                        { projects: { $elemMatch: { project_id: project_objId } } },
                    ],
                });
            if (isContainProject[0] == null) {
                await employeeModel.model().updateOne(
                    {
                        _id: employees[0]._id,
                    },
                    {
                        $push: {
                            projects: {
                                project_id: projects[0]._id
                            }
                        }
                    }
                )
                await projectModel.model().updateOne(
                    {
                        _id: projects[0]._id,
                    },
                    {
                        $push: {
                            project_members: { employee_id: employees[0]._id }
                        }
                    }
                )
                var json = {
                    name: employees[0].employee_name,
                    project_code: projects[0].project_code
                }
                logger1.info(JSON.stringify(json));
                res.send("added project");

            } else {
                res.status(208).send("project already exist");
            }

        } else {
            res.status(404).send("project not found");
        }
    } else {
        res.status(400).send("Employee doesn't exist");
    }
});

module.exports = router;






// router.get("/login", async (req, res) => {
//   var number = req.query.number;
//   var employees = await employeeModel.model().find({ employee_number: number });
//   await employees.forEach(async (data) => {
//     if (data.employee_number == number) {
//       var data = {
//         name: data.employee_name,
//         gender: data.employee_gender,
//         age: data.employee_age,
//         department: await departmentModel.model()
//           .findById(data.department_id)
//           .then((data1) => {
//             return data1.name;
//           }),
//       };
//       res.json(data).send();
//     } else {
//       res.json("user doesnt exist").send();
//     }
//   });
// });

// router.get("/deplist", async (req, res) => {
//   var users = await departmentModel.model().find();
//   await users.forEach((x) => {
//     console.log(x.name);
//   });
//   res.json(users).send();
// })

// let data = {
    //     name:dbdata.name,
    //     gender:dbdata
    //     number: dbdata.number,

    //     time: Date()
    // }
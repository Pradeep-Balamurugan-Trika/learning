employeeSchema = new mongoose.Schema(
    {
        employee_name: {
            type: String,
            required: true
        },
        employee_gender: {
            type: String,
            required: true
        },
        employee_number: {
            type: Number,
            required: true
        },
        employee_age: {
            type: Number,
            required: true
        },
        employee_password: {
            type: String,
            required: true
        },
        department_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "department",
            required: true
        },
        projects: [
            {
                project_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "project"
                }
            }
        ]
    },
    {
        versionKey: false,
    }
);
var employeeModel = new mongoose.model("employee", employeeSchema);
function model() {
    return employeeModel;
}
function getEmployee(number) {
    var aggregate = [
        {
            $match: {
                employee_number: parseInt(number),
            },
        },
        {
            $lookup: {
                from: "departments",
                localField: "department_id",
                foreignField: "_id",
                as: "departments",
            },
        },
        {
            $unwind: {
                path: "$departments",
            },
        },
        {
            $project: {
                _id: 0,
                "name": "$employee_name",
                "gender": "$employee_gender",
                "number": "$employee_number",
                "age": "$employee_age",
                "department": "$departments.name",
            },
        },
    ];
    console.log(JSON.stringify(aggregate));
    return model().aggregate(aggregate);
}
function getEmployeeProjects(number) {
    var aggregate = [
        {
            $facet: {
                "one": [
                    {
                        $match: {
                            employee_number: parseInt(number),
                        },
                    },
                    {
                        $lookup: {
                            from: "departments",
                            localField: "department_id",
                            foreignField: "_id",
                            as: "departments",
                        },
                    },
                    {
                        $unwind: {
                            path: "$departments",
                            path: "$projects",
                        },
                    },
                    {
                        $lookup: {
                            from: "projects",
                            localField: "projects.project_id",
                            foreignField: "_id",
                            as: "projects.project",
                        },
                    },
                    {
                        $unwind: {
                            path: "$projects.project",
                        },
                    },
                    {
                        $group: {
                            "_id": {
                                "name       ": "$employee_name",
                                "gender     ": "$employee_gender",
                                "number     ": "$employee_number",
                                "age        ": "$employee_age",
                                "department ": "$departments.name"
                            },
                            "project": { $push: "$projects.project.project_name" }
                        }
                    }
                ],
                "two":[
                    {
                        $match: {
                            employee_number: parseInt(number),
                        },
                    },
                    {
                        $lookup: {
                            from: "departments",
                            localField: "department_id",
                            foreignField: "_id",
                            as: "departments",
                        },
                    },
                    {
                        $unwind: {
                            path: "$departments",
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            "name": "$employee_name",
                            "gender": "$employee_gender",
                            "number": "$employee_number",
                            "age": "$employee_age",
                            "department": "$departments.name",
                        },
                    }
                ]
            }
        }
    ];
    console.log(JSON.stringify(aggregate));
    return model().aggregate(aggregate);
}

module.exports = {
    model,
    getEmployee,
    getEmployeeProjects,
};

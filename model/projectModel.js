const projectSchema = new mongoose.Schema({
    project_name: {
        type: String,
        required: true
    },
    project_code:{
        type: String,
        required: true
    },
    project_members: [
        {
            employee_id: {
                type: mongoose.Schema.Types.ObjectId, ref: 'employee'
            }
        }
    ]
    
},{
    versionKey: false
})
const projectModel = new mongoose.model('project', projectSchema);

function model() {
    return projectModel;
}



module.exports = { 
    model
};
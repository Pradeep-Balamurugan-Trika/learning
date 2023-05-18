const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        }
    }, {
    versionKey: false,
    }
)
const departmentModel = new mongoose.model('department', departmentSchema);

function model() {
    return departmentModel;
}

module.exports = {
    model
};

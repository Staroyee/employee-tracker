const db = require("./connection")

class Queries {
    constructor(db) {
        this.db = db
    }

    findAllDepartments(){
        return this.db.promise().query("SELECT * FROM department;")
    }
}

module.exports = new Queries(db);
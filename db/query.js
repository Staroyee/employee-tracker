const db = require("./connection")

class Queries {
    constructor(db) {
        this.db = db
    }

    findAllDepartments(){
        return this.db.promise().query("SELECT * FROM department;")
    }

    findAllRoles(){
        return this.db.promise().query("SELECT * FROM role;")
    }

    findAllEmployees(){
        return this.db.promise().query("SELECT * FROM employee;")
    }
}

module.exports = new Queries(db);
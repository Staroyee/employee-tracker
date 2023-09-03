const inquirer = require("inquirer");
const queries = require("./db/query");
const db = require("./db/connection");

//Inquirer prompt.
function prompt() {
  //Main prompt.
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
        name: "main",
      },
    ])
    //What to do with the data.
    .then((data) => {
      //View departments
      if (data.main === "View all departments") {
        getDepartments();
        console.log("Viewing all departments");

        //View roles
      } else if (data.main === "View all roles") {
        getRoles();
        console.log("Viewing all roles");

        //View employees
      } else if (data.main === "View all employees") {
        console.log("Viewing all employees");
        getEmployees();

        //Add new department
      } else if (data.main === "Add a department") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "department",
              message: "Enter name for new department:",
              validate: (input) => {
                if (input) {
                  return true;
                } else {
                  console.log("Please enter a department name!");
                  return false;
                }
              },
            },
          ])
          .then((data) => {
            db.query(
              `INSERT INTO department (name) VALUES (?)`,
              [data.department],
              (err, result) => {
                if (err) throw err;
                console.log(`Added ${data.department} to the database.`);
                prompt();
              }
            );
          });
        //Add new role
      } else if (data.main === "Add a role") {
        db.query(`SELECT * FROM department`, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "input",
                name: "role",
                message: "Enter name for new role:",
                validate: (input) => {
                  if (input) {
                    return true;
                  } else {
                    console.log("Please enter a role name!");
                    return false;
                  }
                },
              },
              {
                type: "number",
                name: "salary",
                message: "Enter salary:",
                validate: (input) => {
                  if (input) {
                    return true;
                  } else {
                    console.log("Please enter a salary!");
                    return false;
                  }
                },
              },
              {
                type: "list",
                name: "department",
                message: "Select department to assign role to.",
                choices: () => {
                  var deptsArray = [];
                  for (var i = 0; i < result.length; i++) {
                    deptsArray.push(result[i].name);
                  }
                  return deptsArray;
                },
              },
            ])
            .then((data) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].name === data.department) {
                  var department = result[i];
                  console.log(department);
                }
              }
              db.query(
                `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                [data.role, data.salary, department.id],
                (err, result) => {
                  if (err) throw err;
                  console.log(`Added ${data.role} to the database.`);
                  prompt();
                }
              );
            });
        });
        //Add new employee
      } else if (data.main === "Add an employee") {
        db.query(`SELECT * FROM employee, role`, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "input",
                name: "first",
                message: "Enter first name: ",
                validate: (firstNameinput) => {
                  if (firstNameinput) {
                    return true;
                  } else {
                    console.log("Please enter first name of new employee!");
                    return false;
                  }
                },
              },
              {
                type: "input",
                name: "last",
                message: "Enter last name: ",
                validate: (lastNameinput) => {
                  if (lastNameinput) {
                    return true;
                  } else {
                    console.log("Please enter last name of new employee!");
                    return false;
                  }
                },
              },
              {
                type: "list",
                name: "role",
                message: "Choose employees role: ",
                choices: selectRole(),
              },
              {
                type: "rawlist",
                name: "manager",
                message: "Enter name of employees manager:",
                choices: selectManager(),
              },
            ])
            .then(function (data) {
              var roleId = selectRole().indexOf(data.role) + 1;
              var managerId = selectManager().indexOf(data.manager) + 1;
              db.query(
                "INSERT INTO employee SET ?",
                {
                  first_name: data.first,
                  last_name: data.last,
                  role_id: roleId,
                  manager_id: managerId,
                },
                function (err) {
                  if (err) throw err;
                  console.log("Added employee to database!");
                  prompt();
                }
              );
            });
        });
        //Update employee information
      } else if (data.main === "Update an employee role") {
        db.query(
          "SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;",
          function (err, result) {
            if (err) throw err;
            console.log(result);
            inquirer
              .prompt([
                {
                  type: "rawlist",
                  name: "lastName",
                  choices: function () {
                    var lastName = [];
                    for (var i = 0; i < result.length; i++) {
                      lastName.push(result[i].last_name);
                    }
                    return lastName;
                  },
                  message: "Select employee by last name: ",
                },
                {
                  type: "rawlist",
                  name: "role",
                  message: "Select the employees new role: ",
                  choices: selectRole(),
                },
              ])
              .then(function (data) {
                var roleId = selectRole().indexOf(data.role) + 1;
                db.query(
                  "UPDATE employee SET WHERE ?",
                  {
                    last_name: data.lastName
                  },
                  {
                    role_id: roleId
                  },
                  function (err) {
                    if (err) throw err;
                    console.log("Employee details updated!");
                    prompt();
                  }
                );
              });
          }
        );
      }
    });
}

function getDepartments() {
  queries
    .findAllDepartments()
    .then(([data]) => {
      console.table(data);
    })
    .then(() => {
      prompt();
    });
}

function getRoles() {
  queries
    .findAllRoles()
    .then(([data]) => {
      console.table(data);
    })
    .then(() => {
      prompt();
    });
}

function getEmployees() {
  queries
    .findAllEmployees()
    .then(([data]) => {
      console.table(data);
    })
    .then(() => {
      prompt();
    });
}

var managersArr = [];
function selectManager() {
  db.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    function (err, result) {
      if (err) throw err;
      for (var i = 0; i < result.length; i++) {
        managersArr.push(result[i].first_name);
      }
    }
  );
  return managersArr;
}

var roleArr = [];
function selectRole() {
  db.query("SELECT * FROM role", function (err, result) {
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      roleArr.push(result[i].title);
    }
  });
  return roleArr;
}

prompt();

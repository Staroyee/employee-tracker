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
              }
            );
          });
        //Add new role
      } else if (data.main === "Add a role") {
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
              type: "input",
              name: "department",
              message: "Enter department for role to be added to:",
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
            console.log("Role added");
          });

        //Add new employee
      } else if (data.main === "Add an employee") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "first",
              message: "Enter first name:",
              validate: (input) => {
                if (input) {
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
              message: "Enter last name:",
              validate: (input) => {
                if (input) {
                  return true;
                } else {
                  console.log("Please enter last name of new employee!");
                  return false;
                }
              },
            },
            {
              type: "input",
              name: "role",
              message: "Enter role for employee:",
              validate: (input) => {
                if (input) {
                  return true;
                } else {
                  console.log("Please enter name of employees role");
                  return false;
                }
              },
            },
            {
              type: "input",
              name: "manager",
              message: "Enter name of employees manager:",
              validate: (input) => {
                if (input) {
                  return true;
                } else {
                  console.log("Please enter name of manager");
                  return false;
                }
              },
            },
          ])
          .then((data) => {
            console.log("Employee Added");
          });

        //Update employee information
      } else if (data.main === "Update an employee role") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "updateRole",
              message: "Enter new role for employee:",
              validate: (input) => {
                if (input) {
                  return true;
                } else {
                  console.log("Please enter a role!");
                  return false;
                }
              },
            },
          ])
          .then((data) => {
            console.log("Role updated");
          });
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

prompt();

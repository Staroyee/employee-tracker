const inquirer = require("inquirer");
const queries = require('./db/query')

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
      }
    ])
    //What to do with the data.
    .then((data) => {
        //Show formatted table showing department names and ids.
      if (data.main === "View all departments") {
        getDepartments()
        console.log("Viewing all departments");

        //Show formatted table showing job title, role id, department role belongs to, and salary for that role.
      } else if (data.main === "View all roles") {
        console.log("Viewing all roles");

        //Show formatted table showing employee data (ids, first & last names, job title, departments, salaries, and managers the employees report to).
      } else if (data.main === "View all employees") {
        console.log("Viewing all employees");

        //Prompt to enter the name of a new department and add it to the database.
      } else if (data.main === "Add a department") {
        inquirer.prompt([{
            type: 'input',
            name: 'department',
            message: 'Enter name for new department:',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter a department name!');
                    return false;
                }
            }
        }]).then((data) => {
            console.log("Department Added")
        });

        //Prompts to enter a name, salary, and department for a new role and add it to the database.
      } else if (data.main === "Add a role") {
        inquirer.prompt([
            {
            type: 'input',
            name: 'role',
            message: 'Enter name for new role:',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter a role name!');
                    return false;
                }
            }
            },
            {
                type: 'number',
                name: 'salary',
                message: 'Enter salary:',
                validate: input => {
                    if (input) {
                        return true;
                    } else {
                        console.log('Please enter a salary!');
                        return false;
                    }
                    
                },
            },
            {
                type: 'input',
                name: 'department',
                message: 'Enter department for role to be added to:',
                validate: input => {
                    if (input) {
                        return true;
                    } else {
                        console.log('Please enter a department name!');
                        return false;
                    }
                }
            }
        ])
            .then((data) => {
            console.log("Role added")
        });
        
        //Prompts to enter an employee's first name, last name, role, and manager then add the employee to the database.
      } else if (data.main === "Add an employee") {
        inquirer.prompt([
            {
                type: 'input',
                name: 'first',
                message: 'Enter first name:',
                validate: input => {
                    if (input) {
                        return true;
                    } else {
                        console.log('Please enter first name of new employee!');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'last',
                message: 'Enter last name:',
                validate: input => {
                    if (input) {
                        return true;
                    } else {
                        console.log('Please enter last name of new employee!');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'role',
                message: 'Enter role for employee:',
                validate: input => {
                    if (input) {
                        return true;
                    } else {
                        console.log('Please enter name of employees role');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'manager',
                message: 'Enter name of employees manager:',
                validate: input => {
                    if (input) {
                        return true;
                    } else {
                        console.log('Please enter name of manager');
                        return false;
                    }
                }
            }
        ])
            .then((data) => {
            console.log("Employee Added")
        });
        
        //Prompts to select an employee and update their role and update the information in the database.
      } else if (data.main === "Update an employee role") {
        inquirer.prompt([{
            type: 'input',
            name: 'updateRole',
            message: 'Enter new role for employee:',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter a role!');
                    return false;
                }
            }
        }]).then((data) => {
            console.log("Role updated")
        });
      }
    });
}

function getDepartments() {
    queries.findAllDepartments().then(([data]) => {
        console.table(data);
    }).then(()=>{
        prompt();
    });
}




prompt();

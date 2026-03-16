//Get the functions in the db.js file to use
const db = require('../services/db');

class student {
    //Student id 
    id;
    //Student name
    name;
    //Student programmme
    programme;
    //Student modules 
    modules = [];

    constructor(id) {
        this.id = id;
    }

    async getStudenName() {
    }

    async getStudentProgramme() {
    }

    async getStudentModules() {
    }
}
    module.exports = student;

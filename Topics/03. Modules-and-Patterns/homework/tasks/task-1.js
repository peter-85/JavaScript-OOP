/* Task Description */
/* 
* Create a module for a Telerik Academy course
  * The course has a title and presentations
    * Each presentation also has a title
    * There is a homework for each presentation
  * There is a set of students listed for the course
    * Each student has firstname, lastname and an ID
      * IDs must be unique integer numbers which are at least 1
  * Each student can submit a homework for each presentation in the course
  * Create method init
    - Accepts a string - course title
    - Accepts an array of strings - presentation titles
    V Throws if there is an invalid title
      V Titles do not start or end with spaces
      V Titles do not have consecutive spaces
      V Titles have at least one character
    V Throws if there are no presentations
  * Create method addStudent which lists a student for the course
    - Accepts a string in the format 'Firstname Lastname'
    V Throws if any of the names are not valid
      V Names start with an upper case letter
      V All other symbols in the name (if any) are lowercase letters
    V Generates a unique student ID and returns it
  * Create method getAllStudents that returns an array of students in the format:
    * {firstname: 'string', lastname: 'string', id: StudentID}
  * Create method submitHomework
    * Accepts studentID and homeworkID
      * homeworkID 1 is for the first presentation
      * homeworkID 2 is for the second one
      * ...
    * Throws if any of the IDs are invalid
  * Create method pushExamResults
    * Accepts an array of items in the format {StudentID: ..., Score: ...}
      * StudentIDs which are not listed get 0 points
    * Throw if there is an invalid StudentID
    * Throw if same StudentID is given more than once ( he tried to cheat (: )
    * Throw if Score is not a number
  * Create method getTopStudents which returns an array of the top 10 performing students
    * Array must be sorted from best to worst
    * If there are less than 10, return them all
    * The final score that is used to calculate the top performing students is done as follows:
      * 75% of the exam result
      * 25% the submitted homework (count of submitted homeworks / count of all homeworks) for the course
*/

function solve() {
    let Course = {

        init: function(title, presentations) {
            validateTitle(title);
            validatePresentations(presentations);

            this.title = title; //Защо се ползва this? Трябва ли?
            this.presentations = presentations;
            this.students = [];

            return this;
        },

        addStudent: function(name) {
            let regex = /[A-Z]{1}[a-z]*/g,
                validName = name.match(regex);
            if (validName === null) {
                throw new Error('The name is not in the format! "Firstname Lastname"');
            }
            if (validName.length !== 2) {
                throw new Error('The name is not in two parts "Firstname Lastname"');
            }
            let id = this.students.length + 1;
            let student = {
                firstName: validName[0],
                lastName: validName[1],
                id: id
            }
            this.students.push(student);
            return id;
        },

        getAllStudents: function() {
            return this.students;
        },
        submitHomework: function(studentID, homeworkID) {},
        pushExamResults: function(results) {},
        getTopStudents: function() {}
    };

    // helper Functions
    function validateTitle(title) {

        let formatTitle = title.match(/\S+/ig);
        if (!formatTitle) {
            throw new Error('Title should have at least one character');
        }
        formatTitle = title.match(/^\s+|\s+$/ig);
        if (formatTitle !== null) {
            throw new Error('There are spaces in the begining or in the end');
        }
        formatTitle = title.match(/\s+\s+/g);
        if (formatTitle !== null) {
            throw new Error('There are consecutive spaces in the title');
        }
    }

    function validatePresentations(presentations) {
        if (!presentations || !Array.isArray(presentations) || presentations.length === 0) {
            throw new Error('Wrong parameters for presentation');
        }
        for (let i = 0; i < presentations.length; i += 1) {
            validateTitle(presentations[i]);
        }
    }
    return Course;
}


module.exports = solve;

// testing course
let course = solve().init('js oop', ['lec1', 'lec2', 'lec3', 'lec4']);
course.addStudent('Milko Kunev');
console.log(course);
console.log(course.getAllStudents());
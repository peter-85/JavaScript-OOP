/* Task Description */
/* 
	Write a function that sums an array of numbers:
		numbers must be always of type Number
		returns `null` if the array is empty
		throws Error if the parameter is not passed (undefined)
		throws if any of the elements is not convertible to Number	

*/

function solve() {

    return function sum(array) {
        if (array.length === 0) {
            return null;
        }
        if (array.some(x => isNaN(x))) {
            throw 'Something is wrong';
        }
        let sum = array.reduce((a, b) => (+a) + (+b));
        return sum;
    }
}

module.exports = solve;

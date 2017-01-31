/* Task description */
/*
	Write a function that finds all the prime numbers in a range
		1) it should return the prime numbers in an array
		2) it must throw an Error if any on the range params is not convertible to `Number`
		3) it must throw an Error if any of the range params is missing
*/

function solve() {
    
 return function findPrimes(from, to) {
        from = +from;
        to = +to;
        if (findPrimes.length !== 2) {
            throw 'This must be a mistake';
        }
        if (isNaN(from) || isNaN(to)) {
            throw 'You must write a valid number';
        }
        let array = [],
            isPrime;

        for (let i = from; i <= to; i += 1) {
            isPrime = true;
            for (let j = 2; j <= Math.sqrt(i); j += 1) {
                if (i % j === 0) {
                    isPrime = false;
                    break;
                }
            }
            if (i === 2 || i === 3) {
                isPrime = true;
            }
            if (i === 1 || i === 0) {
                isPrime = false;
            }
            if (isPrime === true) {
                array.push(i);
            }
        }
        return array;
    }
}

module.exports = solve;

/* Task Description */
/* 
 *	Create a module for working with books
 	*	The module must provide the following functionalities:
 V	Add a new book to category
 V	Each book has unique title, author and ISBN
 V	It must return the newly created book with assigned ID
 V	If the category is missing, it must be automatically created
 V	List all books
 V	Books are sorted by ID
 *	This can be done by author, by category or all
 *	List all categories
 *	Categories are sorted by ID
 *	Each book/catagory has a unique identifier (ID) that is a number greater than or equal to 1
 *	When adding a book/category, the ID is generated automatically
 		*Add validation everywhere, where possible
 V*	Book title and category name must be between 2 and 100 characters, including letters, digits and special characters ('!', ',', '.', etc)
 V	Author is any non-empty string
 V	Unique params are Book title and Book ISBN
 V	Book ISBN is an unique code that contains either 10 or 13 digits
 V	If something is not valid - throw Error
 */
function solve() {
    var library =  (function() {
        var books = [];
        var categories = [];

        function listBooks(optional) {
            let result = [];
            if (!optional) {
                result = books;
            } else if (optional && optional.category) {
                result = books.filter(function(book) {
                    return book.category === optional.category;
                });
            } else if (optional && optional.author) {

                // ВАРИАНТ 1 на синтаксис
                result = books.filter(b => b.author === optional.author);

                // ВАРИАНТ 2 на синтаксис
                //result = books.filter(b => { return b.author === optional.author; });

                //// ВАРИАНТ 3 на синтаксис
                //result = books.filter(function(book) {
                //return book.author === optional.author;
                //});

                // И ТРИТЕ ВАРИАНТА РАБОТЯТ - ТЕСТВАЛ СЪМ ГИ
            }
            result = result.sort((a, b) => (a.ID - b.ID));
            return result;
        }

        function addBook(book) {

            // some checks
            if (!book.title || book.title.length < 2 || book.title.length > 100) {
                throw new Error('The title is too short or too long!');
            }
            if (book.isbn.length !== 10 && book.isbn.length !== 13) {
                throw new Error('ISBN must 10 or 13 symbols');
            }
            if (isNaN(book.isbn)) {
                throw new Error('ISBN must be number');
            }
            if (isIsbnUnique(book)) {
                throw new Error('This isbn already exists!');
            }
            if (book.author.length === 0) {
                throw new Error('Author must be inserted');
            }
            if (isTitleUnique(book)) {
                throw new Error('Title must be unique');
            }
            if (categories.indexOf(book.category) === -1) {
                categories.push(book.category);
            }
            book.ID = books.length + 1;
            books.push(book);
            return book;
        }

        function listCategories() {
            return categories;
        }

        return {
            books: {
                list: listBooks,
                add: addBook
            },
            categories: {
                list: listCategories
            }
        };

        // Helper functions
        function isIsbnUnique(someBook) {

            return books.some(b => {
                return b.isbn === someBook.isbn;
            });
        }

        function isTitleUnique(someBook) {

            return books.some(b => {
                return b.title === someBook.title;
            });
        }

    }());
    return library;
}

module.exports = solve;

// testing library
var book = {
    title: 'the good parts',
    isbn: '1234567890',
    author: 'Crockford',
    category: 'javascript'
};

var book1 = {
    title: 'the art of unit testing',
    isbn: '5456897456321',
    author: 'Osherove',
    category: 'c#'
};
var book2 = {
    title: 'Razkazi za zhivota',
    isbn: '5456897456355',
    author: 'Peter Bukai',
    category: 'life'
};

var testCategory = {
    category: 'javascript'
};

var testAuthor = {
    author: 'Osherove'
};

var library = solve();
library.books.add(book);
library.books.add(book1);
library.books.add(book2);

console.log(library.books.list());
//console.log(library.books.list(testAuthor));
//console.log(library.categories.list());
//console.log(library.books.list());
//console.log(typeof library.books.list);
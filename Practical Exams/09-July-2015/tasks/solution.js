function solve() {

    const nextId = (function() {
        let counter = 0;
        let counterMedia = 0;
        return function(type) {
            if (type === 'book') {
                counter += 1;
                return counter;
            }
            if (type === 'media') {
                counterMedia += 1;
                return counterMedia;
            }
            counter += 1;
            return counter;
        };
    })();

    const Validator = {
        validateDescription(x) {
            if (typeof x !== 'string' || x.length === 0) {
                throw Error('description is not valid');
            }
        },
        validateName(x) {
            if (typeof x !== 'string' || x.length < 2 || x.length > 40) {
                throw Error('Name is not valid');
            }
        },
        validateIsbn(isbn) {
            if (typeof isbn !== 'string' || !isbn.match(/^([0-9]{10}|[0-9]{13})$/)) {
                throw 'Isbn is not valid';
            }
        },
        validateGenre(x) {
            if (typeof x !== 'string' || x.length < 2 || x.length > 20) {
                throw Error('Genre is not valid');
            }
        },
        validateDuration(x) {
            if (typeof x !== 'number' || x < 1) {
                throw Error('Duration is not valid');
            }
        },
        validateRating(x) {
            if (typeof x !== 'number' || x < 1 || x > 5) {
                throw Error('Rating is not valid');
            }
        },
        validateNameCatalog(x) {
            if (typeof x !== 'string' || x.length < 2 || x.length > 40) {
                throw Error('Catalog name is not valid');
            }
        }
    }

    const catalogData = { // obekt za syhranenie na dopylnitelna informaciq
        items: {}, // kluchovete sa naredeni sa po Id 
        itemsArray: [],
        genre: {},
        mediaArray: []
    };

    class Item {
        constructor(description, name, price) {
            if (price !== undefined) { // syzdavane na overload 
                this.price = price;
            }
            this._id = nextId();
            this.name = name;
            this.description = description;
            catalogData.items[this.id] = this;
            catalogData.itemsArray.push(this);
        }
        get id() {
            return this._id;
        }
        get description() {
            return this._description;
        }
        set description(x) {
            Validator.validateDescription(x);
            this._description = x;
        }
        get name() {
            return this._name;
        }
        set name(x) {
            Validator.validateName(x);
            this._name = x;
        }
    }

    class Book extends Item {
        constructor(description, name, isbn, genre) {
            super(description, name);
            this.isbn = isbn;
            this.genre = genre;
            //catalogData.genre[this.genre] = true;
        }

        get isbn() {
            return this._isbn;
        }
        set isbn(x) {
            Validator.validateIsbn(x);
            this._isbn = x;
        }
        get genre() {
            return this._genre;
        }
        set genre(x) {
            Validator.validateGenre(x);
            this._genre = x;
        }
    }

    class Media extends Item {
        constructor(description, name, duration, rating) {
            super(description, name);
            this.duration = duration;
            this.rating = rating;
            catalogData.mediaArray.push(this);

        }
        get duration() {
            return this._duration;
        }
        set duration(x) {
            Validator.validateDuration(x);
            this._duration = x;
        }
        get rating() {
            return this._rating;
        }
        set rating(x) {
            Validator.validateRating(x);
            this._rating = x;
        }
    }
    Array.prototype.filterByProperty = function(options, propName) { // options e obekt, koito tyrsi v masiv
        if (!options.hasOwnProperty(propName)) {
            return this;
        }
        return this.filter(x => x[propName] === options[propName]); // Pravim syvpadenie na values. 
        // Ako nyama syvpadenie na values vrysta empty []
    };

    class Catalog {
        constructor(name) {
            this._id = nextId(); //Kak se poluchava taka che moga da go vikam i v drugiq klass i vadi razlichni countyri
            this.name = name;
            this._items = [];

        }
        get id() {
            return this._id;
        }
        get name() {
            return this._name;
        }
        set name(x) {
            Validator.validateNameCatalog(x);
            this._name = x;
        }
        get items() {
            return this._items;
        }
        add(...items) {
            if (Array.isArray(items[0])) {
                items = items[0];
            }
            if (items.length === 0) {
                throw Error('There must be at least one parameter');
            }
            items.forEach(i => {
                if (!(i instanceof Item)) {
                    throw Error('It must be an Item');
                }
                Validator.validateDescription(i.description);
                Validator.validateName(i.name);
                if (i.id < 1) { // ?? Zasto ne se polzva _id -mozhe i taka, no imame getter
                    throw Error('Id must be positive integer');
                }
            });

            // Za da proverq dali ima propertita na items ne moga da napravia (hasOwnProperty) - pravq direktno validaciq na i.name primerno
            //items.forEach(i => this._items.push(i)); // kogato polzvame fat arrows da ne polzvam this zastoto go priema globalen
            this._items.push(...items); // ?? tuk edno po edno li gi podava ako e masiv - tuk raboti po obratniq nachin - ot masiv gi podava edno po edno
            return this;
        }
        find(parameter) {
            // if (typeof parameter === 'number') {
            //     if (catalogData.items[parameter] === 'undefined') { // DA PITAM CYKI DALI tova e ok za testovete
            //         return null;
            //     }
            //     return catalogData.items[parameter];
            // } else if (typeof parameter === 'object') {
            //     return catalogData.itemsArray
            //         .filterByProperty(parameter, 'id')
            //         .filterByProperty(parameter, 'name');
            // } else {
            //     throw Error('It must be an Id or an array');
            // }
            if (typeof parameter === 'number') {
                let item = this._items.find(i => i.id === parameter);
                if (typeof item === 'undefined') {
                    item = null;
                }
                return item;
            } else if (typeof parameter === 'object') {
                return this._items
                    .filterByProperty(parameter, 'id')
                    .filterByProperty(parameter, 'name');
            } else {
                throw Error('It must be an Id or an array');
            }
        }
        search(pattern) {
            Validator.validateDescription(pattern);
            return this._items.filter(i => {
                return (i.description.indexOf(pattern) > -1) || (i.name.indexOf(pattern) > -1);
            }); // raboti
        }

    }
    class BookCatalog extends Catalog {
        constructor(name) {
            super(name /*, id, items*/ ); // ?? id i items taka li se naslediavat ili s dolni cherti ili pishat li se
        }
        add(...books) { // raboti
            if (Array.isArray(books[0])) {
                books = books[0];
            }
            books.forEach(b => {
                if (!(b instanceof Book)) {
                    throw Error('Book must be an object');
                }
                Validator.validateDescription(b.description);
                Validator.validateName(b.name);
                Validator.validateIsbn(b.isbn);
                Validator.validateGenre(b.genre);
            });
            return super.add(books); //?? i ...books da napisha pak raboti
        }
        getGenres() { // raboti
                return this._items
                    .map(book => book.genre.toLowerCase())
                    .sort()
                    .filter((genre, index, genres) => genre !== genres[index - 1]);
            }
            //     this._items.forEach(i => {
            //         catalogData.genre[i.genre] = true;
            //     });
            //     return (Object.keys(catalogData.genre)).map(g => g.toLowerCase());

        //     //return (Object.keys(catalogData.genre)).map(g => g.toLowerCase()); // Originalen podhod za izvazhdane na unikalni imena - kato se vkarat kato keys na object
        // } // s forEach ne stana 
        find(arg) { // raboti
            if (typeof arg === 'object') {
                const books = super.find(arg);
                if (arg.hasOwnProperty('genre')) {
                    return books.filter(b => b.genre === arg.genre);
                }
                return books;
            }
            return super.find(arg);
        }
    }

    class MediaCatalog extends Catalog {
        constructor(name) {
            super(name);
        }

        add(...medias) {
            if (Array.isArray(medias[0])) {
                medias = medias[0];
            }
            medias.forEach(m => {
                if (!(m instanceof Media)) {
                    throw Error('This is not media');
                }
            });
            return super.add(...medias);
        }
        getTop(count) {
            if (typeof count !== 'number' || count < 1) {
                throw Error('Count must be a number above 1');
            }
            let sortedByRating = this._items.slice().sort((a, b) => b.rating - a.rating) // preporychitelno e predi sort da polzvam slice()
                .slice(0, count)
                .map(x => {
                    return {
                        name: x.name,
                        id: x.id
                    };
                });
            return sortedByRating;
        }
        getSortedByDuration() {
            return this._items
                .slice()
                .sort(x, y => {
                    if (x.duration === y.duration) { return x.id - y.id; }
                    return y.duration - x.duration;
                });
        }
        find(parameter) {
            if (typeof parameter === 'object') {
                const medias = super.find(parameter);
                return medias.filterByProperty(parameter, 'rating');
            }
            return super.find(parameter);
        }
    }

    return {
        getBook: function(name, isbn, genre, description) {
            return new Book(description, name, isbn, genre);
            // return a book instance
        },
        getMedia: function(name, rating, duration, description) {
            return new Media(description, name, duration, rating);
            // return a media instance
        },
        getBookCatalog: function(name) {
            return new BookCatalog(name);
            // return a book catalog instance
        },
        getMediaCatalog: function(name) {
            return new MediaCatalog(name);
            // return a media catalog instance
        }
    };
}

module.exports = solve;

var academy = solve();
var masivni = academy.getBook('Pet', '1234567890', 'Horror', 'Masivni');
var metalni = academy.getBook('Maya', '1234567891', 'Sport', 'Metal');
console.log(masivni);
console.log(metalni);

var catalogSport = academy.getBookCatalog('Sport');
console.log(catalogSport);
catalogSport.add(masivni, metalni);
//console.log(catalogSport);
console.log(catalogSport.search('Met'));
console.log(catalogSport.getGenres());

// console.log(catalogSport.find({ id: 2 }));
// description, name, duration, rating
// var media1 = academy.getMedia('Media', 'MediaName', 4, 4);
// var media2 = academy.getMedia('MediaTwo', 'MediaNameTwo', 3, 3);
// var sportMedia = academy.getMediaCatalog('Sport Media');
// console.log(media1);
// sportMedia.add(media1, media2);
// console.log(sportMedia);
// console.log(sportMedia.getTop(2));
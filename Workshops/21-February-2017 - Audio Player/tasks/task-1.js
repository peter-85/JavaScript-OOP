function solve() {

    var validateFunction = function(x) {
        if (typeof x !== 'string' || x.length < 3 || x.length > 25) {
            throw Error('Must be a string between 3 and 25 symbols')
        }
    };

    var Id = (function() { // Generator na unikalno celochisleno chislo ot 1 nagore
        var id = 0;

        function nextId() { // izvikvame -             this._id = Id.nextId();
            id++;
            return id;
        }
        return {
            nextId: nextId
        };
    })();

    class Player {
        constructor(name) {
            this.name = name;
            this._playlists = [];
        }
        get name() {
            return this._name;
        }
        set name(x) {
            validateFunction(x);
            this._name = x;
        }
        get playlists() {
            return this._playlists;
        }
        addPlaylist(playlistToAdd) {
            if (!(playlistToAdd instanceof PlayList)) {
                throw Error('Must be an instance');
            }
            this._playlists.push(playlistToAdd);
            return this;
        }
        getPlaylistById(id) {
            let result = this._playlists.find(x => x.id === id);
            if (typeof result === 'undefined') {
                return null;
            }
            return result;
        }
        removePlaylist(params) {
            if (typeof params === 'number') {
                let index = this._playlists.findIndex(x => x.id === params);

                if (index === -1) {
                    return null;
                }
                return this._playlists.splice(index, 1);
            }
            if (typeof params === 'object') {
                let index = this._playlists.findIndex(x => x.id === params.id);

                if (index === -1) {
                    return null;
                }
                return this._playlists.splice(index, 1);
            }

        }
        listPlaylists(page, size) {

            let sortedPlayList = this._playlists.sort((x, y) => {
                if (x.name === y.name) {
                    return x.id - y.id;
                }
                return x.name.localCompare(y.name);
            });
            let slicedPlayList = sortedPlayList.slice(page * size, (page + 1) * size);
            return slicedPlayList;

        }
        contains(playable, playlist) {
            let playListById = this.getPlaylistById(playlist.id);
            if (playListById == null) {
                return false;
            }
            let playableById = getPlayableById(playable.id);
            if (playableById == null) {
                return false;
            }
            return true;
        }
        search(pattern) {
            return this._playlists.filter(p => {
                p._playable.filter(playable => {
                    (playable.title.indexOf(pattern)) > (-1);
                });
            });
        }
    }

    class PlayList {
        constructor(name) {
            this.name = name;
            this._id = Id.nextId();
            this._playable = [];
        }
        get name() {
            return this._name;
        }
        set name(x) {
            validateFunction(x);
            this._name = x;
        }
        get id() {
            return this._id;
        }
        addPlayable(playable) {
            this._playable.push(playable);
            return this;
        }
        getPlayableById(id) {

            let result = this._playable.find(p => p.id === id);
            if (typeof result === 'undefined') {
                return null;
            }
            return result;
        }
        removePlayable(params) {
            if (typeof params === 'number') {
                let index = this._playable.findIndex(x => x.id === params);

                if (index === -1) {
                    throw Error("Error");
                }
                return this._playable.splice(index, 1);
            }
            if (typeof params === 'object') {
                let index = this._playable.findIndex(x => x.id === params.id);

                if (index === -1) {
                    throw Error("Error");
                }
                return this._playable.splice(index, 1);
            }
        }
        listPlayables(page, size) {
            if (typeof page === 'undefined' ||
                typeof size === 'undefined' ||
                page < 0 ||
                size <= 0 ||
                page * size > this._playable.length) {
                throw Error('Wrong');
            }
            let sortedPlayable = this._playable.sort((x, y) => {
                if (x.name === y.name) {
                    return x.id - y.id;
                }
                return x.name.localCompare(y.name);
            });
            let slicedPlayable = sortedPlayable.slice(page * size, (page + 1) * size);
            return slicedPlayable;
        }
    }

    class Playable {
        constructor(title, author) {
            this._id = Id.nextId();
            this.title = title;
            this.author = author;
        }
        get id() {
            return this._id;
        }

        get title() {
            return this._title;
        }
        set title(x) {
            validateFunction(x);
            this._title = x;
        }
        get author() {
            return this._author;
        }
        set author(x) {
            validateFunction(x);
            this._author = x;
        }
        play() {
            return `[${this.id}]. [${this.title}] - [${this.author}]`;
        }
    }
    class Audio extends Playable {
        constructor(title, author, length) {
            super(title, author);
            this.length = length;
        }
        get length() {
            return this._length;
        }
        set length(x) {
            if (typeof x !== 'number' || x < 1) {
                throw Error('Length must be a number');
            }
            this._length = x;
        }
        play() {
            return `${super.play()} - [${this.length}]`;
        }
    }
    class Video extends Playable {
        constructor(title, author, imdbRating) {
            super(title, author);
            this.imdbRating = imdbRating;
        }
        get imdbRating() {
            return this._imdbRating;
        }
        set imdbRating(x) {
            if (typeof x !== 'number' || x < 1 || x > 5) {
                throw Error('imdbRating must be a number');
            }
            this._imdbRating = x;
        }
        play() {
            return `${super.play()} - [${this.imdbRating}]`;
        }
    }

    const module = {
        getPlayer: function(name) {
            return new Player(name);
            // returns a new player instance with the provided name
        },
        getPlaylist: function(name) {
            return new PlayList(name);
            //returns a new playlist instance with the provided name
        },
        getAudio: function(title, author, length) {
            return new Audio(title, author, length);
            //returns a new audio instance with the provided title, author and length
        },
        getVideo: function(title, author, imdbRating) {
            return new Video(title, author, imdbRating);
            //returns a new video instance with the provided title, author and imdbRating
        }
    };

    return module;
}

module.exports = solve;

let play = solve();
let carPlayer = play.getPlayer('Car')
console.log(carPlayer);
let playlist1 = play.getPlaylist('Cool');
let playlist2 = play.getPlaylist('Green');
let playlist3 = play.getPlaylist('playlist3');
carPlayer.addPlaylist(playlist1);
carPlayer.addPlaylist(playlist2);
carPlayer.addPlaylist(playlist3);
//console.log(carPlayer);
carPlayer.removePlaylist(playlist1);
//console.log(carPlayer);

let audio1 = play.getAudio('They are green', 'Someone', 4);
let audio2 = play.getAudio('I am Batman', 'Some', 5);
playlist1.addPlayable(audio1);
playlist1.addPlayable(audio2);
//console.log(playlist1);
let audio3 = play.getAudio('Green they are', 'Some', 5);
let audio4 = play.getAudio('Green is beautiful', 'Sock', 3);
let audio5 = play.getAudio('To the green and beyond', 'Sony', 2);
playlist2.addPlayable(audio3);
playlist2.addPlayable(audio4);
playlist2.addPlayable(audio5);
//console.log(playlist2);
console.log(carPlayer.search('John'));
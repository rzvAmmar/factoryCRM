var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;


var bookController = function (bookService, nav) {

    var getIndex = function (req, res) {
        var url = 'mongodb://localhost:27017/libraryApp';

        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');
            collection.find({}).toArray(function (err, results) {
                res.render('bookListView', {
                    title: 'Hello from render',
                    nav: nav,
                    books: results
                });

                db.close();
            });
        });
    };

    var getById = function (req, res) {
        var id = new ObjectId(req.params.id);
        var url = 'mongodb://localhost:27017/libraryApp';

        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');
            collection.findOne({
                _id: id
            }, function (err, result) {
                bookService.getBookById(
                    result.bookId,
                    function (err, book) {
                        result.book = book;
                        res.render('bookView', {
                            title: 'Hello from render',
                            nav: nav,
                            book: result
                        });
                    });

                db.close();
            });
        });

    };

    var middleware = function (req, res, next) {
          if (!req.user) {
            res.redirect('/');
        }
        next();
    };

    return {
        getIndex: getIndex,
        getById: getById,
        middleware: middleware
    };
};

module.exports = bookController;
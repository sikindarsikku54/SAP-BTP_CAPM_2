namespace sample.srv;

using { sample.db as db } from '../db/schema';

service BooksWithAuthorsApi {

    entity Books as projection on db.Books;

    @readonly
    entity BooksWithAuthors as projection on db.BooksWithAuthors {
        key id,
        title,
        AuthorName,
        price,
        price * 0.9 as discount : Decimal(10,2)
    };

    entity Bookexpos as projection on db.Bookexpos {
        id,
        title
    };
}


annotate BooksWithAuthorsApi with @(requires: 'support');


service MyService {
    entity Author as projection on db.Author;
}


annotate MyService with @(requires: 'admin');
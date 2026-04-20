namespace sample.db;

entity Books {
    key id: UUID;
    title: String;
    author_id: UUID;
    price: Decimal(10,2);
}

entity Author {
    key Id: UUID;
    name: String;
}

view Bookexpos as select from Books {
    id,
    title
} where price > 10;

view BooksWithAuthors as
    select from Books
    inner join Author
    on Books.author_id = Author.Id {
        Books.id,
        Books.title,
        Author.name as AuthorName,
        Books.price
    };
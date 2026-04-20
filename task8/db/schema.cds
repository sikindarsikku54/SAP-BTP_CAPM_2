namespace demo;

entity Products{
    key ID:Integer;
    description:localized String;
    catagory:localized String;
    brand:localized String;
    price:Decimal(8,2)
}
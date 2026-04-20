
using { cuid } from '@sap/cds/common';

namespace vehicle.db;

entity Dealers : cuid {
    name      : String;
    location  : String;   
}

entity Vehicles {
    key ID        : String;   
    model         : String;
    basePrice     : Decimal(10,2);
    price         : Decimal(10,2);
    status        : String;
    dealer        : Association to Dealers;
    orders        : Composition of many Orders
                    on orders.vehicle = $self;
}

entity Orders : cuid {
    quantity  : Integer;
    vehicle   : Association to Vehicles;
}
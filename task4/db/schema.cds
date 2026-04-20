namespace vehicle.management;

using { cuid } from '@sap/cds/common';

entity States  {
    key ID:Integer;
    stateId   : String(2) not null @mandatory;  //ka OR ap 
    stateName : String not null;
    vehicle   : Association to many Vehicles
                on vehicle.state=$self;
}

entity Vehicles  {
    key ID:Integer;
    vehicleId : String;
    model     : String;
    oldPrice  : Decimal(10,2) default 0 @title : 'OldPrice';
    newPrice  : Decimal(10,2)not null
               @assert.range: [0, 999999999] @title : 'NewPrice';
    state     : Association to States;
    dealer    : Association to Dealers;
}

entity Dealers : cuid{
    dealerName : String not null @mandatory;
    state : Association to States; 
}

entity Customers : cuid {
    customerName : String @title : 'Cus_NAME';
    state : Association to States;
    orders : Association to many Orders
             on orders.customer.ID = ID;
}

entity Orders : cuid {
    orderDate : Date @mandatory;
    customer : Association to Customers;
    items : Composition of many OrderItems
            on items.order = $self;
}

entity OrderItems : cuid{
    productName : String;
    quantity    : Integer;
    order : Association to Orders;
}


entity Users {
  key ID : UUID;
  username : String;
  password : String;
}

namespace task.db;

using { managed } from '@sap/cds/common';


entity Customer : managed {
  key customer_id   : Integer @mandatory;
      first_name    : String(50) @title : 'First Name';
      last_name     : String(50) @title : 'Last Name';
      email         : String(50) @assert.format:'gmail' @UI.LineItem: [{ position: 10 }] @UI.Identification: [{ position: 10 }];
      phone         : Integer @title : 'Phone Number' @assert.format : '[0-9]{10}$';
      address       : LargeString;
      city          : String(50);
      country       : String(50);
      payment       : Composition of Payment on payment.customer=$self;
      shipment      : Composition of Shipment on shipment.customer=$self;
}

entity Payment {
  key payment_id      : Integer;
      quantity        : Integer @mandatory @assert.range:[1,10];
      payment_date    : Date;
      payment_amount  : Decimal(10,2);
      payment_status  : String(50);
      customer        : Association to Customer;
      shipment        : Composition of Shipment on shipment.payment=$self;
}

entity Shipment {
  key shipment_id     : Integer;
      daily_shipments : Integer @title : 'Daily Shipment';
      shipment_date   : Date;
      carrier         : String(50) @readonly;
      tracking_number : String(50);
      shipment_status : String(50)  @UI.Identification: [{ position: 10 }];
      customer        : Association to Customer;
      payment         : Association to Payment;
} 
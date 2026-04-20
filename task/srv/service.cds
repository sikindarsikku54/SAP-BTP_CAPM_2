using { task.db as db } from '../db/schema';

service taskApi{

    entity Customer as projection on db.Customer;
    entity Payment as projection on db.Payment;
    entity Shipment as projection on db.Shipment;

    action CustomerNumber(customer_id:Integer)  ;
    action CustomeAddress(customer_id:Integer)  ;
    action PaymentStatus (payment_id:Integer) ;
    action ShipmentStatus (shipment_id:Integer) ;
    function TotalPayment(payment_id:Integer) returns Decimal(7,2);
    function ShipmentCarring(shipment_id:Integer) returns String;
    function MonthlyShipment(shipment_id:Integer) returns Integer;


}

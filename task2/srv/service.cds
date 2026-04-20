using {vehicle.db as db} from '../db/schema';

service VehicleService {

    entity Dealers  as projection on db.Dealers;
    entity Vehicles as projection on db.Vehicles;
    entity Orders   as projection on db.Orders;

    action approveVehicle(vehicleID : String) returns String;

    function getTotalOrderValue(vehicleID : String) returns Decimal(15,2);
}
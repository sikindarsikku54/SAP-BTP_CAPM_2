using {vehicle.management as db} from '../db/schema';

service VehicleService {

    entity Vehiclesid as projection on db.Vehicles ;

    entity Statesid as projection on db.States;
}



service MyService {
    entity Vehicles as projection on db.Vehicles{
     ID,
     vehicleId ,
     model     ,
     oldPrice  ,
     newPrice  ,
     state     ,
     dealer    
   } ;

    entity States as projection on db.States{
        ID,
        stateId,
        stateName
    };

    type Locations{
        latitude:Decimal(9,6);
        longitude:Decimal(9,6);
    }

    entity Orders as projection on db.Orders;
    entity Dealers as projection on db.Dealers;
    entity Customers as projection on db.Customers;
    function tracklocation(ID : Integer) returns Locations;

}

service LocationService {

  function searchState(name:String) returns array of State;
  function getChildren(geoId:String) returns array of Place;

}

type State {
  name       : String;
  geoId      : String;
  lat        : String;
  lng        : String;
  population : Integer;
}

type Place {
  name       : String;
  geoId      : String;
  lat        : String;
  lng        : String;
  population : Integer;
}
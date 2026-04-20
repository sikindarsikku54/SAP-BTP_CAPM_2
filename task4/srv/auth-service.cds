using { vehicle.management as db } from '../db/schema';

service AuthService {

  entity Users as projection on db.Users;

  action register(username:String, password:String) returns Boolean;
  action login(username:String, password:String) returns Boolean;

}


using { task.db as db } from '../db/data/schema';

service taskApi{
  entity Vehical as projection on db.Vehical;
  action vehicalModel(ID:UUID);
  action vehicalNotify(ID:UUID);
}

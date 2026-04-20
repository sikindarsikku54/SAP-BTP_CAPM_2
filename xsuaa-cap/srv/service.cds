using {demo as db} from '../db/schema';


service MyService {
    @requires: 'admin'
    entity Teachers as projection on db.Teachers;

    @restrict: [
        {
            grant: '*',
            to   : 'admin'
        },
        {
            grant: 'READ',
            to   : 'user'
        }
    ]
    entity Students as projection on db.Students;
}

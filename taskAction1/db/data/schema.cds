namespace task.db;

using {cuid,managed} from '@sap/cds/common';


entity Vehical : cuid , managed{
    model:String @required default 'thar' @title : 'ModelofVehical';
    status:String;
    dealer:String @title : 'NotifiedDealer';
}
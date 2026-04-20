service Geoservice { 
    
    
    function getLocation(city:String) returns { 
        city : String; 
        longitude:String; 
        latitude:String;
        Rank:String; 
        address:LargeString 
    } 

    
}
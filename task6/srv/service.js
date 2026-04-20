const cds = require('@sap/cds');
const axios = require('axios');
 
module.exports = cds.service.impl(function () {
 
  this.on('getLocation', async (req) => {
 
    const city = req.data.city;
 
    if (!city) {
      return req.error(400, 'City is required');
    }
 
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
 
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'cap-app'
        }
      });
 
      if (!response.data || response.data.length === 0) {
        return req.error(404, 'City not found');
      }
 
      const result = response.data[0];
 
      return {
        city: city,
        latitude: result.lat,
        longitude: result.lon,
        address: result.display_name,
        placeType: result.type
      };
 
    } catch (error) {
      return req.error(500, error.message);
    }
 
  });
 
});
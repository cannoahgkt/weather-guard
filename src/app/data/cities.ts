// Popular cities for weather alerts
export const popularCities = [
  // Germany
  { name: 'Berlin, Germany', country: 'DE', region: 'Europe' },
  { name: 'Munich, Germany', country: 'DE', region: 'Europe' },
  { name: 'Hamburg, Germany', country: 'DE', region: 'Europe' },
  { name: 'Cologne, Germany', country: 'DE', region: 'Europe' },
  { name: 'Frankfurt, Germany', country: 'DE', region: 'Europe' },
  
  // UK
  { name: 'London, GB', country: 'GB', region: 'Europe' },
  { name: 'Manchester, GB', country: 'GB', region: 'Europe' },
  { name: 'Birmingham, GB', country: 'GB', region: 'Europe' },
  { name: 'Edinburgh, GB', country: 'GB', region: 'Europe' },
  { name: 'Cardiff, GB', country: 'GB', region: 'Europe' },
  
  // Europe
  { name: 'Paris, France', country: 'FR', region: 'Europe' },
  { name: 'Amsterdam, Netherlands', country: 'NL', region: 'Europe' },
  { name: 'Barcelona, Spain', country: 'ES', region: 'Europe' },
  { name: 'Rome, Italy', country: 'IT', region: 'Europe' },
  { name: 'Vienna, Austria', country: 'AT', region: 'Europe' },
  { name: 'Zurich, Switzerland', country: 'CH', region: 'Europe' },
  
  // North America
  { name: 'New York, USA', country: 'US', region: 'North America' },
  { name: 'Los Angeles, USA', country: 'US', region: 'North America' },
  { name: 'Toronto, Canada', country: 'CA', region: 'North America' },
  { name: 'Vancouver, Canada', country: 'CA', region: 'North America' },
  
  // Asia Pacific
  { name: 'Tokyo, Japan', country: 'JP', region: 'Asia Pacific' },
  { name: 'Sydney, Australia', country: 'AU', region: 'Asia Pacific' },
  { name: 'Singapore', country: 'SG', region: 'Asia Pacific' },
  { name: 'Seoul, South Korea', country: 'KR', region: 'Asia Pacific' }
];

export const groupedCities = popularCities.reduce((acc, city) => {
  if (!acc[city.region]) {
    acc[city.region] = [];
  }
  acc[city.region].push(city);
  return acc;
}, {} as Record<string, typeof popularCities>);

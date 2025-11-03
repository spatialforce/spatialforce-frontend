import React from 'react';
import '../Covid19 webmap/All.css'

interface CountryCovidData {
  country: string;
  countryInfo: {
    _id: number;
    lat: number;
    long: number;
    flag: string;
    iso2: string;
    iso3: string;
  };
  cases: number;
  deaths: number;
  recovered: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  population: number;
  [key: string]: any;
}

interface CountryHistoricalData {
  country: string;
  timeline: {
    cases: Record<string, number>;
    deaths: Record<string, number>;
    recovered: Record<string, number>;
  };
}

interface CountryComparisonToolProps {
  countries: string[];
  data: CountryCovidData[];
  historicalData?: CountryHistoricalData[];
  onClose: () => void;
  visible: boolean; // New prop to control visibility
}

const CountryComparisonTool: React.FC<CountryComparisonToolProps> = ({ 
  countries, 
  data, 
  historicalData, 
  onClose,
  visible 
}) => {
  if (!visible || !countries || countries.length === 0) return null;

  const selectedCountriesData = data.filter(country => 
    countries.includes(country.country)
  );

  const getLatestValue = (country: CountryCovidData, field: string): string => {
    const value = country[field];
    return value ? value.toLocaleString() : 'N/A';
  };

  const getPerMillionValue = (country: CountryCovidData, field: string): string => {
    const value = country[`${field}PerOneMillion` as keyof CountryCovidData];
    return typeof value === 'number' ? Math.round(value).toLocaleString() : 'N/A';
  };

  return (
    <div className={`country-comparison-tool ${visible ? 'visible' : ''}`}>
      <div className="comparison-header">
        <h3>Selected Countries ({countries.length})</h3>
        <button 
          className="close-comparison" 
          onClick={onClose}
          aria-label="Close comparison tool"
        >
        </button>
      </div>
      
      <div className="comparison-countries-container">
        {selectedCountriesData.map(country => (
          <div key={country.countryInfo._id} className="comparison-country">
            <div className="country-header">
              <img 
                src={country.countryInfo.flag} 
                alt={country.country} 
                className="comparison-flag"
                loading="lazy"
              />
              <h4>{country.country}</h4>
            </div>
            <div className="comparison-stats">
              <div className="stat-row">
                <span className="stat-label">Cases: </span>
                <span className="stat-value">
                  {getLatestValue(country, 'cases')}
                  <small> ({getPerMillionValue(country, 'cases')}/M)</small>
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Deaths: </span>
                <span className="stat-value">
                  {getLatestValue(country, 'deaths')}
                  <small> ({getPerMillionValue(country, 'deaths')}/M)</small>
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Recovered: </span>
                <span className="stat-value">
                  {getLatestValue(country, 'recovered')}
                </span>
              </div>
             
              <div className="stat-row">
                <span className="stat-label">Population: </span>
                <span className="stat-value">
                  {country.population.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CountryComparisonTool;
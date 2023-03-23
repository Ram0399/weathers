import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { SearchBox } from './components/SearchBox';
import { LocationButton } from './components/LocationButton';
import { WeatherDisplay } from './components/WeatherDisplay';
import { SetUnits } from './components/SetUnits';

class App extends Component {
  state = {
    loading: true,
    error: null,
    searchKeyword: '',
    locationId: '1269843',
    weatherData: null,
    temperatureUnits: 'C',
  };

  componentDidMount() {
    this.getWeather();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.locationId !== prevState.locationId || this.state.temperatureUnits !== prevState.temperatureUnits) {
      this.getWeather();
    }
  }

  searchLocations = debounce(keyword => {
    fetch(`https://api.weatherserver.com/weather/cities/${keyword}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          searchResults: data,
        });
      })
      .catch(error => {
        this.setState({
          error: error.message,
        });
      });
  }, 500);

  handleSearchChange = event => {
    const keyword = event.target.value.trim();
    if (keyword.length >= 3) {
      this.setState({
        searchKeyword: keyword,
      });
      this.searchLocations(keyword);
    } else {
      this.setState({
        searchKeyword: '',
        searchResults: null,
      });
    }
  };

  handleLocationClick = locationId => {
    this.setState({
      locationId: locationId.toString(),
      searchKeyword: '',
      searchResults: null,
    });
  };

  handleSetUnits = units => {
    this.setState({
      temperatureUnits: units,
    });
  };

  getWeather = () => {
    this.setState({
      loading: true,
      error: null,
    });

    fetch(`https://api.weatherserver.com/weather/current/${this.state.locationId}/${this.state.temperatureUnits}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          weatherData: data,
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          error: error.message,
          loading: false,
        });
      });
  };

  render() {
    return (
      <div className="app-container">
        <div className="search-box-container">
          <SearchBox
            value={this.state.searchKeyword}
            onChange={this.handleSearchChange}
            results={this.state.searchResults}
            onResultClick={this.handleLocationClick}
          />
        </div>
        <div className="location-buttons-container">
          <LocationButton locationId="1269843" onClick={this.handleLocationClick}>
            Bengaluru
          </LocationButton>
          <LocationButton locationId="2643743" onClick={this.handleLocationClick}>
            London
          </LocationButton>
          <LocationButton locationId="4887398" onClick={this.handleLocationClick}>
            Chicago
          </LocationButton>
          <LocationButton locationId="5128638" onClick={this.handleLocationClick}>
            New York
          </LocationButton>
          <LocationButton locationId="1264527" onClick={this.handleLocationClick}>
            New Delhi
          </LocationButton>
          <LocationButton locationId="1850147" onClick={this.handleLocationClick}>
            Tokyo
          </LocationButton>
        </div>
        <div className="weather-display-container">
          {this.state.loading ? (
            <div className="is-loading" />
          ) : this.state.error

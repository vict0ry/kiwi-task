import React, { Component } from 'react';
import AppSearchForm from './appSearchForm';
import AppHeader from './AppHeader';
import AppFlightsList from './AppFlightsList';


class App extends Component {
  constructor() {
    super();
    this.state = {
      flights: null,
      isLoading: null
    }
  }
  onRecieveFlights(data) {
    this.setState({
      flights: data.flights,
      isLoading: data.loading
    });
  }
  render() {
    return (
      <div className="App">
        <AppHeader />
        <AppSearchForm outputFlights={this.onRecieveFlights.bind(this)} />
        <AppFlightsList isLoading={this.state.isLoading} flights={this.state.flights}/>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import styles from './App.css';

import {
  Container,
  Navbar,
  NavbarBrand,
  Row,
  Jumbotron,
  InputGroup,
  InputGroupAddon,
  Button,
  FormGroup,
  Input,
  Col
} from 'reactstrap';

import Weather from './Weather';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: null,
      cityList: [],
      newCityName: ''
    };
  }

  getCityList = () => {
    fetch('/api/cities')
      .then(res => res.json())
      .then(res => {
        var cityList = res.map(r => r.city_name);
        this.setState({ cityList });
      });
  };

  handleInputChange = (e) => {
    this.setState({ newCityName: e.target.value });
  };

  handleAddCity = () => {
    fetch('/api/cities', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: this.state.newCityName })
    })
      .then(res => res.json())
      .then(res => {
        this.getCityList();
        this.setState({ newCityName: '' });
      });
  };

  getWeather = (city) => {
    fetch(`/api/weather/${city}`)
      .then(res => res.json())
      .then(weather => {
        console.log(weather);
        this.setState({ weather });
      });
  }

  handleChangeCity = (e) => {
    this.getWeather(e.target.value);
  }

  componentDidMount() {
    this.getCityList();
  }

  render() {
    return (
      <div className="centered">
        <div className="navbar">
          <h1>My Weather</h1>
        </div>

        <div className="bg">

          <h1 className="display-3">MyWeather</h1>
          <p className="lead">The current weather for your favorite cities!</p>
          <div className="grp">
            <input 
              placeholder="New city name..." 
              type="text" 
              class="form-control" value=""
              value={this.state.newCityName}
              onChange={this.handleInputChange}
            />
            <InputGroupAddon addonType="append">
              <Button className="btn" color="primary" onClick={this.handleAddCity}>Add City</Button>
            </InputGroupAddon>

          </div>

        </div>


        <Row>
          <Col>
            <h1 className="display-5">Current Weather</h1>
            <div>
              <Input type="select" onChange={this.handleChangeCity}>
                {this.state.cityList.length === 0 && <option>No cities added yet.</option>}
                {this.state.cityList.length > 0 && <option>Select a city.</option>}
                {this.state.cityList.map((city, i) => <option key={i}>{city}</option>)}
              </Input>
            </div>
          </Col>
        </Row>
        <Weather data={this.state.weather} />
      </div>
    );
  }
}

export default App;

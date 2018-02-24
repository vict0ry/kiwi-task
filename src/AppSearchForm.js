import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import AppMultiSelect from './AppMultipleSelect';




class AppSearchForm extends Component {
    state = {
        from: null,
        to: null,
        dateFrom: moment(),
    };
    flightsList(data) {
        this.props.outputFlights(data);
    }
    onSubmit = e => {
        if (this.state.from && this.state.to) {
            e.preventDefault();
            const data = {loading: true, flights: null};
            const formatedData =  moment(this.state.dateFrom).format("DD/MM/YYYY");
            this.flightsList(data);
            axios.get(`https://api.skypicker.com/flights?flyFrom=${this.state.from}&to=${this.state.to}&dateFrom=${formatedData}`)
                .then(response => { 
                    data.loading = false;
                    data.flights = response.data.data;
                    this.flightsList(data)
                })
                .catch(error => {
                    data.loading = false;
                    data.flights = null;
                    this.flightsList(data);
                    console.log(error.response)
                });
        }
    };
    handleDatePickerChange(date) {
        this.setState({
            dateFrom: date
        });
      }
    change = e => {
        if(e.name) {
            this.setState({
                [e.name]: e.multi
            });
        }
      };
    render() { 
        return (
            <div className="container">
                <form>             
                    <Grid spacing={24} container>
                        <Grid className="lookup-item" item xs={12} md={3}>
                            <AppMultiSelect
                                    placeholder={'Select start point'}
                                    selectChanged={this.change.bind(this)}
                                    onChange={e => this.change(e)}
                                    name="from" />
                        </Grid>

                        <Grid className="lookup-item" item xs={12} md={3}>
                            <AppMultiSelect
                            placeholder={'Select destination'}
                            selectChanged={this.change.bind(this)}
                            onChange={e => this.change(e)}
                            name="to" />
                                <br /><br />
                        </Grid>

                        <Grid className="lookup-item" item xs={12} md={3}>
                            <DatePicker 
                            name="dateFrom"
                            width="100%"
                            className={'date-picker'}
                            onChange={this.handleDatePickerChange.bind(this)}
                            selected={this.state.dateFrom}/>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Button variant="raised" onClick={e => this.onSubmit(e)}> Find Flights </Button>
                        </Grid>

                    </Grid>
                </form>
            </div>
        );
    }
}
 
export default AppSearchForm;
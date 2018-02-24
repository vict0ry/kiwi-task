import React, { Component } from 'react';
import moment from 'moment';
import { CircularProgress } from 'material-ui/Progress';
import AppFlyItem from './AppFlyItem';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';


class AppFlightsList extends Component {
    state = {
        current: 1,
      };
    onPaginationChange = (page) => {
        this.setState({
          current: page,
        });
      }
    maxElements = 5;
    getFlights() {
        const from = (this.state.current - 1) * this.maxElements;
        const to = from + this.maxElements;
        return this.props.flights.slice(from, to);
    }
    render() {
            if (this.props.isLoading) {
                return(
                <div className="center">
                    <CircularProgress />
                </div>
                );
            } else if (this.props.flights) {
                const lists = this.getFlights().map((item, i) => {
                    return(
                        <div key={i}>
                            <AppFlyItem
                                cityFrom={item.cityFrom}
                                cityTo={item.cityTo}
                                aTimeFrom={moment.unix(item.aTime).format("DD/MM/YYYY hh:mm")} 
                                dTimeTo={moment.unix(item.dTime).format("DD/MM/YYYY hh:mm")}
                                timeDuration={item.fly_duration}
                                price={item.price}
                            />
                        </div>
                    )
                });
                const pagination = <Pagination onChange={this.onPaginationChange} current={this.state.current} total={this.props.flights.length} />;
                return (
                <div className="container">
                    {lists.length > 0 ? <div>{lists} {pagination}</div> : 'no fligths for this destination' }
                </div>);
            } else {
                return (<div className="container">Please select a destination and departure point.</div>);
            }
    }
}
 
export default AppFlightsList;
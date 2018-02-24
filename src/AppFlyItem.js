import React, { Component } from 'react';
import ExpansionPanel, {
    ExpansionPanelSummary,
    ExpansionPanelDetails,
  } from 'material-ui/ExpansionPanel';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';


class AppFlyItem extends Component {
    state = {};
    render() { 
        return (
        <div className="flyItem">
            <ExpansionPanel>
                <ExpansionPanelSummary>
                    <Grid spacing={24} container>
                            <Grid item xs={12} md={3}>Price: {this.props.price} EUR</Grid>
                            <Grid item xs={12} md={3}>{this.props.cityFrom} ---> {this.props.cityTo}</Grid>
                            <Grid item xs={12} md={3}>Time: <br /> {this.props.aTimeFrom} <br /> {this.props.dTimeTo}</Grid>
                            <Grid item xs={12} md={3}>Flight time: {this.props.timeDuration}</Grid>
                    </Grid>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <Typography>
                            Once here will be more information :)
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
        );
    }
}
 
export default AppFlyItem;
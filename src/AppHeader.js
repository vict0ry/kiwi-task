import React, { Component } from 'react'


class AppHeader extends Component {
    state = {};
    render() { 
        return (
            <div>
                <header className="App-header">
                    <img width="100px;" src={"https://www.kiwi.com/images/logos/kiwicom/navbar.png?v=1"} alt="kiwi logo"/>
                    <div className="container">
                        <h1 className="App-title">Kiwi api lookup</h1>
                    </div>
                </header><br />
            </div>
        );
    }
}
 
export default AppHeader;
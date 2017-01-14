import React, { Component } from 'react';
import './App.css';

//Alternatively, I could have written this as a stateless functional component.
class TableHeading extends Component {
    render() {
        let ATLink = <a href="#" onClick={this.props.onATClick}>All Time Points</a>;
        let recentLink = <a href="#" onClick={this.props.onRecentClick}>Last 30 Day Points</a>;

        if(this.props.isRecent) {
            recentLink = <a href="#" onClick={this.props.onRecentClick}>
                <i className="fa fa-star" aria-hidden="true"></i> Last 30 Day Points</a>;
        }

        else {
            ATLink = <a href="#" onClick={this.props.onATClick}>
                <i className="fa fa-star" aria-hidden="true"></i> All Times Points</a>;
        }

        return (
            <thead>
            <tr>
                <th>Name</th>
                <th>{ATLink}</th>
                <th>{recentLink}</th>
            </tr>
            </thead>


        );
    }
}

TableHeading.propTypes = {
    onATClick: React.PropTypes.func,
    onRecentClick: React.PropTypes.func,
    isRecent: React.PropTypes.bool
};

class App extends Component  {
    constructor(props) {
        super(props);
        this.state = {sortedArr: [], isRecent: true}

        this.sortByAllTime = this.sortByAllTime.bind(this);
        this.sortByRecent = this.sortByRecent.bind(this);
    }

    componentDidMount() {
        let self = this;
        let req = new XMLHttpRequest();
        req.open("GET", "https://fcctop100.herokuapp.com/api/fccusers/top/recent", true);

        req.onload = function() {
            if(this.status >= 200 && this.status < 400) {
                let sortedArr = JSON.parse(this.response);
                self.setState({sortedArr: sortedArr});
            }
            else {
                console.log("Error fetching data. Non-success code.");
            }
        };

        req.onerror = function() {
            console.log("Connection error.");
        };

        req.send();
    }

    sortByAllTime(e) {
        e.preventDefault();

        this.setState({sortedArr: this.state.sortedArr.sort(function (a, b) {
                if(b.allTime - a.alltime === 0) {
                    return b.recent - a.recent;
                }

                return b.alltime - a.alltime;
            }),
            isRecent: false
        });
    }

    sortByRecent(e) {
        e.preventDefault();

        this.setState({sortedArr: this.state.sortedArr.sort(function (a, b) {
                if (b.recent - a.recent === 0) {
                    return b.alltime - a.alltime;
                }

                return b.recent - a.recent;
            }),
            isRecent: true
        });
    }

    render() {
        return (
            <div>
            <table className="table table-bordered">
                <TableHeading isRecent={this.state.isRecent} onATClick={this.sortByAllTime}
                              onRecentClick={this.sortByRecent} />
                <tbody>
                    {this.state.sortedArr.map(function (key) {
                        return (
                            <tr key={key.username}>
                                <td><img className="profile-img img-thumbnail" src={key.img} /> {key.username}</td>
                                <td>{key.alltime}</td>
                                <td>{key.recent}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </div>
        );
    }
}

export default App;

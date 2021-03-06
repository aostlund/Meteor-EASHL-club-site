import React, { Component } from 'react';

export default class PrevNext extends Component {

  render() {
    if (this.props.page == 0) {
      return (
        <div className="center-buttons">
          <a href={`/matches/list/${parseInt(this.props.page) + 1}`}>
            <button className="match-button">Next</button>
          </a>
        </div>
      )
    } else {
      return (
        <div className="center-buttons">
          <a href={`/matches/list/${this.props.page - 1}`}>
            <button className="match-button">Previous</button>
          </a>
          <a href={`/matches/list/${parseInt(this.props.page) + 1}`}>
            <button className="match-button">Next</button>
          </a>
        </div>
      )
    }
  }
}

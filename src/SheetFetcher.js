import React from 'react';
import classNames from 'classnames';
//import _ from 'lodash';

class SheetFetcher extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sheetValues: null
    }

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    //fetchData
  }

  componentDidUpdate(prevProps, prevState) {
    //fetchData
  }

  fetchData() {
    this.props.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: this.props.spreadsheet,
      range: 'A1:F500',
    }).then((response) => {
      this.setState({sheetValues: response.result.values});
    }, (response) => {
      console.error(response.result.error.message);
    });
  }

  renderTable() {
    return(
      <table>
        <thead>
          <tr className="tr-header">
            <td></td>
            <td>28</td>
            <td>1</td>
            <td>2</td>
          </tr>
        </thead>
        <tbody>
          <tr>Leo</tr>
          <tr>Ju</tr>
          <tr>Bira</tr>
          <tr>Greg</tr>
          </tbody>
      </table>
    )
  }

  render() {
    return (
      <div className={classNames('sheets-wrapper', this.props.type)}>
        {
          this.renderTable()
        }
      </div>
    );
  }
}

export default SheetFetcher;

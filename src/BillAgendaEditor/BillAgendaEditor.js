import React, { Component } from 'react';

const agendasDataSourceUrl = 'http://data.obudget.org/api/queries/1456/results.json?api_key=04011ecd82e3a0127df96ce56ace91b7a71dc764';

class BillAgendaEditor extends Component {
  constructor(props) {
    super(props);

    const storedAgendas = window.localStorage.getItem('agendas');

    this.state = {
      agendas: storedAgendas && JSON.parse(storedAgendas) || null
    };
  }

  componentDidMount() {
    if (!this.state.agendas) {
      fetch(agendasDataSourceUrl)
        .then(response => {
          return response.json();
        }).then(({ query_result: queryResult }) => {
          this.setState({
            agendas: queryResult.data.rows
          });
          window.localStorage.setItem('agendas', JSON.stringify(queryResult.data.rows))
        });
    }
  }

  render() {
    return (<div>
      {this.state.agendas && this.state.agendas.map(agenda => {
        return <div>
          {agenda.name}
        </div>
      })}

      <select>
        <option value="-1.0">התנגדות מלאה</option>
        <option value="-0.5">התנגדות חלקית</option>
        <option value="0.0">לא ניתן לקבוע</option>
        <option value="0.5">תמיכה חלקית</option>
        <option value="1.0">תמיכה מלאה</option>
      </select>
    </div>)
  }
}

export default BillAgendaEditor

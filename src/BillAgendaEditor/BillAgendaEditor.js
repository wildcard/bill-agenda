import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import TextField from 'material-ui/TextField';

import AgendasPicker from '../AgendasPicker/AgendasPicker';

const agendasDataSourceUrl = 'http://data.obudget.org/api/queries/1456/results.json?api_key=04011ecd82e3a0127df96ce56ace91b7a71dc764';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
});

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

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  submit = ({
    billNumber,
    corrlelation,
    description,
    agendaId,
    creatorId
  }) => {
    const {  mutate } = this.props;
    mutate({
      variables: {
        billNumber,
        corrlelation,
        description,
        agendaId,
        creatorId,
      }
    })
      .then(({ data }) => {
        console.log('got data', data);
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
  }

  addAgendas = () => {
    const {  mutate } = this.props;

    if (!this.state.agendas) {
      return;
    }

    let addAgendasPromises = this.state.agendas.map(agenda => {
      const {
        id,
        name
      } = agenda;
      return mutate({
        variables: {
          id,
          name
        }
      });
    });

    Promise.all(addAgendasPromises).then(agendasIds => {
      console.log(agendasIds);
    })
  }

  render() {
    const { classes, mutate } = this.props;

    return (<div>
            {this.state.agendas ? <button onClick={this.addAgendas} >import agendas</button> : null}

      {this.state.agendas ?
        <AgendasPicker agendas={
          this.state.agendas.map(agenda => ({ label: agenda.name, ...agenda }))}/>
          : 'Loading agendas'}

      <select>
        <option value="-1.0">התנגדות מלאה</option>
        <option value="-0.5">התנגדות חלקית</option>
        <option value="0.0">לא ניתן לקבוע</option>
        <option value="0.5">תמיכה חלקית</option>
        <option value="1.0">תמיכה מלאה</option>
      </select>

      <TextField
          id="multiline-flexible"
          label="Multiline"
          multiline
          rowsMax="4"
          value={this.state.multiline}
          onChange={this.handleChange('multiline')}
          className={classes.textField}
          margin="normal"
        />
    </div>)
  }
}

const submitAgendaForBill = gql`
  mutation submitAgendaForBill(
    $billNumber: Int!,
    $corrlelation: Int!,
    $description: String,
    $agendaId: ID!,
    $creatorId: ID!
  ) {
    createBillAgenda(
      billNumber: $billNumber,
      corrlelation: $corrlelation,
      description: $description,
      agendaId: $agendaId,
      creatorId: $creatorId
    ) {
      id
    }
  }
`;

const scheme = gql`
  mutation createAgenda(
    $id: Int!,
    $name: String!
  ) {
    createAgenda (
     originalId: $id,
     name: $name,
   ) {
     id
   }
  }
`

export default compose(
  graphql(scheme),
  withStyles(styles)
)(BillAgendaEditor)

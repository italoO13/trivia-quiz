import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CreateButton from '../components/CreateButton';
import { readDb } from '../services/firebase';

class Ranking extends Component {
  state ={
    ranking: [],
    isloading: false,
  }

  componentDidMount() {
    this.setState({
      isloading: true,
    }, async () => {
      const dadosRanking = await readDb();
      dadosRanking.sort(this.ordemScore);
      this.setState({
        ranking: dadosRanking,
        isloading: false,
      });
    });
  }

  ordemScore = (a, b) => {
    const numberNeg = -1;
    if (a.score > b.score) {
      return numberNeg;
    }
    const one = 1;
    return one;
  }

  renderRanking = (rank, index) => (
    <ul key={ index }>
      <li><img alt="avatar" src={ rank.picture } /></li>
      <li data-testid={ `player-name-${index}` }>{rank.name}</li>
      <li data-testid={ `player-score-${index}` }>{rank.score}</li>
    </ul>
  )

  render() {
    const { history } = this.props;
    const { ranking, isloading } = this.state;
    return (
      <section>
        <h1 data-testid="ranking-title">Ranking</h1>
        {!isloading
          ? ranking.map(this.renderRanking)
          : <h1>Carregando...</h1>}
        <CreateButton
          placeholder="Home page"
          testID="btn-go-home"
          onClick={ () => history.push('/') }
        />
      </section>
    );
  }
}

export default Ranking;

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired }),
}.isRequired;

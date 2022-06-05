import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CreateButton from '../components/CreateButton';
import { readDb } from '../services/firebase';
import styles from '../styles/Ranking.module.scss';
import retangle from '../imgs/Rectangle.png';

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
    <ul key={ index } className={ styles.ul_no_dots }>
      <li className={ styles.ul_no_dots_rank }>
        <div>
          <span>{index + 1}</span>
          <img src={ retangle } alt="rectangle" />
        </div>
      </li>
      {/* <li><img alt="avatar"
      src={ rank.picture } className={ styles.img_player } /></li> */}
      <div className={ styles.ul_no_dots_rank_info }>
        <li data-testid={ `player-name-${index}` }>{rank.name}</li>
        <li data-testid={ `player-score-${index}` }>{`${rank.score} pontos`}</li>
      </div>
    </ul>
  )

  render() {
    const { history } = this.props;
    const { ranking, isloading } = this.state;
    return (
      <section className={ styles.section_container }>
        <h1
          data-testid="ranking-title"
          className={ styles.title }
        >
          Ranking
        </h1>
        <hr className={ styles.hr } />

        {!isloading
          ? ranking.map(this.renderRanking)
          : <img src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!c1024wm0" alt="carregando" />}
        <CreateButton
          className={ styles.button }
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

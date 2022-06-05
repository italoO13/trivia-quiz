import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { getQuestionsThunk, setScore, correctAction } from '../redux/action';
import QuestionCard from '../components/QuestionCard';
import '../styles/Game.css';

class GameScreen extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isButtonNextVisible: false,
      currentQuestion: 0,
      timer: 30,
      isButtonDisabled: false,
      questionsAnsweredCounter: 0,
      correctColor: '',
      incorrectColor: '',
    };
  }

  async componentDidMount() {
    const { getQuestions, history } = this.props;
    await getQuestions();
    const { invalidToken } = this.props;
    console.log(invalidToken);
    if (invalidToken === true) {
      history.push('/');
      localStorage.removeItem('token');
    }
    this.setState({
      isLoading: false,
    });
    this.timerHandler();
  }

  timerHandler = () => {
    const secondIntervalInMS = 1000;

    setInterval(() => this.setState((previousState) => ({
      timer: previousState.timer > 0 ? previousState.timer - 1 : 0,
    }), () => {
      const { timer } = this.state;
      if (timer === 0) {
        this.setState({
          isButtonDisabled: true,
          isButtonNextVisible: true,
        });
      }
    }), secondIntervalInMS);
  }

  answerClickHandler = ({ target: { id } }) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/parentElement
    this.setState({
      isButtonNextVisible: true,
      isButtonDisabled: true,
      correctColor: 'greenButton',
      incorrectColor: 'redButton',
    });

    if (id.includes('correct')) {
      const { dispatchScore, dispatchAction } = this.props;
      dispatchScore(this.handleScore());
      dispatchAction(1);
    }
  }

  handleFeebackRouter = () => {
    const { questionsAnsweredCounter } = this.state;
    const { history } = this.props;
    const maxQuestions = 5;
    if (questionsAnsweredCounter === maxQuestions) {
      this.savePlayerOnRanking();
      history.push('/feedback');
    }
  }

  savePlayerOnRanking = () => {
    const ranking = localStorage.getItem('ranking');
    const { player: { name, score, picture } } = this.props;
    if (!ranking) {
      const firstPlayer = JSON.stringify([{ name, score, picture }]);
      localStorage.setItem('ranking', firstPlayer);
    } else {
      //   const negative = -1;
      const rankingArray = JSON.parse(ranking);
      const newRanking = [...rankingArray, { name, score, picture }];
      //     .sort((a, b) => {
      //       if (a.score > b.score) return negative;
      //       if (a.score < b.score) return 1;
      //       return 0;
      //     });
      const newRankingString = JSON.stringify(newRanking);
      localStorage.setItem('ranking', newRankingString);
    }
  }

  handleNextQuestion = () => {
    const { currentQuestion } = this.state;
    const maxAnswers = 5;

    this.setState({
      currentQuestion: currentQuestion + 1,
      isButtonNextVisible: false,
      isLoading: true,
      timer: 30,
      isButtonDisabled: false,
      correctColor: '',
      incorrectColor: '',
    }, () => this.setState({ isLoading: false }));

    this.setState((prevState) => ({
      questionsAnsweredCounter: prevState.questionsAnsweredCounter <= maxAnswers
        ? prevState.questionsAnsweredCounter + 1 : maxAnswers,
    }), () => this.handleFeebackRouter());
  }

  handleScore = () => {
    const { game: { questions } } = this.props;
    const { currentQuestion, timer } = this.state;
    const { difficulty } = questions[currentQuestion];
    const initialMultipler = 10;
    const easy = 1;
    const medium = 2;
    const hard = 3;
    switch (difficulty) {
    case 'medium':
      return initialMultipler + (timer * medium);
    case 'hard':
      return initialMultipler + (timer * hard);
    default:
      return initialMultipler + (timer * easy);
    }
  };

  render() {
    const { game: { questions } } = this.props;
    const { isLoading, isButtonNextVisible, currentQuestion, isButtonDisabled,
      timer, correctColor, incorrectColor } = this.state;
    return (
      <div>
        <Header />
        <div className="div-game-screen-container">
          <section className="section-game-screen">
            <article className="game-container">
              <p className="p-data-container">
                { !isLoading && (`Tempo restante: ${timer} seg`) }
              </p>
              { isLoading ? <p>Loading...</p> : (
                <QuestionCard
                  isButtonDisabled={ isButtonDisabled }
                  answerClickHandler={ this.answerClickHandler }
                  question={ questions[currentQuestion] }
                  correctColor={ correctColor }
                  incorrectColor={ incorrectColor }
                />)}
              { isButtonNextVisible && (
                <button
                  className="next-button"
                  type="button"
                  data-testid="btn-next"
                  onClick={ this.handleNextQuestion }
                >
                  Next
                </button>)}
            </article>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.token,
  game: state.game,
  player: state.player,
  invalidToken: state.game.invalidToken,
});

const mapDispatchToProps = (dispatch) => ({
  getQuestions: (token) => dispatch(getQuestionsThunk(token)),
  dispatchScore: (score) => dispatch(setScore(score)),
  dispatchAction: (assertions) => dispatch(correctAction(assertions)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameScreen);

GameScreen.propTypes = {
  getQuestions: PropTypes.func,
  token: PropTypes.string,
}.isRequired;

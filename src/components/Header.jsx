import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';
import { pictureAction } from '../redux/action';
import styles from '../styles/Header.module.scss';

class Header extends Component {
  componentDidMount() {
    const { player, savePicture } = this.props;
    const playerPicture = this.imgGravatar(player.gravatarEmail);
    savePicture(playerPicture);
  }

  imgGravatar = (email) => {
    const hash = md5(email).toString();
    return `https://www.gravatar.com/avatar/${hash}`;
  };

  render() {
    const { player } = this.props;

    return (
      <header className={ styles.header_container }>
        {/* <img src={ logo } alt="logo" /> */}
        <div className={ styles.div_player }>
          <img
            className={ styles.img_player }
            src={ this.imgGravatar(player.gravatarEmail) }
            alt="Profile-Img"
            data-testid="header-profile-picture"
          />
          <p
            data-testid="header-player-name"
          >
            { player.name }
          </p>
        </div>
        <div>
          <span>Pontos: </span>
          <span data-testid="header-score">
            { player.score }
          </span>
        </div>
      </header>
    );
  }
}
const mapStateToProps = (state) => ({
  player: state.player,
});

const mapDispatchToProps = (dispatch) => ({
  savePicture: (picture) => dispatch(pictureAction(picture)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);

Header.propTypes = {
  player: PropTypes.shape({
    gravatarEmail: PropTypes.string,
    name: PropTypes.string,
    score: PropTypes.number,
  }).isRequired,
  savePicture: PropTypes.func.isRequired,
};

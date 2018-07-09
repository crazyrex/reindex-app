import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import organizations from 'assets/img/organizations.png';
import electricians from 'assets/img/electricians.png';
import aircon from 'assets/img/aircon.png';
import carRent from 'assets/img/car-rent.png';
import fastfood from 'assets/img/fastfood.png';
import lawyers from 'assets/img/lawyers.png';
import yeshiva from 'assets/img/yeshiva.png';
import restaurant from 'assets/img/restaurant.png';
import plumbers from 'assets/img/plumbers.png';
import admor from 'assets/img/admor.png';
import mikveh from 'assets/img/mikveh.png';
import gmah from 'assets/img/gmah.png';
import deliveries from 'assets/img/deliveries.png';
import { updateSearchLocation } from 'utils/functions';

import { loadFilterData, loadSubCategories } from 'components/SearchBar/actions';

import iconsData from './icons';

const styles = require('./SearchIcons.scss');

const ICONS = {
  'גמ"חים': gmah,
  'עורכי דין': lawyers,
  'מיזוג אויר': aircon,
  'מסעדות': restaurant,
  'ישיבות': yeshiva,
  'מזון מהיר': fastfood,
  'אגודות וארגונים': organizations,
  'חשמלאים': electricians,
  'אדמו"רים ורבנים': admor,
  'אינסטלטורים': plumbers,
  'מקוואות': mikveh,
  'השכרת רכב': carRent,
};


class SearchIcons extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  updateSearchLocation(key, value, tab, index) {
    if (index > -1) return updateSearchLocation(key, value, tab);
    return updateSearchLocation('q', value, tab);
  }

  handleClick(searchText) {
    this.props.handleClick(searchText);
    this.updateSearchLocation('categories', searchText, 'businesses', -1);
  }
  render() {
    return (
      <div className={styles['search-icons']}>
        {iconsData.data.map((icon, key) =>
          <div key={key} onClick={() => { this.props.loadSubCategories({ value: icon, children: true }); }}>
            <Link to={`/cat/${icon.replace(/-/g, '_').replace(/ /g, '-')}`} className="link" />
            <a>
              <div className={styles['wrapper-image']}><img src={ICONS[icon]} role="presentation" /></div>
              <span>{icon}</span>
            </a>
          </div>
      )}
      </div>
    );
  }

}

SearchIcons.propTypes = {
  data: React.PropTypes.object,
  handleClick: React.PropTypes.func,
  loadSubCategories: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    handleClick: (searchText) => {
      dispatch(loadFilterData({ searchText, tabType: 'businesses', filterType: 'categories' }));
    },
    loadSubCategories: (data) => {
      dispatch(loadSubCategories(data));
    },
  };
}

export default connect(null, mapDispatchToProps)(SearchIcons);

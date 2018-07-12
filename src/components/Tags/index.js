import React from 'react';
import PropTypes from 'prop-types';
import Chip from 'material-ui/Chip';

import './Tags.scss';

class Tags extends React.PureComponent {

  onTouchTap(category) {
    if (!category.disabled) {
      this.props.onTouchTap(category);
    }
  }
  render() {
    return (
      <div>
        {Object.keys(this.props.data).map((array) =>
          <div className="wrapper-subCategories">
            {this.props.data[array].map((category) =>
              <Chip backgroundColor="#3852a4" labelColor="#ffffff" onTouchTap={() => this.onTouchTap(category)}>
              {category._source.content}
              </Chip>
          )}
          </div>
        )}
      </div>

    );
  }
}

Tags.propTypes = {
  data: PropTypes.array,
  onTouchTap: PropTypes.func,
};


export default Tags;

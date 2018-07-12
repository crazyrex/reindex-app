import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';

import Header from '../index';

describe('<Header />', () => {
  it('should render a div', () => {
    const renderedComponent = shallow(
      <Header />
    );
    expect(renderedComponent.find('div').length).toEqual(1);
  });
});

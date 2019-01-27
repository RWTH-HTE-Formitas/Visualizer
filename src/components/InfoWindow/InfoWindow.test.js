import React from 'react';
import Enzyme, {shallow} from 'enzyme' ;
import Adapter from 'enzyme-adapter-react-16';
import InfoWindow from './InfoWindow';

Enzyme.configure({adapter: new Adapter()});

describe("InfoWindow snapshot testing", () => {
  test('Renders correctly', () => {
    const wrapper = shallow(<InfoWindow />);
    expect(wrapper).toMatchSnapshot();
});
});
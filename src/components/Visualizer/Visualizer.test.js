import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme' ;
import Visualizer from './Visualizer';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

describe("Visualizer component rendering", () => {
    // Tests whether Visualizer is rendered without problems
    test("Renders correctly", () => {
        const wrapper = shallow(<Visualizer />);
        expect(wrapper.exists()).toBe(true);
    });
});

describe("Visualizer markDefects(data)", () => {
    const mockDataEmpty = null;
    const mockDataFull = {
        showWindow: true,
        objectData: {
            Category: 'IFCWall',
            ID: '12345',
            Name: 'Wand',
            Status: '1'
        }
    }

    // Tests whether defects are added correctly to the state
    test("State with empty data correct", () => {
        const wrapper = shallow(<Visualizer />);
        wrapper.instance().markDefects(mockDataEmpty);
        wrapper.update();
        expect(wrapper.state('defects')).toEqual(mockDataEmpty);
    });

    test("State with filled data correct", () => {
        const wrapper = shallow(<Visualizer />);
        wrapper.instance().markDefects(mockDataFull);
        wrapper.update();
        expect(wrapper.state('defects')).toEqual(mockDataFull);
    });
});


describe("Visualizer selectObject(oData)", () =>{
    const mockODataEmpty = null;
    const mockODataFull = {
        showWindow: true,
        objectData: {
            Category: 'IFCWall',
            ID: '12345',
            Name: 'Wand',
            Status: '1'
        }
    }

    // tests that state 'showWindow' is set to false when element does not have a defect note
    test("Element without oData handled correctly", () => {
        const wrapper = shallow(<Visualizer />);
        wrapper.instance().selectObject(mockODataEmpty);
        expect(wrapper.state('showWindow')).toBe(false);
    });

    // tests that state is set correctly when element has a defect note
   /* test("Element with oData handled correctly", () => {
        const wrapper = shallow(<Visualizer />);
        wrapper.instance().selectObject(mockODataFull);
        wrapper.update();
        expect(wrapper.state('showWindow')).toBe(true);
        expect(wrapper.state('objectData')).toEqual(mockODataFull);

    });*/
});


/*describe("Visualizer getAnnotatedObjects", () => {
    // Expects function to successfully fetch non-empty JSON objects
    test("Non-empty objects", () => {
        const wrapper = shallow(<Visualizer />);
        expect(wrapper.instance().getAnnotatedObjects()).toEqual(
            expect.not.objectContaining([])
        );
    });

    test("Correctly reads sample Firebase", () =>{
        const wrapper = shallow(<Visualizer />);
        expect(wrapper.instance().getAnnotatedObjects()).toEqual(
            expect.not.arrayContaining([])
        );
    });
});*/

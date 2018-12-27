import React from 'react';

const Shared = (props) => <p>This is the first shared component</p>;
const Something = ({something}) => <p>This is the second one. It says: { something }</p>;

export default {
    Shared, Something
};

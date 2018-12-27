import React from 'react';

const Shared1 = (props) => <p>This is the first shared component</p>;
const Shared2 = ({something}) => <p>This is the second one. It says: { something }</p>;

export default {
    Shared1, Shared2
};

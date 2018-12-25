import React from 'react';

const shared1 = (props) => <p> This is the first shared </p>;
const shared2 = ({something}) => <p> This is the second one. It says { something } </p>;

export default {
    shared1, shared2
};

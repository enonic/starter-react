import React from 'react';
import { connect } from 'react-redux';

import { actionCreators as testAC } from '../redux/reducers/greetingsRed';

const WorldGreeter = ({greetingsCount, greetee, moreGreetings, moreGreetees}) => {
    let greetings = "";
    for (let i = 0; i < greetingsCount; i++) {
        greetings += "hello ";
    }
    greetings = greetings.charAt(0).toUpperCase() + greetings.substr(1);

    return <div className="worldGreeter">
        <h1>
            <span onClick={moreGreetings} style={{cursor: "pointer"}} className="greetee">{greetings}</span>
            <span onClick={moreGreetees} style={{cursor: "pointer"}} className="greetee">{greetee}</span>
            !
        </h1>
    </div>;
};

const mapStateToProps = (state) => ({
    greetingsCount: state.greetings.greetingsCount,
    greetee: state.greetings.greetee,
});

const mapDispatchToProps = {
    moreGreetings: testAC.moreGreetings,
    moreGreetees: testAC.moreGreetees,
};



// ----------------------------------------------  Export

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorldGreeter);

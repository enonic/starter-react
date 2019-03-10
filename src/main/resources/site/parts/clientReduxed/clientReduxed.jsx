import React from 'react';
import { Provider } from 'react-redux';

import getStore from '../../../../react4xp/redux';
import { actionCreators as greetingsAC } from '../../../../react4xp/redux/reducers/greetingsRed'
import ReduxWorldGreeter from '../../../../react4xp/sharedComps/ReduxWorldGreeter';

export default (props) => {
    const store = getStore({});

    store.dispatch(greetingsAC.init(
        props.id,
        props.greetings
    ));

    return <Provider store={store}>
        <ReduxWorldGreeter {...props} />
    </Provider>;
};

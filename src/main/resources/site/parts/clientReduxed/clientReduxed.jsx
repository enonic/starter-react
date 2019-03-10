import React from 'react';
import { Provider } from 'react-redux';

import getStore from '../../../../react4xp/redux';
import ReduxWorldGreeter from '../../../../react4xp/sharedComps/WorldGreeter';

export default (props) => <Provider store={getStore(props.initialState)}>
    <ReduxWorldGreeter />
</Provider>;

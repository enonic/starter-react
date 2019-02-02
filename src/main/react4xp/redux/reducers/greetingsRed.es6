import DuckFactory from 'duckfactory';

const greetingsDuck = new DuckFactory("GREETINGS", {}, {
    moreGreetees: (state) => ({
        ...state,
        greeteeCount: state.greeteeCount * 2,
        greetee: state.greetee + " " + state.greetee,
    }),

    moreGreetings: (state) => ({
        ...state,
        greetingsCount: state.greetingsCount * 2,
    })

}, true, true);                         // eslint-disable-line no-undef
export default greetingsDuck.getReducer();
export const actionCreators = greetingsDuck.getActionCreators();

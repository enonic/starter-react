import ReactDOM from 'react-dom';

exports.render = (Component, targetId, props) => {
    let container = null;
    try {
        if (!targetId) {
            console.error("React4xp.Core.render can't mount component into target container: missing targetId");
        }
        container = document.getElementById(targetId);

    } catch (e) { console.error(e); }

    if (!container) {
        console.error("React4xp.Core.render can't mount component into target container: no DOM element with ID '" + targetId +"'");
    }

    const renderable = (typeof Component === 'function') ?
        Component(props) :
        Component;
    ReactDOM.render(renderable, container);
};

import ReactDOM from 'react-dom';

const getContainer = (targetId) => {
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

    return container;
};


const getRenderable = (Component, props) => {
    return (typeof Component === 'function') ? Component(props) : Component;
};


exports.render = (Component, targetId, props) => {
    const container = getContainer(targetId);
    const renderable = getRenderable(Component, props);
    ReactDOM.render(renderable, container);
};


exports.hydrate = (Component, targetId, props) => {
    const container = getContainer(targetId);
    const renderable = getRenderable(Component, props);
    ReactDOM.hydrate(renderable, container);
};

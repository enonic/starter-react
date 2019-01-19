import ReactDOM from 'react-dom';

exports.render = (Component) => {
    const currentScript = document.currentScript || (function() {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    let container = null;
    let targetId = null;
    try {
        targetId = currentScript.getAttribute("data-react4xp-targetId");
        if (!targetId) {
            console.error("React4xp can't mount into target container: 'data-react4xp-targetId' attribute is missing or empty in surrounding <script> tag.");
        }
        container = document.getElementById(targetId);

    } catch (e) { console.error(e); }

    if (!container) {
        console.error("React4xp can't mount into target container: no DOM element with ID '" + targetId +"'");
    }

    const props = JSON.parse(currentScript.getAttribute("data-react4xp-props") || "null") || {};

    const renderable = (typeof Component === 'function') ?
        Component(props) :
        Component;
    ReactDOM.render(renderable, container);
};

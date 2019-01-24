const portal = require('/lib/xp/portal');
const thymeleaf = require('/lib/xp/thymeleaf');
const React4xp = require('/lib/enonic/react4xp');

const view = resolve("counter.html");

exports.get = (req) => {
    const component = portal.getComponent();

    const model = {
        heading: component.config.heading,
        endquote: component.config.endquote,
    }
    const body = thymeleaf.render(view, model);

    const props = {
        startCount: parseInt(component.config.countdown)
    }

    const id = "the-countdown";

    const rendered = (component.config.rendering === "client") ?
        React4xp.renderClient({ component, props, body, id}) :
        React4xp.renderSSRStaticMarkup({ component, props, body, id });

    const then = new Date().getTime();



    const now = new Date().getTime();
    log.info("SSR rendered in: " + (now - then) + " ms");

    log.info("component: " + JSON.stringify(component, null, 2));

    return rendered;




    /**
     * PLAN:
     * Et lib rendrer body:
     *      Hvis innenfor content studio: Server-side-rendered HTML fra reactkomponenten.
     *      Hvis ikke: HTML å hekte react-entryen på:
     *          -Hvis et view er sendt inn (html-fil), forventes det at det er en XP thymeleaf som inneholder en plassholder-element å hekte react på,
     *              akkurat denne thymeleaf-ID'en et eller annet sted: <div id="${react4xpId}"></div>.
     *          -Hvis ikke noe view er sendt inn, rendres kun: <div id="${react4xpId}"></div>
     *
     *          -Hvis react4xpId er tom, genereres en unik id: react4xp_[hash/uid]
     *          -Hvis react4xpId ikke er tom, legges en unik hash/uid etter, som postfix.
     *              NB: Disse må være unike per komponent/path! Så, runtime.
     *          -Denne verdien settes inn i HTML'en enten via thymeleaf eller direkte-rendret.
     *
     *
     * Page contributions:
     *      Hvis ikke innenfor content studio:
     *          <script>-henvisning til transpilert react-komponent entry asset JS fil.
     */

};

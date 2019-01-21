const React4xp = require('/lib/enonic/react4xp');

exports.get = (req) => {
    const then = new Date().getTime();
    const app2 = new React4xp('level/app2')
            .setProps({ insertedMessage: "- easy peasy lemon squeezy!" });

    const rendered = app2.renderToStaticMarkup();
    const now = new Date().getTime();

    log.info("SSR rendered in: " + (now - then) + " ms");

    // TODO: Same as on client-side rendering: the rendered static markup needs to be inserted into the/a body!
    return {
        body: rendered
    };




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

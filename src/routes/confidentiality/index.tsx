import { component$, useStyles$ } from "@builder.io/qwik";
import style from "./confidentiality.css?inline";

export default component$(() => {
    useStyles$(style)
    return (
        <>
            <div class="wrapper">
                <h1>Confidentialité</h1>
                <h2>Informations personelles</h2>
                <p>+ Inclure.net ne collecte aucune donnée personelle.</p>
                <br />
                <h2>Publicités Google</h2>
                <p>+ Les fournisseurs tiers, y compris Google, utilisent des cookies pour diffuser des annonces en fonction des visites antérieures des internautes sur votre site Web ou sur d'autres pages.</p>
                <p>+ Grâce aux cookies publicitaires, Google et ses partenaires adaptent les annonces diffusées auprès de vos visiteurs en fonction de leur navigation sur vos sites et/ou d'autres sites Web.</p>
                <p>+ Les utilisateurs peuvent choisir de désactiver la publicité personnalisée dans les <a href="https://www.google.com/settings/ads">Paramètres des annonces</a>. Vous pouvez également suggérer à vos visiteurs de désactiver les cookies d'un fournisseur tiers relatifs à la publicité personnalisée en consultant le site <a href="http://www.aboutads.info/choices/">www.aboutads.info</a>.</p>
            </div>
        </>
    )
});
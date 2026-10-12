/* Componentes reutilizáveis do site: cabeçalho, navegação e rodapé. */

class SiteNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        const active = this.getAttribute("active") || "";
        const linkClass = (name) =>
            active === name ? 'class="active" aria-current="page"' : "";

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; min-width: 0; }
                nav { display: flex; align-items: center; flex-wrap: wrap; gap: .35rem; }
                a { color: #596579; text-decoration: none; font: 650 .9rem/1.2 system-ui, sans-serif; padding: .7rem .85rem; border-radius: 9px; white-space: nowrap; }
                a:hover, a:focus-visible { background: #f1f4ff; color: #2446c7; outline: 2px solid transparent; }
                a.active { background: #edf1ff; color: #2446c7; }
                @media (max-width: 760px) {
                    nav { width: 100%; flex-wrap: nowrap; overflow-x: auto; padding-bottom: .25rem; }
                }
            </style>
            <nav aria-label="Navegação principal">
                <a ${linkClass("home")} href="index.html">Apresentação</a>
                <a ${linkClass("editor")} href="editor.html">Trabalho 1</a>
                <a ${linkClass("quiz")} href="prova.html">Trabalho 2</a>
                <a ${linkClass("other")} href="trabalho3.html">Trabalho 3</a>
            </nav>`;
    }
}

class SiteHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        const active = this.getAttribute("active") || "home";
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                * { box-sizing: border-box; }
                header { background: #fff; border-bottom: 1px solid #e5eaf1; }
                .inner { width: min(1120px, calc(100% - 2rem)); min-height: 82px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
                .brand { display: flex; align-items: center; gap: .75rem; color: #172033; text-decoration: none; flex-shrink: 0; }
                .mark { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 12px; color: white; background: #3156d9; font-weight: 800; letter-spacing: -.04em; }
                .brand strong, .brand small { display: block; }
                .brand strong { font: 700 1rem/1.3 system-ui, sans-serif; }
                .brand small { margin-top: .15rem; color: #697386; font: 400 .75rem/1.4 system-ui, sans-serif; }
                @media (max-width: 760px) { .inner { align-items: flex-start; flex-direction: column; padding: 1rem 0; gap: .8rem; width: min(1120px, calc(100% - 2rem)); } }
            </style>
            <header>
                <div class="inner">
                    <a class="brand" href="index.html" aria-label="Página inicial">
                        <span class="mark" aria-hidden="true">IW</span>
                        <span><strong>Interação Web</strong><small><slot name="subtitle">Portfólio da disciplina</slot></small></span>
                    </a>
                    <site-nav active="${active}"></site-nav>
                </div>
            </header>`;
    }
}

class SiteFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; margin-top: auto; }
                * { box-sizing: border-box; }
                footer { border-top: 1px solid #e5eaf1; background: #fff; }
                .inner { width: min(1120px, calc(100% - 2rem)); min-height: 68px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 1rem; color: #697386; font: 400 .8rem/1.5 system-ui, sans-serif; }
                @media (max-width: 520px) { .inner { align-items: flex-start; flex-direction: column; justify-content: center; padding: 1rem 0; gap: .25rem; } }
            </style>
            <footer><div class="inner"><span>Interação Web · Portfólio acadêmico</span><span>2026</span></div></footer>`;
    }
}

customElements.define("site-nav", SiteNav);
customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);

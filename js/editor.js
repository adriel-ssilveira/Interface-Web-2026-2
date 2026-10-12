const DEFAULT_STATE = {

    items: [
        {
            text: "Início",
            url: "#"
        },
        {
            text: "Produtos",
            url: "#"
        },
        {
            text: "Projetos",
            url: "#"
        },
        {
            text: "Contato",
            url: "#"
        }
    ],

    menuBg: "#172033",

    menuText: "#ffffff",

    itemBg: "#172033",

    itemHover: "#2563eb",

    fontSize: 16,

    itemPadding: 12,

    itemGap: 4,

    borderRadius: 8,

    borderWidth: 0,

    borderColor: "#64748b",

    direction: "row",

    imageUrl: "",

    imagePosition: "top"
};


let state = structuredClone(DEFAULT_STATE);


/* ELEMENTOS PRINCIPAIS */

const itemList =
    document.querySelector("#item-list");

const generatedMenu =
    document.querySelector("#generated-menu");

const addItemButton =
    document.querySelector("#add-item");

const resetButton =
    document.querySelector("#reset-editor");

const imageWrap =
    document.querySelector("#preview-image-wrap");

const previewImage =
    document.querySelector("#preview-image");

const previewArea =
    document.querySelector("#preview-area");


/* =========================
   VALIDAR URL
   ========================= */

function safeUrl(value) {

    const trimmed =
        value.trim();

    if (!trimmed) {
        return "#";
    }

    try {

        const url =
            new URL(
                trimmed,
                window.location.href
            );

        const allowedProtocols = [
            "http:",
            "https:",
            "mailto:",
            "tel:",
            "file:"
        ];

        if (
            allowedProtocols.includes(
                url.protocol
            )
        ) {
            return url.href;
        }

    } catch (error) {

        return "#";
    }

    return "#";
}


/* =========================
   CRIAR EDITOR DE ITEM
   ========================= */

function createItemEditor(
    item,
    index
) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "item-editor";


    /* CABEÇALHO */

    const head =
        document.createElement("div");

    head.className =
        "item-editor-head";


    const title =
        document.createElement("strong");

    title.textContent =
        `Item ${index + 1}`;


    /* BOTÃO EXCLUIR */

    const remove =
        document.createElement("button");

    remove.type =
        "button";

    remove.className =
        "remove-item";

    remove.textContent =
        "Excluir";


    remove.disabled =
        state.items.length === 1;


    remove.addEventListener(
        "click",
        () => {

            if (
                state.items.length <= 1
            ) {
                return;
            }

            state.items.splice(
                index,
                1
            );

            renderItemEditors();

            renderMenu();
        }
    );


    head.append(
        title,
        remove
    );


    /* CAMPO TEXTO */

    const textField =
        document.createElement("div");

    textField.className =
        "field";


    const textLabel =
        document.createElement("label");

    textLabel.htmlFor =
        `item-text-${index}`;

    textLabel.textContent =
        "Texto";


    const textInput =
        document.createElement("input");

    textInput.type =
        "text";

    textInput.id =
        `item-text-${index}`;

    textInput.maxLength =
        30;

    textInput.value =
        item.text;

    textInput.required =
        true;


    textInput.addEventListener(
        "input",
        () => {

            item.text =
                textInput.value ||
                `Item ${index + 1}`;

            renderMenu();
        }
    );


    textField.append(
        textLabel,
        textInput
    );


    /* CAMPO LINK */

    const urlField =
        document.createElement("div");

    urlField.className =
        "field";


    const urlLabel =
        document.createElement("label");

    urlLabel.htmlFor =
        `item-url-${index}`;

    urlLabel.textContent =
        "Link";


    const urlInput =
        document.createElement("input");

    urlInput.type =
        "url";

    urlInput.id =
        `item-url-${index}`;

    urlInput.placeholder =
        "https://exemplo.com";

    urlInput.value =
        item.url === "#"
            ? ""
            : item.url;


    urlInput.addEventListener(
        "input",
        () => {

            item.url =
                urlInput.value;

            renderMenu();
        }
    );


    urlField.append(
        urlLabel,
        urlInput
    );


    wrapper.append(
        head,
        textField,
        urlField
    );


    return wrapper;
}


/* =========================
   RENDERIZAR EDITORES
   ========================= */

function renderItemEditors() {

    itemList.replaceChildren();


    state.items.forEach(
        (item, index) => {

            itemList.appendChild(
                createItemEditor(
                    item,
                    index
                )
            );
        }
    );


    addItemButton.disabled =
        state.items.length >= 10;
}


/* =========================
   RENDERIZAR MENU
   ========================= */

function renderMenu() {

    generatedMenu.replaceChildren();


    generatedMenu.classList.toggle(
        "menu-column",
        state.direction === "column"
    );


    generatedMenu.style.gap =
        `${state.itemGap}px`;


    generatedMenu.style.backgroundColor =
        state.menuBg;


    generatedMenu.style.color =
        state.menuText;


    generatedMenu.style.padding =
        `${Math.max(
            4,
            state.itemGap
        )}px`;


    generatedMenu.style.borderRadius =
        `${state.borderRadius}px`;


    generatedMenu.style.setProperty(
        "--menu-hover",
        state.itemHover
    );


    state.items.forEach(
        (item) => {

            const link =
                document.createElement("a");


            link.href =
                safeUrl(item.url);


            link.textContent =
                item.text.trim() ||
                "Item";


            link.style.backgroundColor =
                state.itemBg;


            link.style.color =
                state.menuText;


            link.style.fontSize =
                `${state.fontSize}px`;


            link.style.padding =
                `${state.itemPadding}px`;


            link.style.border =
                `${state.borderWidth}px solid ${state.borderColor}`;


            link.style.borderRadius =
                `${state.borderRadius}px`;


            generatedMenu.appendChild(
                link
            );
        }
    );


    updateImage();
}


/* =========================
   ATUALIZAR IMAGEM
   ========================= */

function updateImage() {

    const valid =
        /^https?:\/\//i.test(
            state.imageUrl.trim()
        );


    if (!valid) {

        imageWrap.classList.add(
            "hidden"
        );

        previewImage.removeAttribute(
            "src"
        );

        previewArea.style.flexDirection =
            "column";

        generatedMenu.style.width =
            "min(100%, 680px)";

        return;
    }


    previewImage.src =
        state.imageUrl.trim();


    imageWrap.classList.remove(
        "hidden"
    );


    if (
        state.imagePosition === "side"
    ) {

        imageWrap.style.maxWidth =
            "220px";

        imageWrap.style.order =
            "0";


        generatedMenu.style.order =
            "1";


        generatedMenu.style.width =
            "calc(100% - 240px)";


        previewArea.style.flexDirection =
            "row";

    } else {

        imageWrap.style.maxWidth =
            "680px";

        imageWrap.style.order =
            "0";


        generatedMenu.style.order =
            "1";


        generatedMenu.style.width =
            "min(100%, 680px)";


        previewArea.style.flexDirection =
            "column";
    }
}


/* =========================
   CONTROLES
   ========================= */

function bindControl(
    id,
    key,
    outputId
) {

    const element =
        document.querySelector(
            `#${id}`
        );


    const output =
        outputId
            ? document.querySelector(
                `#${outputId}`
            )
            : null;


    element.addEventListener(
        "input",
        () => {

            if (
                element.type === "range"
            ) {

                state[key] =
                    Number(
                        element.value
                    );

            } else {

                state[key] =
                    element.value;
            }


            if (output) {

                output.textContent =
                    `${element.value}${
                        element.type === "range"
                            ? "px"
                            : ""
                    }`;
            }


            if (
                element.type === "color"
            ) {

                const value =
                    document.querySelector(
                        `#${id}-value`
                    );


                if (value) {

                    value.textContent =
                        element.value;
                }
            }


            renderMenu();
        }
    );
}


/* =========================
   CORES
   ========================= */

bindControl(
    "menu-bg",
    "menuBg"
);

bindControl(
    "menu-text",
    "menuText"
);

bindControl(
    "item-bg",
    "itemBg"
);

bindControl(
    "item-hover",
    "itemHover"
);


/* =========================
   SLIDERS
   ========================= */

bindControl(
    "font-size",
    "fontSize",
    "font-size-output"
);

bindControl(
    "item-padding",
    "itemPadding",
    "item-padding-output"
);

bindControl(
    "item-gap",
    "itemGap",
    "item-gap-output"
);

bindControl(
    "border-radius",
    "borderRadius",
    "border-radius-output"
);

bindControl(
    "border-width",
    "borderWidth",
    "border-width-output"
);


bindControl(
    "border-color",
    "borderColor"
);


/* =========================
   DIREÇÃO
   ========================= */

document
    .querySelector("#direction")
    .addEventListener(
        "change",
        (event) => {

            state.direction =
                event.target.value;

            renderMenu();
        }
    );


/* =========================
   IMAGEM
   ========================= */

document
    .querySelector("#image-url")
    .addEventListener(
        "input",
        (event) => {

            state.imageUrl =
                event.target.value;

            updateImage();
        }
    );


document
    .querySelector("#image-position")
    .addEventListener(
        "change",
        (event) => {

            state.imagePosition =
                event.target.value;

            updateImage();
        }
    );


/* =========================
   ADICIONAR ITEM
   ========================= */

addItemButton.addEventListener(
    "click",
    () => {

        if (
            state.items.length >= 10
        ) {
            return;
        }


        state.items.push({

            text:
                `Novo item ${
                    state.items.length + 1
                }`,

            url: "#"

        });


        renderItemEditors();

        renderMenu();


        const inputs =
            itemList.querySelectorAll(
                "input[type='text']"
            );


        inputs[
            inputs.length - 1
        ]?.focus();
    }
);


/* =========================
   RESTAURAR PADRÃO
   ========================= */

resetButton.addEventListener(
    "click",
    () => {

        state =
            structuredClone(
                DEFAULT_STATE
            );


        document.querySelector(
            "#menu-bg"
        ).value =
            state.menuBg;


        document.querySelector(
            "#menu-text"
        ).value =
            state.menuText;


        document.querySelector(
            "#item-bg"
        ).value =
            state.itemBg;


        document.querySelector(
            "#item-hover"
        ).value =
            state.itemHover;


        document.querySelector(
            "#font-size"
        ).value =
            state.fontSize;


        document.querySelector(
            "#item-padding"
        ).value =
            state.itemPadding;


        document.querySelector(
            "#item-gap"
        ).value =
            state.itemGap;


        document.querySelector(
            "#border-radius"
        ).value =
            state.borderRadius;


        document.querySelector(
            "#border-width"
        ).value =
            state.borderWidth;


        document.querySelector(
            "#border-color"
        ).value =
            state.borderColor;


        document.querySelector(
            "#direction"
        ).value =
            state.direction;


        document.querySelector(
            "#image-url"
        ).value = "";


        document.querySelector(
            "#image-position"
        ).value =
            state.imagePosition;


        document.querySelector(
            "#font-size-output"
        ).textContent =
            "16px";


        document.querySelector(
            "#item-padding-output"
        ).textContent =
            "12px";


        document.querySelector(
            "#item-gap-output"
        ).textContent =
            "4px";


        document.querySelector(
            "#border-radius-output"
        ).textContent =
            "8px";


        document.querySelector(
            "#border-width-output"
        ).textContent =
            "0px";


        [
            "menu-bg",
            "menu-text",
            "item-bg",
            "item-hover",
            "border-color"
        ].forEach(
            (id) => {

                document.querySelector(
                    `#${id}-value`
                ).textContent =
                    document.querySelector(
                        `#${id}`
                    ).value;
            }
        );


        renderItemEditors();

        renderMenu();
    }
);


/* =========================
   INICIALIZAÇÃO
   ========================= */

renderItemEditors();

renderMenu();
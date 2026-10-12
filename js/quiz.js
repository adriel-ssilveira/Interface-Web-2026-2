/* Prova on-line: os dados ficam em um objeto literal e a interface é encapsulada no Shadow DOM. */
const TEST_DATA = {
    title: "Prova de JavaScript e Web Components",
    instructions: "Responda às cinco questões e clique em Corrigir prova para conferir sua nota.",
    questions: [
        {
            text: "O que é um objeto literal em JavaScript?",
            alternatives: [
                "Uma estrutura que organiza dados em pares de chave e valor.",
                "Um elemento HTML usado para criar formulários.",
                "Uma regra CSS que altera a aparência de um botão."
            ],
            correct: 0
        },
        {
            text: "Qual é a finalidade de um Custom Element?",
            alternatives: [
                "Substituir obrigatoriamente todos os elementos HTML nativos.",
                "Permitir a criação de elementos HTML personalizados e reutilizáveis.",
                "Armazenar dados permanentemente no servidor."
            ],
            correct: 1
        },
        {
            text: "Para que serve o Shadow DOM?",
            alternatives: [
                "Para tornar uma página automaticamente responsiva.",
                "Para enviar formulários sem conexão com a internet.",
                "Para encapsular a estrutura e os estilos de um componente."
            ],
            correct: 2
        },
        {
            text: "Qual é a função de um elemento slot em um Web Component?",
            alternatives: [
                "Definir um ponto de inserção para conteúdo fornecido pelo componente que o utiliza.",
                "Corrigir automaticamente os erros de sintaxe do JavaScript.",
                "Criar uma conexão com um banco de dados."
            ],
            correct: 0
        },
        {
            text: "Qual método registra uma classe como elemento personalizado no navegador?",
            alternatives: [
                "document.createElementClass()",
                "customElements.define()",
                "window.registerHTML()"
            ],
            correct: 1
        }
    ]
};

class MyTest extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.hasSubmitted = false;
    }

    connectedCallback() {
        if (this.shadowRoot.childElementCount > 0) return;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; color: #172033; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
                * { box-sizing: border-box; }
                .quiz { background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(23,32,51,.08); }
                .top { padding: clamp(1.25rem, 4vw, 2.25rem); color: #fff; background: linear-gradient(125deg, #172033, #3156d9); }
                .eyebrow { margin: 0 0 .55rem; color: #c9d5ff; font-size: .72rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
                h2 { margin: 0; font-size: clamp(1.45rem, 3vw, 2rem); line-height: 1.2; }
                .instructions { margin: .8rem 0 0; color: #e0e7ff; line-height: 1.6; }
                form { padding: clamp(1rem, 3vw, 2rem); }
                fieldset { min-width: 0; margin: 0 0 1rem; padding: 1.2rem; border: 1px solid #e2e8f0; border-radius: 14px; }
                legend { max-width: 100%; padding: 0 .35rem; font-weight: 750; line-height: 1.5; }
                .number { display: inline-grid; place-items: center; width: 1.8rem; height: 1.8rem; margin-right: .45rem; border-radius: 8px; color: #2446c7; background: #edf1ff; font-size: .82rem; vertical-align: middle; }
                .option { display: flex; align-items: flex-start; gap: .7rem; margin-top: .8rem; padding: .75rem .8rem; border: 1px solid #e7ebf2; border-radius: 10px; cursor: pointer; line-height: 1.5; }
                .option:hover { border-color: #9baefb; background: #f8f9ff; }
                .option:has(input:checked) { border-color: #3156d9; background: #f0f3ff; }
                input { flex: 0 0 auto; width: 1.05rem; height: 1.05rem; margin: .2rem 0 0; accent-color: #3156d9; }
                .actions { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.4rem; }
                button { min-height: 46px; padding: .75rem 1.15rem; border: 0; border-radius: 10px; font: inherit; font-weight: 750; cursor: pointer; }
                button:focus-visible { outline: 3px solid #9baefb; outline-offset: 3px; }
                .primary { color: #fff; background: #3156d9; }
                .primary:hover { background: #2446c7; }
                .secondary { color: #27334a; background: #edf0f5; }
                .secondary:hover { background: #e1e6ef; }
                .message { min-height: 1.5rem; margin: .9rem 0 0; color: #596579; line-height: 1.5; }
                .result { margin: 0 clamp(1rem, 3vw, 2rem) clamp(1rem, 3vw, 2rem); padding: 1.25rem; border-radius: 14px; background: #f5f7fb; }
                .result[hidden] { display: none; }
                .score { margin: 0 0 .35rem; font-size: 1.4rem; font-weight: 850; }
                .summary { margin: 0 0 1rem; color: #596579; line-height: 1.5; }
                .review { margin: .75rem 0 0; padding: .9rem; border-radius: 10px; background: #fff; border: 1px solid #e2e8f0; }
                .review p { margin: .3rem 0; line-height: 1.5; }
                .correct { color: #166534; }
                .incorrect { color: #b42318; }
                @media (max-width: 520px) { fieldset { padding: .9rem; } .actions button { width: 100%; } }
            </style>
            <section class="quiz" aria-labelledby="quiz-title">
                <div class="top">
                    <p class="eyebrow">Avaliação interativa</p>
                    <h2 id="quiz-title"></h2>
                    <p class="instructions" id="quiz-instructions"></p>
                </div>
                <form id="quiz-form">
                    <div id="questions"></div>
                    <div class="actions">
                        <button class="primary" type="submit">Corrigir prova</button>
                        <button class="secondary" id="retry" type="button" hidden>Responder novamente</button>
                    </div>
                    <p class="message" id="message" role="status" aria-live="polite"></p>
                </form>
                <section class="result" id="result" aria-labelledby="result-title" aria-live="polite" hidden>
                    <h3 id="result-title">Resultado da prova</h3>
                    <p class="score" id="score"></p>
                    <p class="summary" id="summary"></p>
                    <div id="review"></div>
                </section>
            </section>`;

        this.shadowRoot.querySelector("#quiz-title").textContent = TEST_DATA.title;
        this.shadowRoot.querySelector("#quiz-instructions").textContent = TEST_DATA.instructions;
        this.form = this.shadowRoot.querySelector("#quiz-form");
        this.questionsContainer = this.shadowRoot.querySelector("#questions");
        this.message = this.shadowRoot.querySelector("#message");
        this.result = this.shadowRoot.querySelector("#result");
        this.retryButton = this.shadowRoot.querySelector("#retry");
        this.renderQuestions();

        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.gradeTest();
        });
        this.retryButton.addEventListener("click", () => this.resetTest());
    }

    renderQuestions() {
        this.questionsContainer.replaceChildren();
        TEST_DATA.questions.forEach((question, questionIndex) => {
            const fieldset = document.createElement("fieldset");
            const legend = document.createElement("legend");
            const number = document.createElement("span");
            number.className = "number";
            number.textContent = String(questionIndex + 1).padStart(2, "0");
            legend.append(number, document.createTextNode(question.text));
            fieldset.append(legend);

            question.alternatives.forEach((alternative, alternativeIndex) => {
                const label = document.createElement("label");
                label.className = "option";
                const input = document.createElement("input");
                input.type = "radio";
                input.name = `question-${questionIndex}`;
                input.id = `question-${questionIndex}-option-${alternativeIndex}`;
                input.value = String(alternativeIndex);
                input.required = true;
                const text = document.createElement("span");
                text.textContent = alternative;
                label.htmlFor = input.id;
                label.append(input, text);
                fieldset.append(label);
            });
            this.questionsContainer.append(fieldset);
        });
    }

    gradeTest() {
        const answers = TEST_DATA.questions.map((question, index) => {
            const selected = this.shadowRoot.querySelector(`input[name="question-${index}"]:checked`);
            return selected ? Number(selected.value) : null;
        });
        const unansweredIndex = answers.findIndex((answer) => answer === null);
        if (unansweredIndex !== -1) {
            this.message.textContent = `Responda à questão ${unansweredIndex + 1} antes de corrigir a prova.`;
            const firstRadio = this.shadowRoot.querySelector(`input[name="question-${unansweredIndex}"]`);
            if (firstRadio) firstRadio.focus();
            return;
        }

        let correctCount = 0;
        TEST_DATA.questions.forEach((question, index) => {
            if (answers[index] === question.correct) correctCount += 1;
        });
        const grade = (correctCount / TEST_DATA.questions.length) * 10;
        this.shadowRoot.querySelector("#score").textContent = `Nota: ${grade.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}/10`;
        this.shadowRoot.querySelector("#summary").textContent = `Você acertou ${correctCount} de ${TEST_DATA.questions.length} questões.`;
        const review = this.shadowRoot.querySelector("#review");
        review.replaceChildren();

        TEST_DATA.questions.forEach((question, index) => {
            const item = document.createElement("article");
            item.className = "review";
            const title = document.createElement("strong");
            title.textContent = `Questão ${index + 1}: ${question.text}`;
            const userAnswer = document.createElement("p");
            const chosen = question.alternatives[answers[index]];
            userAnswer.className = answers[index] === question.correct ? "correct" : "incorrect";
            userAnswer.textContent = `Sua resposta: ${chosen}`;
            const correctAnswer = document.createElement("p");
            correctAnswer.className = "correct";
            correctAnswer.textContent = `Resposta correta: ${question.alternatives[question.correct]}`;
            item.append(title, userAnswer, correctAnswer);
            review.append(item);
        });

        this.result.hidden = false;
        this.retryButton.hidden = false;
        this.message.textContent = "Prova corrigida. Confira abaixo suas respostas e o gabarito.";
        this.hasSubmitted = true;
        this.shadowRoot.querySelectorAll("input").forEach((input) => { input.disabled = true; });
        this.form.querySelector('button[type="submit"]').disabled = true;
    }

    resetTest() {
        this.form.reset();
        this.shadowRoot.querySelectorAll("input").forEach((input) => { input.disabled = false; });
        this.form.querySelector('button[type="submit"]').disabled = false;
        this.result.hidden = true;
        this.retryButton.hidden = true;
        this.message.textContent = "Prova reiniciada. Você pode responder novamente.";
        this.hasSubmitted = false;
        const firstRadio = this.shadowRoot.querySelector("input[type=radio]");
        if (firstRadio) firstRadio.focus();
    }
}

customElements.define("my-test", MyTest);

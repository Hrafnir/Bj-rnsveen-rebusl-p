document.addEventListener('DOMContentLoaded', () => {
    // Hent referanser til HTML-elementer
    const startButton = document.getElementById('start-button');
    const pages = document.querySelectorAll('#rebus-content .page');
    const feedbackDivs = document.querySelectorAll('.feedback');
    const checkButtons = document.querySelectorAll('.check-answer-btn');
    const allInputs = document.querySelectorAll('input[type="text"]');

    // Tab-elementer
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const rebusContent = document.getElementById('rebus-content');
    const mapContent = document.getElementById('map-content');

    // ----- DEFINER KODEORDENE HER -----
    const correctCodes = {
        post1: '82',
        post2: 'BOOKKEEPER',
        post3: 'HEMMELIGHET',
        post4: 'U',
        post5: '194',
        post6: '5',
        post7: 'TEAPOT',
        post8: 'SEVEN',
        post9: 'FROSTBITE',
        post10: 'FOTSPOR'
    };
    // ------------------------------------

    // Funksjon for å vise en spesifikk REBUS-side og skjule resten
    function showRebusPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('visible');
        });
        const nextPage = document.getElementById(pageId);
        if (nextPage) {
            nextPage.classList.add('visible');
             const container = document.querySelector('.container');
             if (container) {
                 window.scrollTo({ top: container.offsetTop - 20, behavior: 'smooth' });
             }

        } else {
            console.error("Kunne ikke finne rebus-side med ID:", pageId);
        }
    }

     // Funksjon for å bytte mellom hoved-tabs (Rebus/Kart)
     function showTabContent(tabId) {
        tabContents.forEach(content => {
            content.classList.remove('visible');
        });
        const nextContent = document.getElementById(tabId + '-content');
        if (nextContent) {
            nextContent.classList.add('visible');
        } else {
            console.error("Kunne ikke finne tab-innhold med ID:", tabId + '-content');
        }

        // Oppdater aktiv knapp
        tabButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-tab') === tabId) {
                button.classList.add('active');
            }
        });
     }

    // Event listener for startknappen
    startButton.addEventListener('click', () => {
        showRebusPage('post-1-page');
    });

     // Event listeners for Tab-knapper
     tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            showTabContent(tabId);
        });
     });

    // Event listeners for alle "Sjekk svar"-knapper
    checkButtons.forEach(button => {
        button.addEventListener('click', () => {
            const postNumber = button.getAttribute('data-post');
            const inputElement = document.getElementById(`post-${postNumber}-input`);
            const feedbackElement = document.getElementById(`feedback-${postNumber}`);
            const userAnswer = inputElement.value.trim().toUpperCase();
            const correctCode = correctCodes[`post${postNumber}`];

            feedbackElement.className = 'feedback';
            feedbackElement.textContent = '';

            if (!userAnswer) {
                feedbackElement.textContent = 'Du må skrive inn et svar!';
                feedbackElement.classList.add('error', 'shake');
                setTimeout(() => feedbackElement.classList.remove('shake'), 400);
                inputElement.classList.add('shake');
                setTimeout(() => inputElement.classList.remove('shake'), 400);
                return;
            }

            // ----- ENDRING HER: Lagt til || userAnswer === 'FASIT' -----
            if (userAnswer === correctCode || userAnswer === 'FASIT') {
                // Velg feedback basert på om det var FASIT eller riktig svar
                if (userAnswer === 'FASIT') {
                     feedbackElement.textContent = 'FASIT godkjent! Hopper videre...';
                } else {
                     feedbackElement.textContent = 'Helt riktig! 👍 Bra jobba!';
                }
                feedbackElement.classList.add('success');

                inputElement.disabled = true;
                button.disabled = true;

                setTimeout(() => {
                    const nextPostNumber = parseInt(postNumber) + 1;
                    if (nextPostNumber <= 10) {
                        showRebusPage(`post-${nextPostNumber}-page`);
                    } else {
                        showRebusPage('finale-page');
                    }
                }, 1000); // Litt kortere ventetid når man bruker FASIT

            } else {
                feedbackElement.textContent = 'Hmm, det stemmer ikke helt. Prøv igjen!';
                 feedbackElement.classList.add('error', 'shake');
                setTimeout(() => feedbackElement.classList.remove('shake'), 400);
                inputElement.classList.add('shake');
                setTimeout(() => inputElement.classList.remove('shake'), 400);
                inputElement.focus();
                inputElement.select();
            }
        });
    });

     // Event listeners for Enter-tast i input-felt
     allInputs.forEach(input => {
        input.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const postNumber = this.id.split('-')[1];
                const correspondingButton = document.querySelector(`.check-answer-btn[data-post="${postNumber}"]`);
                if (correspondingButton && !correspondingButton.disabled) {
                    correspondingButton.click();
                }
            }
        });
     });


    // Sørg for at riktig tab og side vises ved start
    showTabContent('rebus');
    showRebusPage('intro-page');

}); // Slutt på DOMContentLoaded

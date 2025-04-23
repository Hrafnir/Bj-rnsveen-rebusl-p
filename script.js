document.addEventListener('DOMContentLoaded', () => {
    // Hent referanser til HTML-elementer
    const startButton = document.getElementById('start-button');
    const pages = document.querySelectorAll('#rebus-content .page');
    const feedbackDivs = document.querySelectorAll('.feedback');
    const checkButtons = document.querySelectorAll('.check-answer-btn'); // Kun knapper med denne klassen
    const allInputs = document.querySelectorAll('input[type="text"]');

    // Tab-elementer
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const rebusContent = document.getElementById('rebus-content');
    const mapContent = document.getElementById('map-content');

    // Den nye knappen på post 3
    const nextPost3Button = document.getElementById('next-post-3-btn');

    // ----- DEFINER KODEORDENE HER (Post 3 fjernet) -----
    const correctCodes = {
        post1: 'UNDERSKRIFT',
        post2: 'MJØSA',
        // post3: 'HEMMELIGHET', // Fjernet, ingen sjekk på post 3
        post4: 'U', // Svaret fra lydfilen på post 3 sjekkes her
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

     // *** NY Event listener for "Gå Videre"-knappen på Post 3 ***
     if (nextPost3Button) { // Sjekk om knappen finnes
         nextPost3Button.addEventListener('click', () => {
            showRebusPage('post-4-page'); // Gå direkte til neste side
         });
     } else {
        console.warn("Knappen 'next-post-3-btn' ble ikke funnet.");
     }

    // Event listeners for alle "Sjekk svar"-knapper (vil nå ignorere post 3)
    checkButtons.forEach(button => {
        button.addEventListener('click', () => {
            const postNumber = button.getAttribute('data-post'); // Får 1, 2, 4, 5, ...
            const inputElement = document.getElementById(`post-${postNumber}-input`);
            const feedbackElement = document.getElementById(`feedback-${postNumber}`);

            // Sjekk om elementene finnes (spesielt relevant hvis HTML endres uten at JS oppdateres)
            if (!inputElement || !feedbackElement) {
                console.error(`Input eller feedback element mangler for post ${postNumber}`);
                return;
            }

            const userAnswer = inputElement.value.trim().toUpperCase();
            const correctCode = correctCodes[`post${postNumber}`];

            // Sjekk om kodeordet finnes for denne posten (post 3 har ikke kodeord)
            if (correctCode === undefined) {
                 console.warn(`Ingen korrekt kode definert for post ${postNumber}`);
                 return; // Ikke gjør noe hvis det ikke er et kodeord å sjekke mot
            }


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

            if (userAnswer === correctCode || userAnswer === 'FASIT') {
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
                    // Spesiell logikk for å hoppe fra post 2 til post 3 (som ikke har sjekk),
                    // og fra post 3 (via egen knapp) til post 4.
                    // Denne logikken håndterer nå vanlig progresjon etter en sjekk.
                    if (nextPostNumber <= 10) {
                         // Finn neste *gyldige* post-side ID.
                         // Dette eksempelet antar enkel +1 progresjon, men post 3 håndteres separat.
                         // Hvis du fjerner flere poster, må logikken bli mer kompleks.
                         showRebusPage(`post-${nextPostNumber}-page`);
                    } else {
                        showRebusPage('finale-page');
                    }
                }, 1000);

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
                // Finn knappen som har klassen 'check-answer-btn' OG riktig data-post
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

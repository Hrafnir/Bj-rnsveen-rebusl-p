document.addEventListener('DOMContentLoaded', () => {
    // Hent referanser til HTML-elementer
    const startButton = document.getElementById('start-button');
    const backgroundMusic = document.getElementById('background-music');
    const pages = document.querySelectorAll('#rebus-content .page'); // Sider INNE i rebus-content
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
        post1: 'NORSK',      // Eller Engelsk/Tysk/Spansk avhengig av skolen
        post2: 'FIRE',       // Antall vinduer (juster ved behov)
        post3: 'LØVE',       // Ofte på Select-baller, kan endres
        post4: 'HØST',
        post5: 'GRØNN',
        post6: 'MARKØR',     // Eller 'CURSOR'
        post7: 'PIANO',      // Eller 'KEYBOARD'
        post8: 'MEL',
        post9: 'BLYANT',     // Eller 'PENN', 'BOK'
        post10: 'LÆRER'
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

    // --- Musikk Håndtering ---
    console.log("Forsøker å spille av muted musikk via HTML attributter...");
    backgroundMusic.play().catch(e => console.log("Muted autoplay feilet initielt:", e));

    // Event listener for startknappen
    startButton.addEventListener('click', () => {
        backgroundMusic.muted = false;
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(error => {
                console.log("Musikkavspilling ved klikk feilet:", error);
            });
        }
        showRebusPage('post-1-page'); // Vis første post i rebusen
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
            const userAnswer = inputElement.value.trim().toUpperCase(); // Bruker fortsatt toUpperCase
            const correctCode = correctCodes[`post${postNumber}`];

            if (!userAnswer) {
                feedbackElement.textContent = 'Du må skrive inn et svar!';
                feedbackElement.className = 'feedback error shake';
                setTimeout(() => feedbackElement.classList.remove('shake'), 500);
                inputElement.classList.add('shake');
                setTimeout(() => inputElement.classList.remove('shake'), 500);
                return;
            }

            if (userAnswer === correctCode) {
                feedbackElement.textContent = 'Helt riktig! 👍 Bra jobba!';
                feedbackElement.className = 'feedback success';

                // Deaktiver input og knapp etter korrekt svar
                inputElement.disabled = true;
                button.disabled = true;
                button.style.backgroundColor = '#aaa'; // Grå ut knappen

                setTimeout(() => {
                    const nextPostNumber = parseInt(postNumber) + 1;
                    // Gå til neste post ELLER finale
                    if (nextPostNumber <= 10) { // ENDRET HER TIL 10
                        showRebusPage(`post-${nextPostNumber}-page`);
                    } else {
                        showRebusPage('finale-page');
                        // Stopp musikken på finale-siden
                        if (!backgroundMusic.paused) {
                           backgroundMusic.pause();
                           backgroundMusic.currentTime = 0; // Reset musikken
                        }
                    }
                    // Ikke tøm input eller feedback, siden de er deaktivert
                }, 1500); // Vent litt før siden byttes

            } else {
                feedbackElement.textContent = 'Hmm, det stemmer ikke helt. Prøv igjen!';
                feedbackElement.className = 'feedback error shake';
                setTimeout(() => feedbackElement.classList.remove('shake'), 500);
                inputElement.classList.add('shake');
                setTimeout(() => inputElement.classList.remove('shake'), 500);
                inputElement.focus(); // Sett fokus tilbake til inputfeltet
                inputElement.select(); // Marker teksten for enkel overskriving
            }
        });
    });

     // Event listeners for Enter-tast i input-felt
     allInputs.forEach(input => {
        input.addEventListener('keypress', function (event) {
            // Sjekk om tasten som ble trykket er Enter
            if (event.key === 'Enter') {
                // Forhindre standard handling (som kan være form submit hvis det var en form)
                event.preventDefault();
                // Finn den tilhørende knappen og trigg et klikk
                const postNumber = this.id.split('-')[1]; // Henter tallet fra id="post-X-input"
                const correspondingButton = document.querySelector(`.check-answer-btn[data-post="${postNumber}"]`);
                if (correspondingButton && !correspondingButton.disabled) { // Sjekk at knappen finnes og ikke er deaktivert
                    correspondingButton.click();
                }
            }
        });
     });


    // Sørg for at riktig tab og side vises ved start
    showTabContent('rebus'); // Vis rebus-taben
    showRebusPage('intro-page'); // Vis intro-siden i rebusen

}); // Slutt på DOMContentLoaded

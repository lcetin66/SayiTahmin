document.addEventListener('DOMContentLoaded', () => {
    // --- HTML Elements ---
    const gameSetupDiv = document.getElementById('gameSetup');
    const rangeInput = document.getElementById('rangeInput');
    const setRangeButton = document.getElementById('setRangeButton');
    const rangeMessage = document.getElementById('rangeMessage');

    const userNumberSetupDiv = document.getElementById('userNumberSetup');
    const displayRangeSpan = document.getElementById('displayRange');
    const userNumberInput = document.getElementById('userNumberInput');
    const setUserNumberButton = document.getElementById('setUserNumberButton');
    const userNumberMessage = document.getElementById('userNumberMessage');

    const gameAreaDiv = document.getElementById('gameArea');
    const pcGuessDisplay = document.getElementById('pcGuessDisplay');
    const pcGuessesListSpan = document.getElementById('pcGuessesList');
    const pcGuessCountSpan = document.getElementById('pcGuessCount');
    const pcScoreSpan = document.getElementById('pcScore');

    const playerGuessInput = document.getElementById('playerGuessInput');
    const playerGuessButton = document.getElementById('playerGuessButton');
    const playerMessage = document.getElementById('playerMessage');
    const playerGuessesListSpan = document.getElementById('playerGuessesList');
    const playerGuessCountSpan = document.getElementById('playerGuessCount');
    const playerScoreSpan = document.getElementById('playerScore');

    const resetGameButton = document.getElementById('resetGameButton');

    // --- Game State Variables (Mirroring Python) ---
    let tahmin_araligi = 0;
    let pc_sayi = 0; // The number the computer chose for the player to guess
    let oyuncunun_sayisi = 0; // The number the player chose for the computer to guess

    let pc_sececegi_sayilar = []; // Computer's pool of numbers to guess from
    let pc_tahmin_liste = []; // List of numbers computer has guessed
    let tahmin_liste = []; // List of numbers player has guessed

    let pc_tahmin_sayisi = 0;
    let tahmin_sayisi = 0;

    let pc_puan = 100;
    let puan = 100;

    let gameEnded = false;

    // --- Helper Functions ---
    function updateUI() {
        pcGuessesListSpan.textContent = pc_tahmin_liste.join(', ');
        pcGuessCountSpan.textContent = pc_tahmin_sayisi;
        pcScoreSpan.textContent = pc_puan;

        playerGuessesListSpan.textContent = tahmin_liste.join(', ');
        playerGuessCountSpan.textContent = tahmin_sayisi;
        playerScoreSpan.textContent = puan;
    }

    function endGame(messageText) {
        console.log("Game Ended: ", messageText);
        gameEnded = true;
        playerGuessInput.disabled = true;
        playerGuessButton.disabled = true;
        setRangeButton.disabled = true;
        setUserNumberButton.disabled = true;
        playerMessage.textContent = messageText;
        resetGameButton.style.display = 'block';
    }

    function resetGame() {
        console.log("Resetting game...");
        tahmin_araligi = 0;
        pc_sayi = 0;
        oyuncunun_sayisi = 0;

        pc_sececegi_sayilar = []; // Clear the array
        pc_tahmin_liste = [];
        tahmin_liste = [];

        pc_tahmin_sayisi = 0;
        tahmin_sayisi = 0;

        pc_puan = 100;
        puan = 100;

        gameEnded = false;

        // Reset UI elements
        rangeInput.value = 100;
        rangeMessage.textContent = '';
        userNumberInput.value = '';
        userNumberMessage.textContent = '';
        pcGuessDisplay.textContent = '';
        playerMessage.textContent = '';

        gameSetupDiv.style.display = 'block';
        userNumberSetupDiv.style.display = 'none';
        gameAreaDiv.style.display = 'none';
        resetGameButton.style.display = 'none';

        playerGuessInput.disabled = false;
        playerGuessButton.disabled = false;
        setRangeButton.disabled = false;
        setUserNumberButton.disabled = false;

        updateUI();
        console.log("Game reset complete.");
    }

    // --- Game Logic Functions ---
    function computerTurn() {
        console.log("Computer's turn. Game Ended: ", gameEnded);
        if (gameEnded) return;

        if (pc_sececegi_sayilar.length === 0) {
            endGame("Bilgisayarın tahmin edecek sayısı kalmadı. Oyun bitti.");
            return;
        }

        const randomIndex = Math.floor(Math.random() * pc_sececegi_sayilar.length);
        const pc_secilen_sayi = pc_sececegi_sayilar[randomIndex];
        pc_tahmin_liste.push(pc_secilen_sayi);
        pc_sececegi_sayilar.splice(randomIndex, 1); // Remove guessed number

        pcGuessDisplay.textContent = `- Benim tahminim ${pc_secilen_sayi} oldu`;
        pc_tahmin_sayisi++;
        pc_puan -= 5;

        console.log("Computer guessed: ", pc_secilen_sayi, "User's number: ", oyuncunun_sayisi);
        if (pc_secilen_sayi === oyuncunun_sayisi) {
            pcGuessDisplay.textContent += ", ve Kazandım!";
            puan = 0; // Player's score becomes 0
            endGame("Bilgisayar kazandı! Sizin tuttuğunuz sayı: " + oyuncunun_sayisi);
        } else {
            pcGuessDisplay.textContent += ", sıra sizde.\n";
        }
        updateUI();
    }

    function playerTurn() {
        console.log("Player's turn. Game Ended: ", gameEnded);
        if (gameEnded) return;

        const oyuncu_tahmin = parseInt(playerGuessInput.value);
        playerGuessInput.value = ''; // Clear input after guess

        console.log("Player guessed: ", oyuncu_tahmin);

        if (isNaN(oyuncu_tahmin)) {
            playerMessage.textContent = "Lütfen bir tam sayı girin!";
            return;
        }

        if (oyuncu_tahmin === 0) {
            endGame("Oyundan çıkıldı.");
            return;
        }

        if (oyuncu_tahmin < 1 || oyuncu_tahmin > tahmin_araligi) {
            playerMessage.textContent = `Lütfen 1 - ${tahmin_araligi} arasında bir sayı girin`;
            return;
        }

        tahmin_sayisi++;

        console.log("Player's guess: ", oyuncu_tahmin, "Computer's number: ", pc_sayi);
        if (oyuncu_tahmin === pc_sayi) {
            playerMessage.textContent = `Kazandınız! Tebrikler! Doğru tahmin: ${pc_sayi}.`;
            playerMessage.style.color = 'green';
            tahmin_liste.push(oyuncu_tahmin);
            pc_puan = 0; // Computer's score becomes 0
            endGame("Siz kazandınız! Bilgisayarın tuttuğu sayı: " + pc_sayi);
        } else {
            if (tahmin_liste.includes(oyuncu_tahmin)) {
                playerMessage.textContent = "Bu sayıyı zaten girdiniz.";
            } else {
                tahmin_liste.push(oyuncu_tahmin);
                puan -= 5;
                if (oyuncu_tahmin > pc_sayi) {
                    playerMessage.textContent = `Bir dahaki sefer ${oyuncu_tahmin}'den daha küçük bir sayı tahmin edin.`;
                } else {
                    playerMessage.textContent = `Bir dahaki sefer ${oyuncu_tahmin}'den daha büyük bir sayı tahmin edin.`;
                }
            }
        }
        updateUI();

        // After player's turn, it's computer's turn if game hasn't ended
        if (!gameEnded) {
            computerTurn();
        }
    }

    // --- Event Listeners ---
    setRangeButton.addEventListener('click', () => {
        console.log("Set Range Button Clicked.");
        const range = parseInt(rangeInput.value);
        if (isNaN(range) || range < 1) {
            rangeMessage.textContent = "Lütfen sadece tam sayı girin";
            return;
        }
        tahmin_araligi = range;
        rangeMessage.textContent = '';
        displayRangeSpan.textContent = tahmin_araligi;
        gameSetupDiv.style.display = 'none';
        if (userNumberSetupDiv) {
            userNumberSetupDiv.style.display = 'block';
            console.log("userNumberSetupDiv display set to block. Current display style: " + userNumberSetupDiv.style.display);
        } else {
            console.error("userNumberSetupDiv not found!");
        }

        // Initialize pc_sececegi_sayilar for computer's guesses
        pc_sececegi_sayilar = []; // Clear previous list
        for (let i = 1; i <= tahmin_araligi; i++) {
            pc_sececegi_sayilar.push(i);
        }
        pc_sayi = Math.floor(Math.random() * tahmin_araligi) + 1; // Computer picks its number
        console.log("Bilgisayarın tuttuğu sayı (sizin tahmin etmeniz için):", pc_sayi); // For debugging
    });

    setUserNumberButton.addEventListener('click', () => {
        console.log("Set User Number Button Clicked.");
        const num = parseInt(userNumberInput.value);
        if (isNaN(num) || num < 1 || num > tahmin_araligi) {
            userNumberMessage.textContent = `Tuttuğunuz sayı 1-${tahmin_araligi} arasında olmalı`;
            return;
        }
        oyuncunun_sayisi = num;
        userNumberMessage.textContent = '';
        userNumberSetupDiv.style.display = 'none';
        if (gameAreaDiv) {
            gameAreaDiv.style.display = 'block';
            console.log("gameAreaDiv display set to block.");
        } else {
            console.error("gameAreaDiv not found!");
        }
        updateUI();
        computerTurn(); // Start the game with computer's first turn
    });

    playerGuessButton.addEventListener('click', playerTurn);
    playerGuessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            playerTurn();
        }
    });

    resetGameButton.addEventListener('click', resetGame);

    // Initial UI setup
    resetGame();
});
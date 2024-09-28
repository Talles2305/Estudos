document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const restartBtn = document.getElementById('restart');
    const difficultySelect = document.getElementById('difficulty');
    const scoreDisplay = document.getElementById('score');
    let cards = [];
    let flippedCards = [];
    let score = 0;
    let playerName = prompt('Digite seu nome:') || 'Jogador';

    document.getElementById('player-name').textContent = playerName;

    // Configuração do jogo
    function setupGame(difficulty) {
        cards = generateCards(difficulty);
        board.innerHTML = '';
        score = 0;
        scoreDisplay.textContent = score;

        // Definindo o layout do grid baseado na dificuldade
        const gridSize = difficulty === 'easy' ? 4 : 6; // 4x4 fácil, 6x6 difícil
        board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.value = card.value;
            cardElement.addEventListener('click', flipCard);
            board.appendChild(cardElement);
        });
    }

    // Geração de cartas com embaralhamento
    function generateCards(difficulty) {
        const cardValues = difficulty === 'easy' ? ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] : 
                                                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        const doubleValues = [...cardValues, ...cardValues];
        return doubleValues.sort(() => Math.random() - 0.5).map(value => ({ value, matched: false }));
    }

    // Virar carta
    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
            this.textContent = this.dataset.value;
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                checkForMatch();
            }
        }
    }

    // Verificar se as cartas viradas são iguais
    function checkForMatch() {
        const [first, second] = flippedCards;

        if (first.dataset.value === second.dataset.value) {
            flippedCards = [];
            score += 10;
            scoreDisplay.textContent = score;
            checkWin();
        } else {
            setTimeout(() => {
                first.classList.remove('flipped');
                second.classList.remove('flipped');
                first.textContent = '';
                second.textContent = '';
                flippedCards = [];
            }, 1000);
        }
    }

    // Verificar vitória
    function checkWin() {
        if (document.querySelectorAll('.card.flipped').length === cards.length) {
            alert(`Parabéns, ${playerName}! Você ganhou com ${score} pontos.`);
            saveScore(playerName, score);
        }
    }

    // Salvar pontuação no LocalStorage
    function saveScore(player, score) {
        const scores = JSON.parse(localStorage.getItem('ranking')) || [];
        scores.push({ player, score });
        localStorage.setItem('ranking', JSON.stringify(scores));
    }

    // Iniciar o jogo com a dificuldade selecionada
    difficultySelect.addEventListener('change', () => {
        setupGame(difficultySelect.value);
    });

    // Reiniciar o jogo
    restartBtn.addEventListener('click', () => {
        setupGame(difficultySelect.value);
    });

    // Iniciar o jogo inicialmente
    setupGame(difficultySelect.value);
});

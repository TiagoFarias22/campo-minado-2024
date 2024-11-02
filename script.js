// Define o tamanho do tabuleiro e a quantidade de bombas
const boardSize = 10;  // O tabuleiro terá 10x10 células
const bombCount = 15;  // Serão colocadas 15 bombas aleatórias no tabuleiro

// Inicializa variáveis principais
let board = [];  // Esse array vai armazenar o estado do jogo (cada célula terá informações sobre bomba e revelação)
let gameBoardElement = document.getElementById('game-board');  // Captura o elemento HTML onde o tabuleiro será renderizado
let resetGameButton = document.getElementById('reset-game');  // Captura o botão de reset para reiniciar o jogo

// Função para gerar o tabuleiro do jogo e colocar as bombas
function generateBoard() {
  board = [];  // Inicializa o array que vai representar o tabuleiro

  // Loop para criar as células do tabuleiro (linhas e colunas)
  for (let x = 0; x < boardSize; x++) {
    board[x] = [];  // Cria uma linha no tabuleiro
    for (let y = 0; y < boardSize; y++) {
      // Cada célula é um objeto que tem informações sobre se tem bomba, se está revelada e o número de bombas adjacentes
      board[x][y] = {
        bomb: false,  // Inicialmente, nenhuma célula tem bomba
        revealed: false,  // As células começam como não reveladas
        count: 0  // Inicialmente, o número de bombas ao redor é 0
      };
    }
  }

  // Coloca as bombas aleatoriamente no tabuleiro
  let bombsPlaced = 0;  // Contador de bombas colocadas
  while (bombsPlaced < bombCount) {  // Repete até que todas as bombas sejam colocadas
    const x = Math.floor(Math.random() * boardSize);  // Gera uma posição X aleatória
    const y = Math.floor(Math.random() * boardSize);  // Gera uma posição Y aleatória
    if (!board[x][y].bomb) {  // Verifica se a célula já tem bomba
      board[x][y].bomb = true;  // Coloca uma bomba nessa célula
      bombsPlaced++;  // Incrementa o contador de bombas
    }
  }

  // Calcula o número de bombas ao redor de cada célula que não tem bomba
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      if (!board[x][y].bomb) {  // Se a célula não tem bomba
        let count = 0;  // Conta quantas bombas estão ao redor
        // Verifica todas as 8 células adjacentes (incluindo diagonais)
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newX = x + i;  // Calcula a nova posição X
            const newY = y + j;  // Calcula a nova posição Y
            // Verifica se a célula adjacente está dentro dos limites e se tem bomba
            if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize && board[newX][newY].bomb) {
              count++;  // Incrementa o contador de bombas adjacentes
            }
          }
        }
        board[x][y].count = count;  // Armazena o número de bombas ao redor na célula
      }
    }
  }

  renderBoard();  // Renderiza o tabuleiro visualmente
}

// Função para renderizar o tabuleiro no HTML
function renderBoard() {
  gameBoardElement.innerHTML = '';  // Limpa o conteúdo do tabuleiro antes de renderizar
  for (let x = 0; x < boardSize; x++) {  // Itera sobre as linhas
    for (let y = 0; y < boardSize; y++) {  // Itera sobre as colunas
      const cell = document.createElement('div');  // Cria um elemento <div> para representar a célula
      cell.classList.add('cell');  // Adiciona a classe 'cell' ao elemento
      cell.dataset.x = x;  // Armazena a posição X da célula (usado para referência ao clicar)
      cell.dataset.y = y;  // Armazena a posição Y da célula

      // Se a célula foi revelada, mostra seu conteúdo
      if (board[x][y].revealed) {
        cell.classList.add('revealed');  // Adiciona a classe 'revealed' para estilizar a célula revelada
        if (board[x][y].bomb) {
          cell.classList.add('bomb');  // Adiciona a classe 'bomb' para estilizar as bombas
          cell.innerHTML = '💣';  // Insere um ícone de bomba na célula
        } else if (board[x][y].count > 0) {
          cell.innerHTML = board[x][y].count;  // Mostra o número de bombas ao redor, se houver
        }
      }

      // Adiciona um evento de clique para a célula
      cell.addEventListener('click', onCellClick);
      gameBoardElement.appendChild(cell);  // Adiciona a célula ao tabuleiro no HTML
    }
  }
}

// Função que lida com o clique em uma célula
function onCellClick(e) {
  const x = parseInt(e.target.dataset.x);  // Pega a posição X da célula clicada
  const y = parseInt(e.target.dataset.y);  // Pega a posição Y da célula clicada

  if (board[x][y].revealed) return;  // Se a célula já foi revelada, não faz nada

  if (board[x][y].bomb) {  // Se a célula clicada tem bomba
    revealAllBombs();  // Revela todas as bombas no tabuleiro
    alert('Game Over! Vc clicou numa mina!');  // Exibe um alerta de fim de jogo
  } else {
    revealCell(x, y);  // Revela a célula clicada e suas adjacências, se aplicável
    renderBoard();  // Atualiza o tabuleiro visualmente
    if (checkWin()) {  // Verifica se o jogador ganhou
      alert('Parabéns, vc ganhou!');  // Exibe uma mensagem de vitória
    }
  }
}

// Função que revela uma célula e suas adjacências se não houver bombas por perto
function revealCell(x, y) {
  // Verifica se a célula está dentro dos limites do tabuleiro e se já foi revelada
  if (x < 0 || x >= boardSize || y < 0 || y >= boardSize || board[x][y].revealed) return;

  board[x][y].revealed = true;  // Marca a célula como revelada

  // Se não houver bombas ao redor, revela também as células adjacentes
  if (board[x][y].count === 0) {
    for (let i = -1; i <= 1; i++) {  // Itera pelas células vizinhas
      for (let j = -1; j <= 1; j++) {
        revealCell(x + i, y + j);  // Chama recursivamente a função para revelar as células vizinhas
      }
    }
  }
}

// Função que revela todas as bombas no tabuleiro (quando o jogo termina)
function revealAllBombs() {
  for (let x = 0; x < boardSize; x++) {  // Itera sobre o tabuleiro
    for (let y = 0; y < boardSize; y++) {
      if (board[x][y].bomb) {  // Se a célula tem bomba
        board[x][y].revealed = true;  // Revela a bomba
      }
    }
  }
  renderBoard();  // Atualiza a visualização do tabuleiro
}

// Função que verifica se o jogador ganhou o jogo
function checkWin() {
  let revealedCells = 0;  // Contador de células reveladas
  for (let x = 0; x < boardSize; x++) {  // Itera sobre o tabuleiro
    for (let y = 0; y < boardSize; y++) {
      // Conta todas as células que foram reveladas e que não têm bombas
      if (board[x][y].revealed && !board[x][y].bomb) {
        revealedCells++;
      }
    }
  }
  // Verifica se todas as células não-bombas foram reveladas
  return revealedCells === (boardSize * boardSize - bombCount);
}

// Função para reiniciar o jogo
function resetGame() {
  generateBoard();  // Gera um novo tabuleiro
}

// Adiciona um evento de clique ao botão de reset para reiniciar o jogo
resetGameButton.addEventListener('click', resetGame);

// Inicializa o jogo quando a página é carregada
generateBoard();

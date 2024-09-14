// memuat DOM sebelum execute kode
document.addEventListener("DOMContentLoaded", () => {
  let board = null; //chess board
  const game = new Chess(); // instan relog game chess.js
  const moveHistory = document.getElementById("move-history"); // history move game
  let moveCount = 1; // inisialisai perpindahan gerakan
  let userColor = "w"; // inisialisasi warna pemain sebagai putih

  // fitur random move utk AI
  const makeRandomMove = () => {
    const possibleMoves = game.moves();

    if (game.game_over()) {
      alert("Skak njeng :v");
    } else {
      const RandomIdx = math.floor(Math.random() * possibleMoves.length);
      const move = possibleMoves[RandomIdx];
      game.move(move);
      board.position(game.fen());
      recordMove(move, moveCount); // simpan gerakan dengan perpindahan gerakan
      moveCount++;
    }
  };

  // fitur menampilkan history gerakan pada histroy move
  const recordMove = (move, count) => {
    const formattedMove =
      count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
    moveHistory.textContent += formattedMove + "";
    moveHistory.scrollTop = moveHistory.scrollHeight; // auto scroll perpindahan traher
  };

  // fitur handle start ke posisi pindah
  const onDragStart = (source, piece) => {
    // acc pemain untuk pindah hanya ke bagian basic dalam warna
    return !game.game_over() && piece.search(userColor) === 0;
  };

  // fungsi handle bidak ke bagian papan
  const onDrop = (source, target) => {
    const move = game.move({
      from: source,
      to: target,
      promotion: "q",
    });

    if (move === null) return "snapback";

    window.setTimeout(makeRandomMove, 250);
    recordMove(move.san, moveCount); // rekam dan tampilkan gerakan dengan hitungan gerakan
    moveCount++;
  };

  // fitur untuk handle akhir animasi snap sepotong
  const onSnapEnd = () => {
    board.position(game.fen());
  };

  // konfigurasi pilihan untuk papan
  const boardConfig = {
    showNotation: true,
    draggable: true,
    position: "start",
    onDragStart,
    onDrop,
    onSnapEnd,
    moveSpeed: "fast",
    snapBackSpeed: 500,
    snapSpeed: 100,
  };

  board = Chessboard("board", boardConfig);

  // event listener untuk tombol "Maen Lagi"
  document.querySelector(".play-again").addEventListener("click", () => {
    game.reset();
    board.start();
    moveHistory.textContent = "";
    moveCount = 1;
    userColor = "w";
  });

  // event listener untuk tombol "Ator position"
  document.querySelector(".set-pos").addEventListener("click", () => {
    const fen = prompt("Enter the FEN notation for the desired position!");
    if (fen !== null) {
      if (game.load(fen)) {
        board.position(fen);
        moveHistory.textContent = "";
        moveCount = 1;
        userColor = "w";
      } else {
        alert("Invalid FEN notation. plis try again");
      }
    }
  });

  //   event listener untuk tombol "balek cator"
  document.querySelector(".flip-board").addEventListener("click", () => {
    board.flip();
    makeRandomMove();
    // toggle warna pengguna setelah membalik papan
    userColor = userColor === "w" ? "b" : "w";
  });
});

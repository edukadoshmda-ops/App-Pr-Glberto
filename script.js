/* =========================================================
   PLAY BOOKS — SCRIPT.JS
========================================================= */


/* =========================================================
   PDF.JS
========================================================= */

if (typeof pdfjsLib !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}


/* =========================================================
   CONFIGURAÇÃO DOS LIVROS
========================================================= */

const books = {

  habitos: {
    title: "Transformando Hábitos",
    // Canonical file path
    files: [
      "assets/playbooks/transformando-habitos.pdf"
    ]
  },

  jonas: {
    title: "Jonas 3 Inconformado",
    files: [
      "assets/playbooks/jonas-3-inconformdo.pdf"
    ]
  },

  lideranca: {
    title: "Os 5 Níveis da Liderança Cristã",
    files: [
      "assets/playbooks/os-5-niveis-da-lideranca-crista.pdf"
    ]
  },

  eusou: {
    title: "Eu Sou",
    files: [
      "assets/playbooks/eu-sou.pdf"
    ]
  },

  discipulado: {
    title: "O Discipulado na Prática",
    files: [
      "assets/playbooks/O Discipulado Pratico CBM.pdf"
    ]
  }

};

// Helper: find first available URL among candidates using HEAD requests
async function findAvailableFile(candidates) {
  if (!Array.isArray(candidates)) return null;
  for (const p of candidates) {
    if (p.startsWith('http') && !p.includes(window.location.hostname)) {
      return p; // Assume external links are available
    }
    try {
      // Try HEAD first (common for static servers)
      let resp = null;
      try {
        resp = await fetch(p, { method: 'HEAD' });
      } catch (e) {
        resp = null;
      }
      if (resp && resp.ok) return p;

      // Fallback: try a lightweight GET to confirm availability
      try {
        const g = await fetch(p, { method: 'GET' });
        if (g && g.ok) return p;
      } catch (err) {
        // ignore and try next candidate
      }
    } catch (e) {
      // ignore and try next
    }
  }
  return null;
}


/* =========================================================
   ESTADO DO LEITOR
========================================================= */

let currentBook = null;

let pdfDocument = null;

let currentPage = 1;

let totalPages = 0;

let zoomLevel = 1;

let isRendering = false;

let panX = 0;
let panY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;


/* =========================================================
   ELEMENTOS
========================================================= */

const modal =
  document.getElementById("bookViewerModal");

const leftCanvas =
  document.getElementById("leftCanvas");

const rightCanvas =
  document.getElementById("rightCanvas");

const currentPageElement =
  document.getElementById("currentPage");

const totalPagesElement =
  document.getElementById("totalPages");

const prevButton =
  document.getElementById("prevBtn");

const nextButton =
  document.getElementById("nextBtn");

const zoomValueElement =
  document.getElementById("zoomValue");


/* =========================================================
   ABRIR LIVRO
========================================================= */

function checkAccess(itemId, moduleType = 'playbooks') {
  if (window.AppPermissions && typeof window.AppPermissions.checkItemAccess === 'function') {
    return window.AppPermissions.checkItemAccess(moduleType, itemId);
  }
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const status = localStorage.getItem('userStatus') || 'approved';
  
  if (isAdmin || status === 'approved') return true;

  const createdAtStr = localStorage.getItem('userCreatedAt');
  const createdAt = createdAtStr ? new Date(createdAtStr) : new Date();
  const daysSinceRegistration = Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24));
  
  if (daysSinceRegistration <= 7) {
    if (itemId !== 'lideranca' && itemId !== 'habitos') {
      if (window.AppPermissions && typeof window.AppPermissions.showAccessModal === 'function') {
        window.AppPermissions.showAccessModal(
          'Item Bloqueado na Degustação Grátis (7 Dias)',
          'Durante os 7 dias de degustação grátis, você tem 1 item liberado neste módulo e todos os vídeos liberados. Assine o plano para desbloquear todos os conteúdos!'
        );
      } else {
        alert('Acesso restrito. Durante o período de teste de 7 dias, apenas 1 item está liberado para degustação. Adquira o plano completo para acesso total!');
      }
      return false;
    }
    return true;
  }
  
  alert('Seu período de teste de 7 dias expirou. Adquira o acesso Premium para continuar usando.');
  return false;
}

async function openBookViewer(bookId) {
  if (!checkAccess(bookId)) return;

  if (!books[bookId]) {

    console.error(
      "Livro não encontrado:",
      bookId
    );

    alert(
      "Não foi possível encontrar este livro."
    );

    return;
  }


  currentBook = books[bookId];

  currentPage = 1;

  zoomLevel = 1.5; // Aumentando zoom inicial para ser mais visível
  console.log('Zoom inicial definido para:', zoomLevel);

  // Reset pan
  panX = 0;
  panY = 0;

  pdfDocument = null;

  updateZoomDisplay();


  if (!modal) {
    console.error(
      "Modal do leitor não encontrado."
    );

    return;
  }


  modal.classList.add("active");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "book-open"
  );


  showLoading();


  try {

    // Resolve which file to load from the candidate list
    const filePath = await findAvailableFile(currentBook.files);

    if (!filePath) {
      throw new Error('Nenhum arquivo disponível para este livro.');
    }

    // Cache resolved file on the currentBook for later reference
    currentBook.file = filePath;

    let fetchUrls = [filePath];
    const isExternal = filePath.startsWith('http') && !filePath.includes(window.location.hostname);
    if (isExternal) {
        let driveDirect = filePath;
        const driveMatch = filePath.match(/[-\w]{25,}/);
        if (driveMatch && filePath.includes('drive')) {
            driveDirect = `https://drive.usercontent.google.com/download?id=${driveMatch[0]}&export=download&confirm=t`;
        }
        
        fetchUrls = [
            `/proxy-drive/${driveMatch[0]}`, // Novo Vercel Edge Proxy (Bypassa limite de tamanho e remove CORS)
            `/api/proxy-pdf?url=${encodeURIComponent(filePath)}`, // Node.js Proxy Antigo (Vercel limit 4.5MB)
            `https://corsproxy.io/?${encodeURIComponent(driveDirect)}`, // Free CORS proxy
            `https://api.allorigins.win/raw?url=${encodeURIComponent(driveDirect)}` // Backup proxy
        ];
    }

    let success = false;
    let lastError = null;

    for (const url of fetchUrls) {
        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            
            const contentType = resp.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                throw new Error('Retornou HTML (página antivírus) em vez de PDF');
            }

            const data = await resp.arrayBuffer();
            pdfDocument = await pdfjsLib.getDocument({ data }).promise;
            success = true;
            break; // Stop at first successful fetch
        } catch (err) {
            console.warn(`Proxy falhou (${url}):`, err.message);
            lastError = err;
        }
    }

    if (!success) {
        throw new Error(`Não foi possível carregar o PDF via CORS: ${lastError?.message}`);
    }

    totalPages = pdfDocument.numPages;

    if (totalPagesElement) {
      totalPagesElement.textContent = totalPages;
    }

    await renderCurrentPages();

    // Setup drag functionality for both canvases
    setupDragAndDrop(leftCanvas);
    setupDragAndDrop(rightCanvas);


  } catch (error) {
    console.error("Erro ao carregar PDF:", error);
    clearCanvases();
    closeBookViewer(); // Esconde o modal do leitor (para não ficar preso na tela)
    throw error; // Lança o erro para que play-books.html e artigos.html ativem o fallback (iframe)
  }
}


/* =========================================================
   FECHAR LEITOR
========================================================= */

function closeBookViewer() {

  if (!modal) {
    return;
  }


  modal.classList.remove("active");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "book-open"
  );


  pdfDocument = null;

  currentBook = null;

  clearCanvases();

}


/* =========================================================
   RENDERIZAR PÁGINAS
========================================================= */

async function renderCurrentPages() {

  if (
    !pdfDocument ||
    isRendering
  ) {
    return;
  }


  isRendering = true;


  try {

    showLoading();


    const leftPageNumber =
      currentPage;


    const rightPageNumber =
      currentPage + 1;


    await renderPage(
      leftPageNumber,
      leftCanvas
    );


    if (
      rightPageNumber <= totalPages
    ) {

      await renderPage(
        rightPageNumber,
        rightCanvas
      );

      if (rightCanvas) {
        rightCanvas.style.display =
          "block";
      }

    } else {

      clearCanvas(rightCanvas);

      if (rightCanvas) {
        rightCanvas.style.display =
          "none";
      }

    }


    updatePageControls();


  } catch (error) {

    console.error(
      "Erro ao renderizar páginas:",
      error
    );

  } finally {

    isRendering = false;

  }

}


/* =========================================================
   RENDERIZAR UMA PÁGINA
========================================================= */

async function renderPage(
  pageNumber,
  canvas
) {

  if (
    !pdfDocument ||
    !canvas ||
    pageNumber > totalPages
  ) {
    return;
  }


  const page =
    await pdfDocument.getPage(
      pageNumber
    );


  const container =
    canvas.parentElement;

  if (!container) {
    return;
  }


  const baseViewport =
    page.getViewport({
      scale: 1.5
    });


  const devicePixelRatio =
    window.devicePixelRatio || 1;


  canvas.width =
    Math.floor(
      baseViewport.width *
      devicePixelRatio
    );


  canvas.height =
    Math.floor(
      baseViewport.height *
      devicePixelRatio
    );


  canvas.style.width =
    `${baseViewport.width}px`;


  canvas.style.height =
    `${baseViewport.height}px`;


  // Aplica zoom e pan usando CSS transform (sem transições para movimento rápido)
  canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
  canvas.style.transformOrigin = 'center center';


  const context =
    canvas.getContext(
      "2d",
      {
        alpha: false
      }
    );


  context.setTransform(
    devicePixelRatio,
    0,
    0,
    devicePixelRatio,
    0,
    0
  );


  await page.render({
    canvasContext: context,
    viewport: baseViewport
  }).promise;

}


/* =========================================================
   PRÓXIMA PÁGINA
========================================================= */

window.nextPage = async function () {

  if (
    !pdfDocument ||
    isRendering
  ) {
    return;
  }


  if (
    currentPage + 2 >
    totalPages
  ) {
    return;
  }

  // Adiciona animação de virar página apenas na esquerda
  const leftPage = document.getElementById('leftPage');
  const rightPage = document.getElementById('rightPage');

  if (leftPage) leftPage.classList.add('flipping-right');
  if (rightPage) rightPage.classList.add('fade-slide');

  // Remove classes após animação
  setTimeout(() => {
    if (leftPage) leftPage.classList.remove('flipping-right');
    if (rightPage) rightPage.classList.remove('fade-slide');
  }, 1200);

  currentPage += 2;

  await renderCurrentPages();

}


/* =========================================================
   PÁGINA ANTERIOR
========================================================= */

window.prevPage = async function () {

  if (
    !pdfDocument ||
    isRendering
  ) {
    return;
  }


  if (currentPage <= 1) {
    return;
  }

  // Adiciona animação de virar página apenas na esquerda
  const leftPage = document.getElementById('leftPage');
  const rightPage = document.getElementById('rightPage');

  if (leftPage) leftPage.classList.add('flipping-left');
  if (rightPage) rightPage.classList.add('fade-slide');

  // Remove classes após animação
  setTimeout(() => {
    if (leftPage) leftPage.classList.remove('flipping-left');
    if (rightPage) rightPage.classList.remove('fade-slide');
  }, 1200);

  currentPage =
    Math.max(
      1,
      currentPage - 2
    );


  await renderCurrentPages();

}


/* =========================================================
   DRAG/PAN FUNCTIONALITY
========================================================= */

function setupDragAndDrop(canvas) {
  if (!canvas) return;

  canvas.style.cursor = 'grab';

  canvas.addEventListener('mousedown', (e) => {
    if (zoomLevel <= 1) return; // Só permite drag quando zoom > 1
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    canvas.style.cursor = 'grabbing';
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
  });

  canvas.addEventListener('mouseleave', () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
  });

  // Touch events para mobile
  canvas.addEventListener('touchstart', (e) => {
    if (zoomLevel <= 1 || e.touches.length !== 1) return;
    isDragging = true;
    startX = e.touches[0].clientX - panX;
    startY = e.touches[0].clientY - panY;
  });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    panX = e.touches[0].clientX - startX;
    panY = e.touches[0].clientY - startY;
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
  });

  canvas.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* =========================================================
   ZOOM IN
========================================================= */

// Attach zoom functions to window to guarantee onclick handlers work
window.zoomIn = async function () {
  console.log('zoomIn chamado - zoomLevel atual:', zoomLevel);
  if (!pdfDocument || isRendering) {
    console.warn('zoomIn: pdfDocument not ready or rendering in progress');
    return;
  }

  zoomLevel = Math.min(zoomLevel + 0.25, 3);
  console.log('Novo zoomLevel:', zoomLevel);
  // Reset pan quando mudar zoom
  panX = 0;
  panY = 0;
  updateZoomDisplay();
  await renderCurrentPages();
};

window.zoomOut = async function () {
  console.log('zoomOut chamado - zoomLevel atual:', zoomLevel);
  if (!pdfDocument || isRendering) {
    console.warn('zoomOut: pdfDocument not ready or rendering in progress');
    return;
  }

  zoomLevel = Math.max(zoomLevel - 0.25, 0.5);
  console.log('Novo zoomLevel:', zoomLevel);
  // Reset pan quando mudar zoom
  panX = 0;
  panY = 0;
  updateZoomDisplay();
  await renderCurrentPages();
};

/* =========================================================
   ATUALIZAR ZOOM
========================================================= */

function updateZoomDisplay() {
  // resolve element at runtime in case it wasn't present at initial script load
  const zEl = (typeof zoomValueElement !== 'undefined' && zoomValueElement) ? zoomValueElement : document.getElementById('zoomValue');
  if (!zEl) return;
  zEl.textContent = `${Math.round(zoomLevel * 100)}%`;
}


/* =========================================================
   CONTROLES DE PÁGINA
========================================================= */

function updatePageControls() {

  if (currentPageElement) {

    currentPageElement.textContent =
      currentPage;

  }


  if (totalPagesElement) {

    totalPagesElement.textContent =
      totalPages;

  }


  if (prevButton) {

    prevButton.disabled =
      currentPage <= 1;

  }


  if (nextButton) {

    nextButton.disabled =
      currentPage + 2 >
      totalPages;

  }

}


/* =========================================================
   LOADING
========================================================= */

function showLoading() {

  if (leftCanvas) {

    leftCanvas.style.visibility =
      "hidden";

  }


  if (rightCanvas) {

    rightCanvas.style.visibility =
      "hidden";

  }


  setTimeout(() => {

    if (leftCanvas) {

      leftCanvas.style.visibility =
        "visible";

    }


    if (rightCanvas) {

      rightCanvas.style.visibility =
        "visible";

    }

  }, 100);

}


/* =========================================================
   LIMPAR CANVAS
========================================================= */

function clearCanvas(canvas) {

  if (!canvas) {
    return;
  }


  const context =
    canvas.getContext("2d");

  if (!context) {
    return;
  }


  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  canvas.width = 1;

  canvas.height = 1;

}


/* =========================================================
   LIMPAR OS DOIS CANVAS
========================================================= */

function clearCanvases() {

  clearCanvas(
    leftCanvas
  );


  clearCanvas(
    rightCanvas
  );

}


/* =========================================================
   FECHAR COM ESC
========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Escape" &&
      modal &&
      modal.classList.contains("active")
    ) {

      closeBookViewer();

    }

  }
);


/* =========================================================
   CLIQUE FORA DO LEITOR
========================================================= */

if (modal) {

  modal.addEventListener(
    "click",
    function (event) {

      if (
        event.target === modal
      ) {

        closeBookViewer();

      }

    }
  );

}


/* =========================================================
   REDIMENSIONAMENTO DA TELA
========================================================= */

let resizeTimer = null;


window.addEventListener(
  "resize",
  function () {

    if (
      !pdfDocument ||
      isRendering
    ) {
      return;
    }


    clearTimeout(
      resizeTimer
    );


    resizeTimer =
      setTimeout(
        function () {

          renderCurrentPages();

        },
        250
      );

  }
);


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  /*
    Se sua aplicação possuir
    sistema próprio de autenticação,
    substitua esta parte pela
    função de logout existente.
  */

  const confirmLogout =
    confirm(
      "Deseja realmente sair da plataforma?"
    );


  if (!confirmLogout) {
    return;
  }


  /*
    Tenta limpar informações
    comuns de sessão.
  */

  try {

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "token"
    );

    sessionStorage.clear();

  } catch (error) {

    console.warn(
      "Não foi possível limpar a sessão.",
      error
    );

  }


  /*
    Redirecionamento.
    Altere para login.html
    caso sua tela de login tenha
    outro nome.
  */

  window.location.href =
    "login.html";

}


/* =========================================================
   AUDIO PLAYER
========================================================= */

const audioLibrary = {
  eusou: {
    title: "Eu Sou",
    chapterTitles: [
      "Prefácio e Introdução",
      "Capítulo 1: O Chamado de Moisés",
      "Capítulo 2: Eu Sou o Que Sou",
      "Capítulo 3: Eu Sou o Pão da Vida",
      "Capítulo 4: Eu Sou a Luz do Mundo",
      "Capítulo 5: Eu Sou a Porta",
      "Capítulo 6: Eu Sou o Bom Pastor",
      "Capítulo 7: O Caminho, a Verdade e a Vida",
      "Capítulo 8: A Videira Verdadeira",
      "Capítulo 9: Antes que Abraão Existisse",
      "Capítulo 10: O Deus Presente",
      "Capítulo 11: O Senhor da Glória",
      "Capítulo 12: O Alfa e o Ômega",
      "Capítulo 13: O Cordeiro de Deus",
      "Capítulo 14: O Rei dos Reis",
      "Capítulo 15: O que Vem Sem Demora",
      "Capítulo 16: O Refúgio no Deserto",
      "Capítulo 17: A Presença que Transforma",
      "Conclusão: A Plenitude do Eu Sou"
    ],
    tracks: [
      "assets/audiobooks/eusou/faixa_01.mp3",
      "assets/audiobooks/eusou/faixa_02.mp3",
      "assets/audiobooks/eusou/faixa_03.mp3",
      "assets/audiobooks/eusou/faixa_04.mp3",
      "assets/audiobooks/eusou/faixa_05.mp3",
      "assets/audiobooks/eusou/faixa_06.mp3",
      "assets/audiobooks/eusou/faixa_07.mp3",
      "assets/audiobooks/eusou/faixa_08.mp3",
      "assets/audiobooks/eusou/faixa_09.mp3",
      "assets/audiobooks/eusou/faixa_10.mp3",
      "assets/audiobooks/eusou/faixa_11.mp3",
      "assets/audiobooks/eusou/faixa_12.mp3",
      "assets/audiobooks/eusou/faixa_13.mp3",
      "assets/audiobooks/eusou/faixa_14.mp3",
      "assets/audiobooks/eusou/faixa_15.mp3",
      "assets/audiobooks/eusou/faixa_16.mp3",
      "assets/audiobooks/eusou/faixa_17.mp3",
      "assets/audiobooks/eusou/faixa_18.mp3",
      "assets/audiobooks/eusou/faixa_19.mp3"
    ]
  },
  habitos: {
    title: "Transformando Hábitos",
    chapterTitles: [
      "Capítulo 1: A Anatomia dos Hábitos",
      "Capítulo 2: Diagnóstico Comportamental",
      "Capítulo 3: Arquitetura de Objetivos",
      "Capítulo 4: Engenharia da Transformação",
      "Capítulo 5: Psicologia Interna e Força de Vontade",
      "Capítulo 6: Construção e Sustentação de Rotinas",
      "Capítulo 7: Resiliência e Gestão de Recaídas",
      "Capítulo 8: A Base Biológica da Performance",
      "Capítulo 9: Produtividade Profunda e Gestão de Energia",
      "Capítulo 10: A Dinâmica Social e Relações",
      "Capítulo 11: O Modelo Mental de Alto Desempenho",
      "Capítulo 12: Consolidação da Identidade",
      "Capítulo 13: Automação e Sustentabilidade",
      "Conclusão: O Plano de Ação Prático"
    ],
    tracks: [
      "assets/audiobooks/habitos/faixa_01.mp3",
      "assets/audiobooks/habitos/faixa_02.mp3",
      "assets/audiobooks/habitos/faixa_03.mp3",
      "assets/audiobooks/habitos/faixa_04.mp3",
      "assets/audiobooks/habitos/faixa_05.mp3",
      "assets/audiobooks/habitos/faixa_06.mp3",
      "assets/audiobooks/habitos/faixa_07.mp3",
      "assets/audiobooks/habitos/faixa_08.mp3",
      "assets/audiobooks/habitos/faixa_09.mp3",
      "assets/audiobooks/habitos/faixa_10.mp3",
      "assets/audiobooks/habitos/faixa_11.mp3",
      "assets/audiobooks/habitos/faixa_12.mp3",
      "assets/audiobooks/habitos/faixa_13.mp3",
      "assets/audiobooks/habitos/faixa_14.mp3"
    ]
  },
  jonas: {
    title: "Jonas 3 Inconformado",
    chapterTitles: [
      "Prefácio e Introdução",
      "Capítulo 1: A Fuga de um Homem",
      "Capítulo 2: Três Dias na Escuridão",
      "Capítulo 3: O Maior Avivamento da História",
      "Capítulo 4: Quando o Profeta se Irrita",
      "Capítulo 5: Nínive, Cidade que Deus Não Desistiu de Amar",
      "Capítulo 6: Jonas e Jesus",
      "Capítulo 7: Jonas e a Igreja de Hoje",
      "Capítulo 8: O Clamor da Cidade",
      "Capítulo 9: A Planta e o Verme",
      "Capítulo 10: Graça Inesperada",
      "Capítulo 11: O Deus que Perdoa",
      "Capítulo 12: A Resposta do Coração",
      "Conclusão: O Deus que Continua Chamando"
    ],
    tracks: [
      "assets/audiobooks/jonas/faixa_01.mp3",
      "assets/audiobooks/jonas/faixa_02.mp3",
      "assets/audiobooks/jonas/faixa_03.mp3",
      "assets/audiobooks/jonas/faixa_04.mp3",
      "assets/audiobooks/jonas/faixa_05.mp3",
      "assets/audiobooks/jonas/faixa_06.mp3",
      "assets/audiobooks/jonas/faixa_07.mp3",
      "assets/audiobooks/jonas/faixa_08.mp3",
      "assets/audiobooks/jonas/faixa_09.mp3",
      "assets/audiobooks/jonas/faixa_10.mp3",
      "assets/audiobooks/jonas/faixa_11.mp3",
      "assets/audiobooks/jonas/faixa_12.mp3",
      "assets/audiobooks/jonas/faixa_13.mp3",
      "assets/audiobooks/jonas/faixa_14.mp3"
    ]
  },
  lideranca: {
    title: "Os 5 Níveis da Liderança Cristã",
    chapterTitles: [
      "Prefácio",
      "Apresentação do Autor",
      "Capítulo 1: Perfis de Liderança Cristã",
      "Capítulo 2: Os 5 Níveis da Liderança Cristã",
      "Capítulo 3: Fundamentos Bíblicos da Liderança",
      "Capítulo 4: Ferramentas para Formação de Líderes",
      "Capítulo 5: Vivendo para o Legado",
      "Capítulo 6: Autoliderança e Vida Devocional",
      "Capítulo 7: Liderança em Tempos de Crise",
      "Capítulo 8: Relacionamentos e Conflitos",
      "Capítulo 9: Visão Ministerial e Planejamento",
      "Capítulo 10: Formação de Equipes e Honra",
      "Conclusão: O Legado que Permanece",
      "Palavras Finais"
    ],
    tracks: [
      "assets/audiobooks/lideranca/faixa_02.mp3",
      "assets/audiobooks/lideranca/faixa_03.mp3",
      "assets/audiobooks/lideranca/faixa_04.mp3",
      "assets/audiobooks/lideranca/faixa_05.mp3",
      "assets/audiobooks/lideranca/faixa_06.mp3",
      "assets/audiobooks/lideranca/faixa_07.mp3",
      "assets/audiobooks/lideranca/faixa_08.mp3",
      "assets/audiobooks/lideranca/faixa_09.mp3",
      "assets/audiobooks/lideranca/faixa_10.mp3",
      "assets/audiobooks/lideranca/faixa_11.mp3",
      "assets/audiobooks/lideranca/faixa_12.mp3",
      "assets/audiobooks/lideranca/faixa_13.mp3",
      "assets/audiobooks/lideranca/faixa_14.mp3",
      "assets/audiobooks/lideranca/faixa_15.mp3"
    ]
  },
  discipulado: {
    title: "Discipulado na Prática",
    chapterTitles: [
      "Apresentação e Agradecimentos",
      "Capítulo 1: O que é Discipulado",
      "Capítulo 2: Visão Geral e Propósitos",
      "Capítulo 3: As Bases Bíblicas e a Multiplicação",
      "Capítulo 4: Pré-Evangelismo e Quebra de Barreiras",
      "Capítulo 5: Evangelismo Pessoal e Amizade",
      "Capítulo 6: Testemunho Pessoal e Salvação",
      "Capítulo 7: Evangelismo em Lições nos Lares",
      "Capítulo 8: Pós-Evangelismo e Integração",
      "Capítulo 9: Acompanhamento e Consolidação",
      "Capítulo 10: Formação de Novos Discipuladores",
      "Capítulo 11: A Estrutura do Ministério Local",
      "Capítulo 12: Superando Dificuldades no Ministério",
      "Conclusão: Fruto que Permanece"
    ],
    tracks: [
      "assets/audiobooks/discipulado/faixa_01.mp3",
      "assets/audiobooks/discipulado/faixa_02.mp3",
      "assets/audiobooks/discipulado/faixa_03.mp3",
      "assets/audiobooks/discipulado/faixa_04.mp3",
      "assets/audiobooks/discipulado/faixa_05.mp3",
      "assets/audiobooks/discipulado/faixa_06.mp3",
      "assets/audiobooks/discipulado/faixa_07.mp3",
      "assets/audiobooks/discipulado/faixa_08.mp3",
      "assets/audiobooks/discipulado/faixa_09.mp3",
      "assets/audiobooks/discipulado/faixa_10.mp3",
      "assets/audiobooks/discipulado/faixa_11.mp3",
      "assets/audiobooks/discipulado/faixa_12.mp3",
      "assets/audiobooks/discipulado/faixa_13.mp3",
      "assets/audiobooks/discipulado/faixa_14.mp3"
    ]
  }
};

const audioState = {
  bookId: null,
  trackIndex: 0,
  loop: false,
  muted: false,
  playlistOpen: false,
  tracks: []
};

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const totalSeconds = Math.floor(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function setupAudioPlayer() {
  const player = document.getElementById("mainPlayer");
  if (!player) return;

  const titleEl = document.getElementById("currentTrackTitle");
  const artistEl = document.getElementById("currentTrackArtist");
  const currentTimeEl = document.getElementById("currentTime");
  const durationEl = document.getElementById("duration");
  const progressBar = document.getElementById("progressBar");
  const volumeBar = document.getElementById("volumeBar");
  const playBtn = document.getElementById("playBtn");
  const previousBtn = document.getElementById("previousBtn");
  const nextBtn = document.getElementById("nextBtn");
  const loopBtn = document.getElementById("loopBtn");
  const muteBtn = document.getElementById("muteBtn");
  const playlistToggle = document.getElementById("playlistToggle");
  const playlistList = document.getElementById("playlistList");
  const playlistCount = document.getElementById("playlistCount");
  const playlistSection = document.getElementById("playlistSection");
  const playlistTracks = document.getElementById("playlistTracks");

  function getActiveBook() {
   return audioLibrary[audioState.bookId] || null;
  }

  function renderPlaylist() {
   if (!playlistList) return;
   const activeBook = getActiveBook();
   const tracks = activeBook ? activeBook.tracks : [];
   playlistList.innerHTML = "";

   tracks.forEach((trackUrl, index) => {
     const item = document.createElement("button");
     item.type = "button";
     item.className = "track-item" + (index === audioState.trackIndex ? " active" : "");
     
     const chapterTitle = (activeBook && activeBook.chapterTitles && activeBook.chapterTitles[index])
       ? activeBook.chapterTitles[index]
       : `Capítulo ${index + 1}`;

     item.innerHTML = `
       <span style="display: flex; align-items: center; gap: 8px; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
         <strong style="min-width: 22px;">${index + 1}.</strong>
         <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${chapterTitle}</span>
       </span>
       <span class="track-status" style="font-size: 11px; opacity: 0.85; margin-left: 8px; flex-shrink: 0;">${index === audioState.trackIndex ? "Tocando" : "Ouvir"}</span>
     `;
     item.addEventListener("click", () => {
       if (audioState.bookId && audioState.tracks[index]) {
         audioState.trackIndex = index;
         loadCurrentTrack();
         if (player) player.play().catch(() => {});
       }
     });
     playlistList.appendChild(item);
   });

   if (playlistCount) {
     playlistCount.textContent = `${tracks.length} faixa${tracks.length === 1 ? "" : "s"}`;
   }
  }

  const bookCovers = {
    lideranca: 'assets/playbooks/capas/lideranca-crista.jpg',
    habitos: 'assets/playbooks/capas/transformando-habitos.jpg',
    jonas: 'assets/playbooks/capas/inconformado.jpg',
    eusou: 'assets/playbooks/capas/eu-sou.jpg',
    discipulado: 'assets/playbooks/capas/discipulado-pratico.png'
  };

  window.updateCover = function(bookId) {
    const coverThumb = document.getElementById("playerCoverThumb");
    const featureCover = document.querySelector(".feature-cover");

    let coverUrl = bookCovers[bookId];
    if (!coverUrl && audioLibrary[bookId] && audioLibrary[bookId].cover) {
      coverUrl = audioLibrary[bookId].cover;
    }

    if (coverUrl) {
      // Tem capa — aplica normalmente
      if (coverThumb) {
        coverThumb.style.backgroundImage = `url('${coverUrl}')`;
        coverThumb.style.background = `url('${coverUrl}') center/cover no-repeat`;
        coverThumb.innerHTML = '';
      }
      if (featureCover) {
        featureCover.style.backgroundImage = `url('${coverUrl}')`;
      }
    } else {
      // Sem capa — placeholder com gradiente e ícone de fone
      const title = (audioLibrary[bookId] && audioLibrary[bookId].title) || '';
      let hash = 0;
      for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
      const hue = Math.abs(hash) % 360;
      const gradBg = `linear-gradient(135deg, hsl(${hue},55%,18%) 0%, hsl(220,55%,14%) 100%)`;

      if (coverThumb) {
        coverThumb.style.background = gradBg;
        coverThumb.style.backgroundImage = '';
        coverThumb.style.display = 'flex';
        coverThumb.style.alignItems = 'center';
        coverThumb.style.justifyContent = 'center';
        coverThumb.innerHTML = '<i class="fas fa-headphones" style="color:#f5b52e;font-size:18px;"></i>';
      }
      if (featureCover) {
        featureCover.style.backgroundImage = gradBg;
      }
    }
  }

  function updateMuteButton() {
   if (!muteBtn) return;
   muteBtn.innerHTML = (player.muted || audioState.muted) ? '<i class="fas fa-volume-xmark"></i>' : '<i class="fas fa-volume-high"></i>';
  }

  function updateLoopButton() {
   if (!loopBtn) return;
   loopBtn.style.opacity = audioState.loop ? "1" : "0.8";
   loopBtn.style.borderColor = audioState.loop ? "rgba(245,181,46,0.8)" : "rgba(255,255,255,0.04)";
   loopBtn.style.color = audioState.loop ? "var(--gold)" : "var(--white)";
  }

  function updatePlayButton() {
   if (!playBtn) return;
   if (player.paused) {
     playBtn.innerHTML = '<i class="fas fa-play"></i>';
     playBtn.classList.remove("playing");
   } else {
     playBtn.innerHTML = '<i class="fas fa-pause"></i>';
     playBtn.classList.add("playing");
   }
  }

  function updateTrackInfo() {
   const activeBook = getActiveBook();
   if (titleEl && activeBook) {
     titleEl.textContent = `${activeBook.title}`;
   }
   if (artistEl) {
     const chapterTitle = (activeBook && activeBook.chapterTitles && activeBook.chapterTitles[audioState.trackIndex])
       ? activeBook.chapterTitles[audioState.trackIndex]
       : `Capítulo ${audioState.trackIndex + 1}`;
     artistEl.textContent = chapterTitle;
   }
   if (audioState.bookId) {
     updateCover(audioState.bookId);
   }
  }

  function loadCurrentTrack() {
   if (!audioState.bookId || !audioLibrary[audioState.bookId]) return;

   audioState.tracks = audioLibrary[audioState.bookId].tracks;
   const trackUrl = audioState.tracks[audioState.trackIndex];
   if (!trackUrl) return;

   player.src = trackUrl;
   updateTrackInfo();
   renderPlaylist();

   if (playBtn && !player.paused) {
     player.play().catch(() => {});
   }
  }

  function togglePlay() {
   if (!audioState.bookId) {
     playAudiobook("lideranca");
     return;
   }

   if (player.paused) {
     player.play().catch((err) => {
       console.warn('Erro ao reproduzir áudio:', err);
     });
   } else {
     player.pause();
   }
  }

  function nextTrack() {
   if (!audioState.bookId) return;
   const total = audioState.tracks.length;
   if (!total) return;
   audioState.trackIndex = (audioState.trackIndex + 1) % total;
   loadCurrentTrack();
   player.play().catch(() => {});
  }

  function previousTrack() {
   if (!audioState.bookId) return;
   const total = audioState.tracks.length;
   if (!total) return;
   audioState.trackIndex = (audioState.trackIndex - 1 + total) % total;
   loadCurrentTrack();
   player.play().catch(() => {});
  }

  function syncProgress() {
   if (progressBar) {
     progressBar.value = player.duration ? (player.currentTime / player.duration) * 100 : 0;
   }
   if (currentTimeEl) {
     currentTimeEl.textContent = formatTime(player.currentTime);
   }
   if (durationEl) {
     durationEl.textContent = formatTime(player.duration);
   }
   if (titleEl) {
     const book = getActiveBook();
     if (book) {
       titleEl.textContent = `${book.title}`;
     }
   }
  }

  if (playBtn) {
   playBtn.addEventListener("click", togglePlay);
  }
  if (previousBtn) {
   previousBtn.addEventListener("click", previousTrack);
  }
  if (nextBtn) {
   nextBtn.addEventListener("click", nextTrack);
  }
  if (loopBtn) {
   loopBtn.addEventListener("click", () => {
     audioState.loop = !audioState.loop;
     player.loop = audioState.loop;
     updateLoopButton();
   });
  }
  if (muteBtn) {
   muteBtn.addEventListener("click", () => {
     audioState.muted = !audioState.muted;
     player.muted = audioState.muted;
     updateMuteButton();
   });
  }
  if (playlistToggle) {
   playlistToggle.addEventListener("click", () => {
     audioState.playlistOpen = !audioState.playlistOpen;
     if (playlistSection) {
       playlistSection.style.display = audioState.playlistOpen ? "block" : "none";
     }
     if (playlistTracks) {
       const book = getActiveBook();
       if (book) {
         playlistTracks.innerHTML = book.tracks.map((track, index) => {
           const isActive = index === audioState.trackIndex;
           const chapterTitle = (book.chapterTitles && book.chapterTitles[index])
             ? book.chapterTitles[index]
             : `Capítulo ${index + 1}`;
           return `
             <button type="button" class="playlist-track ${isActive ? "active" : ""}" data-index="${index}">
               <span style="display:flex;align-items:center;gap:8px;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                 <strong style="min-width:22px;">${index + 1}.</strong>
                 <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${chapterTitle}</span>
               </span>
               <small style="margin-left:8px;flex-shrink:0;">${isActive ? "Tocando" : "Ouvir"}</small>
             </button>
           `;
         }).join("");

         playlistTracks.querySelectorAll(".playlist-track").forEach((trackButton) => {
           trackButton.addEventListener("click", () => {
             const idx = Number(trackButton.dataset.index);
             if (Number.isFinite(idx)) {
               audioState.trackIndex = idx;
               loadCurrentTrack();
               player.play().catch(() => {});
             }
           });
         });
       }
     }
   });
  }
  if (progressBar) {
   progressBar.addEventListener("input", (event) => {
     const value = Number(event.target.value);
     if (!player.duration) return;
     player.currentTime = (value / 100) * player.duration;
     syncProgress();
   });
  }
  if (volumeBar) {
   volumeBar.addEventListener("input", (event) => {
     const value = Number(event.target.value);
     try {
       player.volume = Number.isFinite(value) ? value : 0.8;
       player.muted = value <= 0;
       audioState.muted = player.muted;
     } catch(e) {}
     updateMuteButton();
   });
  }

  player.addEventListener("timeupdate", syncProgress);
  player.addEventListener("loadedmetadata", syncProgress);
  player.addEventListener("play", updatePlayButton);
  player.addEventListener("pause", updatePlayButton);
  player.addEventListener("ended", () => {
   if (audioState.loop) {
     player.currentTime = 0;
     player.play().catch(() => {});
     return;
   }
   nextTrack();
  });

  try { player.volume = 0.8; } catch(e) {}
  updateMuteButton();
  updateLoopButton();
  updatePlayButton();
  renderPlaylist();
}

function playAudiobook(bookId) {
  if (!checkAccess(bookId, 'audiobook')) return;
  if (!audioLibrary[bookId]) {
   console.error("Livro de áudio não encontrado:", bookId);
   return;
  }

  const player = document.getElementById("mainPlayer");
  if (!player) {
   console.warn("Player principal não encontrado na página.");
   return;
  }

  const activeBook = audioLibrary[bookId];
  audioState.bookId = bookId;
  audioState.trackIndex = 0;
  audioState.tracks = activeBook.tracks;
  player.src = audioState.tracks[0];
  try { player.volume = 0.8; } catch(e) {}

  // Usa a função centralizada que trata capa ausente com placeholder
  updateCover(bookId);

  const titleEl = document.getElementById("currentTrackTitle");
  const artistEl = document.getElementById("currentTrackArtist");
  if (titleEl) titleEl.textContent = activeBook.title;
  
  const initialChapter = (activeBook.chapterTitles && activeBook.chapterTitles[0])
    ? activeBook.chapterTitles[0]
    : "Capítulo 1";
  if (artistEl) artistEl.textContent = initialChapter;

  const playlistList = document.getElementById("playlistList");
  if (playlistList && !playlistList.classList.contains('playlist-list')) {
    playlistList.classList.add('playlist-list');
  }

  if (playlistList) {
   playlistList.innerHTML = activeBook.tracks.map((_, index) => {
     const chapterTitle = (activeBook.chapterTitles && activeBook.chapterTitles[index])
       ? activeBook.chapterTitles[index]
       : `Capítulo ${index + 1}`;
     return `
     <button type="button" class="track-item ${index === 0 ? 'active' : ''}">
       <span style="display:flex;align-items:center;gap:8px;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
         <strong style="min-width:22px;">${index + 1}.</strong>
         <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${chapterTitle}</span>
       </span>
       <span class="track-status" style="font-size:11px;opacity:0.85;margin-left:8px;flex-shrink:0;">${index === 0 ? 'Tocando' : 'Ouvir'}</span>
     </button>
   `;
   }).join("");

   playlistList.querySelectorAll(".track-item").forEach((button, index) => {
     button.addEventListener("click", () => {
       audioState.trackIndex = index;
       player.src = activeBook.tracks[index];
       player.play().catch(() => {});
       playlistList.querySelectorAll(".track-item").forEach((btn) => btn.classList.remove("active"));
       button.classList.add("active");
       if (artistEl) {
         const chapterTitle = (activeBook.chapterTitles && activeBook.chapterTitles[index])
           ? activeBook.chapterTitles[index]
           : `Capítulo ${index + 1}`;
         artistEl.textContent = chapterTitle;
       }
     });
   });
  }

  const playlistCount = document.getElementById("playlistCount");
  if (playlistCount) {
   playlistCount.textContent = `${audioLibrary[bookId].tracks.length} faixa${audioLibrary[bookId].tracks.length === 1 ? "" : "s"}`;
  }

  player.play().catch((err) => {
    console.warn("Autoplay bloqueado pelo navegador móvel, aguardando interação do usuário:", err);
  });
}

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

   updateZoomDisplay();
   updatePageControls();
   setupAudioPlayer();

   // Ensure playlist container uses the expected helper class so CSS applies
   const playlistListInit = document.getElementById('playlistList');
   if (playlistListInit && !playlistListInit.classList.contains('playlist-list')) {
     playlistListInit.classList.add('playlist-list');
   }

   // Setup zoom buttons with event listeners
   const zoomInBtn = document.getElementById('zoomInBtn');
   const zoomOutBtn = document.getElementById('zoomOutBtn');

   if (zoomInBtn) {
     zoomInBtn.addEventListener('click', window.zoomIn);
   }

   if (zoomOutBtn) {
     zoomOutBtn.addEventListener('click', window.zoomOut);
   }

   console.log(
     "Play Books carregado com sucesso."
   );

  }
);

// Global logout helper for legacy onclick handlers used in templates
function logout() {
  try {
    // clear simple session markers and redirect to login page
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    // if authManager exists (from script-novo.js), prefer its method
    if (typeof authManager !== 'undefined' && typeof authManager.logout === 'function') {
      try { authManager.logout(); return; } catch (e) { /* fallback below */ }
    }
    window.location.href = 'login.html';
  } catch (err) {
    console.error('Logout failed', err);
    window.location.href = 'login.html';
  }
}

/* =========================================================
   INICIALIZAÇÃO DO MENU LATERAL RESPONSIVO (MOBILE DRAWER)
========================================================= */
function initMobileSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  // 1. Botão de fechar dentro do menu lateral (Mobile)
  if (!sidebar.querySelector('.sidebar-close-btn')) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'sidebar-close-btn';
    closeBtn.setAttribute('aria-label', 'Fechar menu');
    closeBtn.setAttribute('type', 'button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    sidebar.insertBefore(closeBtn, sidebar.firstChild);
  }

  // 2. Topbar Mobile no topo do app-shell
  const appShell = document.querySelector('.app-shell');
  if (appShell && !document.querySelector('.mobile-topbar')) {
    const topbar = document.createElement('div');
    topbar.className = 'mobile-topbar';

    const brandLogo = sidebar.querySelector('.brand-logo');
    const logoSrc = brandLogo ? brandLogo.getAttribute('src') : 'assets/logo.png';
    
    // Obter título da página atual
    const pageTitleElem = document.querySelector('.topbar h1') || document.querySelector('.header-title h1') || document.querySelector('h1');
    const pageTitleText = pageTitleElem ? pageTitleElem.textContent.trim() : 'Plataforma Premium';

    topbar.innerHTML = `
      <div class="mobile-brand">
        <img class="mobile-logo" src="${logoSrc}" alt="PrGilbertoPenido logo" />
        <span class="mobile-page-title">${pageTitleText}</span>
      </div>
      <button class="mobile-menu-toggle" aria-label="Abrir Menu" type="button">
        <i class="fas fa-bars"></i>
      </button>
    `;
    appShell.insertBefore(topbar, appShell.firstChild);
  }

  // 3. Fundo Escurecido (Overlay)
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  // 4. Funções de controle
  const openSidebar = () => {
    sidebar.classList.add('open');
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    sidebar.classList.remove('open');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Delegar eventos de clique globais
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.mobile-menu-toggle');
    const closeBtn = e.target.closest('.sidebar-close-btn');

    if (toggleBtn) {
      e.preventDefault();
      if (sidebar.classList.contains('open') || sidebar.classList.contains('active')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    } else if (closeBtn || e.target === overlay) {
      closeSidebar();
    } else if (e.target.closest('.menu-item')) {
      if (window.innerWidth <= 900) {
        closeSidebar();
      }
    }
  });

  // Fechar ao pressionar a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (sidebar.classList.contains('open') || sidebar.classList.contains('active'))) {
      closeSidebar();
    }
  });

  // Fechar se a janela for redimensionada para Desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeSidebar();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileSidebar);
} else {
  initMobileSidebar();
}

// Voice Toggle Logic for Audiobook
let isFemaleVoice = false;
document.addEventListener('DOMContentLoaded', () => {
    const voiceToggleBtn = document.getElementById('voiceToggleBtn');
    const voiceIcon = document.getElementById('voiceIcon');
    const voiceLabel = document.getElementById('voiceLabel');
    
    if(voiceToggleBtn) {
        voiceToggleBtn.addEventListener('click', () => {
            isFemaleVoice = !isFemaleVoice;
            const currentBookId = audioState.bookId;
            
            if (isFemaleVoice) {
                voiceToggleBtn.classList.add('is-female');
                if(voiceIcon) { voiceIcon.classList.remove('fa-user-tie'); voiceIcon.classList.add('fa-user'); }
                if(voiceLabel) voiceLabel.textContent = 'FEM';
                voiceToggleBtn.style.color = '#ec4899'; // pink color
                
                // Update tracks in library for current book
                if (currentBookId && audioLibrary[currentBookId]) {
                    audioLibrary[currentBookId].tracks = audioLibrary[currentBookId].tracks.map(t => t.replace(`/${currentBookId}/`, `/${currentBookId}-fem/`));
                }
            } else {
                voiceToggleBtn.classList.remove('is-female');
                if(voiceIcon) { voiceIcon.classList.remove('fa-user'); voiceIcon.classList.add('fa-user-tie'); }
                if(voiceLabel) voiceLabel.textContent = 'MASC';
                voiceToggleBtn.style.color = ''; // reset
                
                // Update tracks in library for current book
                if (currentBookId && audioLibrary[currentBookId]) {
                    audioLibrary[currentBookId].tracks = audioLibrary[currentBookId].tracks.map(t => t.replace(`/${currentBookId}-fem/`, `/${currentBookId}/`));
                }
            }

            // If a track is currently playing, reload it with the correct voice
            if (currentBookId) {
                const player = document.getElementById("mainPlayer");
                if (player) {
                    const wasPlaying = !player.paused;
                    const currentTime = player.currentTime;
                    player.src = audioLibrary[currentBookId].tracks[audioState.trackIndex];
                    
                    // After the new source is loaded, set time and play
                    player.onloadedmetadata = () => {
                        player.currentTime = currentTime;
                        if (wasPlaying) player.play().catch(e => console.error(e));
                        player.onloadedmetadata = null; // remove listener
                    };
                }
            }
        });
    }
});

// ==========================================
// THEME TOGGLE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Check local storage for theme
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('theme-light');
    }

    // Attach to all toggle buttons (can be multiple on different pages)
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    
    // Set initial icon based on theme
    toggleBtns.forEach(btn => {
        const icon = btn.querySelector('i');
        if (document.body.classList.contains('theme-light')) {
            if(icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
        } else {
            if(icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
        }

        btn.addEventListener('click', () => {
            document.body.classList.toggle('theme-light');
            const isLight = document.body.classList.contains('theme-light');
            
            // Save preference
            localStorage.setItem('app-theme', isLight ? 'light' : 'dark');
            
            // Update all icons
            toggleBtns.forEach(b => {
                const i = b.querySelector('i');
                if(i) {
                    if (isLight) {
                        i.classList.remove('fa-moon');
                        i.classList.add('fa-sun');
                    } else {
                        i.classList.remove('fa-sun');
                        i.classList.add('fa-moon');
                    }
                }
            });
        });
    });
});

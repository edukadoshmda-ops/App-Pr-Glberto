/**
 * =========================================================
 * ELITEFLOW - SERVER REFATORADO PROFISSIONAL
 * Validação, Segurança, Tratamento de Erros
 * =========================================================
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');
require('dotenv').config();

// =========================================================
// CONFIGURAÇÃO
// =========================================================

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações de limites
const CONFIG = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_REQUEST_SIZE: '50mb',
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/mpeg'],
  ALLOWED_PDF_TYPES: ['application/pdf'],
  REQUEST_TIMEOUT: 30000,
};

const UPLOAD_DIRS = {
  videos: path.join(__dirname, 'assets', 'videos'),
  articles: path.join(__dirname, 'assets', 'artigos', 'capas'),
  pdfs: path.join(__dirname, 'assets', 'artigos', 'pdfs'),
  projects: path.join(__dirname, 'assets', 'projetos'),
};

const DB_PATHS = {
  videos: path.join(__dirname, 'database', 'videos.json'),
  articles: path.join(__dirname, 'database', 'articles.json'),
  projects: path.join(__dirname, 'database', 'projects.json'),
};

// =========================================================
// MIDDLEWARE
// =========================================================

// CORS com configuração específica
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

// Body parser com limite
app.use(express.json({ limit: CONFIG.MAX_REQUEST_SIZE }));
app.use(express.urlencoded({ limit: CONFIG.MAX_REQUEST_SIZE, extended: true }));

// Servir arquivos estáticos
app.use(express.static('.'));

// Request timeout
app.use((req, res, next) => {
  req.setTimeout(CONFIG.REQUEST_TIMEOUT);
  next();
});

// Logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()}:`, err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    }
  });
});

// =========================================================
// UTILITÁRIOS
// =========================================================

/**
 * Criar diretório se não existir
 */
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`Erro ao criar diretório ${dirPath}:`, error);
    throw error;
  }
}

/**
 * Inicializar diretórios
 */
async function initializeDirectories() {
  try {
    for (const dir of Object.values(UPLOAD_DIRS)) {
      await ensureDir(dir);
    }
    await ensureDir(path.dirname(DB_PATHS.videos));
    console.log('[INIT] Diretórios inicializados com sucesso');
  } catch (error) {
    console.error('[INIT] Erro ao inicializar diretórios:', error);
    process.exit(1);
  }
}

/**
 * Inicializar banco de dados JSON
 */
async function initializeDatabase() {
  try {
    for (const [name, dbPath] of Object.entries(DB_PATHS)) {
      if (!fs.existsSync(dbPath)) {
        await fs.writeFile(dbPath, JSON.stringify([], null, 2));
        console.log(`[INIT] Criado: ${name}.json`);
      }
    }
  } catch (error) {
    console.error('[INIT] Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

/**
 * Ler arquivo JSON
 */
async function readJSONFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler ${filePath}:`, error);
    return [];
  }
}

/**
 * Escrever arquivo JSON
 */
async function writeJSONFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Erro ao escrever ${filePath}:`, error);
    throw error;
  }
}

/**
 * Validar tipo de arquivo
 */
function isValidFileType(mimeType, allowedTypes) {
  return allowedTypes.some(type => {
    if (type.includes('*')) {
      const [main] = type.split('/');
      const [mainMime] = mimeType.split('/');
      return main === mainMime;
    }
    return mimeType === type;
  });
}

/**
 * Gerar nome único para arquivo
 */
function generateFileName(originalName) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  return `${name}-${timestamp}-${random}${ext}`;
}

/**
 * Validar entrada (prevenir XSS)
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 1000);
}

// =========================================================
// CONFIGURAÇÃO DO MULTER
// =========================================================

// Videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIRS.videos);
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file.originalname));
  }
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: CONFIG.MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!isValidFileType(file.mimetype, CONFIG.ALLOWED_VIDEO_TYPES)) {
      cb(new Error('Tipo de arquivo não permitido'));
    } else {
      cb(null, true);
    }
  }
});

// Images (Artigos)
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIRS.articles);
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file.originalname));
  }
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!isValidFileType(file.mimetype, CONFIG.ALLOWED_IMAGE_TYPES)) {
      cb(new Error('Tipo de imagem não permitido'));
    } else {
      cb(null, true);
    }
  }
});

// PDFs
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIRS.pdfs);
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file.originalname));
  }
});

const uploadPDF = multer({
  storage: pdfStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (!isValidFileType(file.mimetype, CONFIG.ALLOWED_PDF_TYPES)) {
      cb(new Error('Tipo de arquivo deve ser PDF'));
    } else {
      cb(null, true);
    }
  }
});

// Artigos (image + PDF)
const articleFilesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, UPLOAD_DIRS.articles);
    } else if (file.fieldname === 'pdf') {
      cb(null, UPLOAD_DIRS.pdfs);
    }
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file.originalname));
  }
});

const uploadArticleFiles = multer({
  storage: articleFilesStorage,
  limits: { fileSize: CONFIG.MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image') {
      if (!isValidFileType(file.mimetype, CONFIG.ALLOWED_IMAGE_TYPES)) {
        cb(new Error('Tipo de imagem não permitido'));
      } else {
        cb(null, true);
      }
    } else if (file.fieldname === 'pdf') {
      if (!isValidFileType(file.mimetype, CONFIG.ALLOWED_PDF_TYPES)) {
        cb(new Error('Tipo de arquivo deve ser PDF'));
      } else {
        cb(null, true);
      }
    } else {
      cb(new Error('Campo de arquivo não reconhecido'));
    }
  }
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);

// =========================================================
// ROTAS - VIDEOS
// =========================================================

// GET /api/videos - Obter todos os vídeos
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await readJSONFile(DB_PATHS.videos);
    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao obter vídeos'
    });
  }
});

// POST /api/videos - Criar vídeo
app.post('/api/videos', uploadVideo.single('video'), async (req, res) => {
  try {
    const { title, description, featured } = req.body;

    // Validação
    if (!title || !req.file) {
      return res.status(400).json({
        success: false,
        error: 'Título e arquivo de vídeo são obrigatórios'
      });
    }

    const videos = await readJSONFile(DB_PATHS.videos);
    const newVideo = {
      id: Date.now().toString(),
      title: sanitizeInput(title),
      description: sanitizeInput(description || ''),
      videoPath: `/assets/videos/${req.file.filename}`,
      featured: featured === 'true',
      createdAt: new Date().toISOString(),
      fileSize: req.file.size
    };

    videos.push(newVideo);
    await writeJSONFile(DB_PATHS.videos, videos);

    res.status(201).json({
      success: true,
      data: newVideo,
      message: 'Vídeo criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar vídeo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar vídeo'
    });
  }
});

// DELETE /api/videos/:id - Deletar vídeo
app.delete('/api/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const videos = await readJSONFile(DB_PATHS.videos);
    const video = videos.find(v => v.id === id);

    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Vídeo não encontrado'
      });
    }

    // Deletar arquivo
    try {
      const filePath = path.join(__dirname, video.videoPath);
      await fs.unlink(filePath);
    } catch (error) {
      console.warn('Arquivo não encontrado:', error);
    }

    const updatedVideos = videos.filter(v => v.id !== id);
    await writeJSONFile(DB_PATHS.videos, updatedVideos);

    res.json({
      success: true,
      message: 'Vídeo deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar vídeo'
    });
  }
});

// =========================================================
// ROTAS - ARTIGOS
// =========================================================

// GET /api/articles - Obter todos os artigos
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await readJSONFile(DB_PATHS.articles);
    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao obter artigos'
    });
  }
});

// POST /api/articles - Criar artigo
app.post('/api/articles', uploadArticleFiles, async (req, res) => {
  try {
    const { title, content, description } = req.body;

    // Validação
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Título é obrigatório'
      });
    }

    const articles = await readJSONFile(DB_PATHS.articles);
    const newArticle = {
      id: Date.now().toString(),
      title: sanitizeInput(title),
      description: sanitizeInput(description || ''),
      content: sanitizeInput(content || ''),
      imagePath: req.files?.image ? `/assets/artigos/capas/${req.files.image[0].filename}` : null,
      pdfPath: req.files?.pdf ? `/assets/artigos/pdfs/${req.files.pdf[0].filename}` : null,
      createdAt: new Date().toISOString()
    };

    articles.push(newArticle);
    await writeJSONFile(DB_PATHS.articles, articles);

    res.status(201).json({
      success: true,
      data: newArticle,
      message: 'Artigo criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar artigo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar artigo'
    });
  }
});

// DELETE /api/articles/:id - Deletar artigo
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const articles = await readJSONFile(DB_PATHS.articles);
    const article = articles.find(a => a.id === id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Artigo não encontrado'
      });
    }

    // Deletar arquivos
    const filePaths = [article.imagePath, article.pdfPath].filter(Boolean);
    for (const filePath of filePaths) {
      try {
        await fs.unlink(path.join(__dirname, filePath));
      } catch (error) {
        console.warn('Arquivo não encontrado:', error);
      }
    }

    const updatedArticles = articles.filter(a => a.id !== id);
    await writeJSONFile(DB_PATHS.articles, updatedArticles);

    res.json({
      success: true,
      message: 'Artigo deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar artigo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar artigo'
    });
  }
});

// =========================================================
// ROTAS - PROJETOS
// =========================================================

// GET /api/projects - Obter todos os projetos
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await readJSONFile(DB_PATHS.projects);
    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao obter projetos'
    });
  }
});

// POST /api/projects - Criar projeto
app.post('/api/projects', express.json(), async (req, res) => {
  try {
    const { title, description, team, status } = req.body;

    // Validação
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Título é obrigatório'
      });
    }

    const projects = await readJSONFile(DB_PATHS.projects);
    const newProject = {
      id: Date.now().toString(),
      title: sanitizeInput(title),
      description: sanitizeInput(description || ''),
      team: Array.isArray(team) ? team.map(t => sanitizeInput(t)) : [],
      status: sanitizeInput(status || 'em_andamento'),
      createdAt: new Date().toISOString()
    };

    projects.push(newProject);
    await writeJSONFile(DB_PATHS.projects, projects);

    res.status(201).json({
      success: true,
      data: newProject,
      message: 'Projeto criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar projeto'
    });
  }
});

// DELETE /api/projects/:id - Deletar projeto
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const projects = await readJSONFile(DB_PATHS.projects);
    const project = projects.find(p => p.id === id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projeto não encontrado'
      });
    }

    const updatedProjects = projects.filter(p => p.id !== id);
    await writeJSONFile(DB_PATHS.projects, updatedProjects);

    res.json({
      success: true,
      message: 'Projeto deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar projeto'
    });
  }
});

// =========================================================
// HEALTH CHECK
// =========================================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// =========================================================
// 404 HANDLER
// =========================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    path: req.path
  });
});

// =========================================================
// INICIALIZAÇÃO DO SERVIDOR
// =========================================================

async function startServer() {
  try {
    // Inicializar diretórios e banco de dados
    await initializeDirectories();
    await initializeDatabase();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║  🚀 EliteFlow Server iniciado!         ║
║  📍 Porta: ${PORT}
║  🌍 URL: http://localhost:${PORT}
║  ⏰ Hora: ${new Date().toLocaleString('pt-BR')}
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;

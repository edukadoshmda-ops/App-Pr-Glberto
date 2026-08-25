const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Autenticação simples via X-API-KEY
function requireApiKey(req, res, next) {
    const key = 'prgilbertopenido-secret-key-2024';
    const header = req.get('X-API-KEY') || req.get('x-api-key');
    if (header === key) return next();
    return res.status(401).json({ error: 'Unauthorized' });
}

// Criar pastas de assets se não existirem
const assetsDir = path.join(__dirname, 'assets');
const videosDir = path.join(assetsDir, 'videos');
const coversDir = path.join(assetsDir, 'videos'); // Capas de vídeos ficam na mesma pasta
const articlesDir = path.join(assetsDir, 'artigos', 'capas');
const projectsDir = path.join(assetsDir, 'projetos');
const pdfsDir = path.join(assetsDir, 'artigos', 'pdfs'); // Pasta para PDFs de artigos

[assetsDir, videosDir, coversDir, articlesDir, projectsDir, pdfsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configuração do Multer para upload de vídeos
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, videosDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const coverStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, coversDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const videoFileFilter = (req, file, cb) => {
    const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const imageTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (file.fieldname === 'video') {
        if (videoTypes.includes(file.mimetype)) cb(null, true);
        else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid video type'));
    } else if (file.fieldname === 'cover') {
        if (imageTypes.includes(file.mimetype)) cb(null, true);
        else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid cover type'));
    } else {
        cb(null, false);
    }
};

const uploadVideoFields = multer({
    storage: videoStorage,
    fileFilter: videoFileFilter,
    limits: { fileSize: 200 * 1024 * 1024 } // 200MB per file
}).fields([
    { name: 'video', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
]);

// Configuração do Multer para upload de imagens de artigos
const articleImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, articlesDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const articleFileFilter = (req, file, cb) => {
    const imageTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const pdfTypes = ['application/pdf'];
    if (file.fieldname === 'image') {
        if (imageTypes.includes(file.mimetype)) cb(null, true);
        else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid image type'));
    } else if (file.fieldname === 'pdf') {
        if (pdfTypes.includes(file.mimetype)) cb(null, true);
        else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid pdf type'));
    } else {
        cb(null, false);
    }
};

const uploadArticleFiles = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.fieldname === 'image') {
                cb(null, articlesDir);
            } else if (file.fieldname === 'pdf') {
                cb(null, pdfsDir);
            }
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    }),
    fileFilter: articleFileFilter,
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB per file
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
]);

// Configuração do Multer para upload de arquivos de projetos
const projectStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, projectsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const projectFileFilter = (req, file, cb) => {
    const allowed = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/zip',
        'image/png',
        'image/jpeg',
        'image/webp'
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid project file type'));
};

const uploadProjectFields = multer({
    storage: projectStorage,
    fileFilter: projectFileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB per file
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'files', maxCount: 20 }
]);

// Configuração do Multer para upload de PDF de artigos
const pdfStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pdfsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadPDF = multer({ storage: pdfStorage });


// Arquivo de banco de dados JSON
const dbPath = path.join(__dirname, 'database', 'videos.json');
const articlesDbPath = path.join(__dirname, 'database', 'articles.json');
const projectsDbPath = path.join(__dirname, 'database', 'projects.json');
const usersDbPath = path.join(__dirname, 'database', 'users.json');

// Criar pasta database se não existir
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Inicializar banco de dados se não existir
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
}

if (!fs.existsSync(articlesDbPath)) {
    fs.writeFileSync(articlesDbPath, JSON.stringify([]));
}

if (!fs.existsSync(projectsDbPath)) {
    fs.writeFileSync(projectsDbPath, JSON.stringify([]));
}

if (!fs.existsSync(usersDbPath)) {
    fs.writeFileSync(usersDbPath, JSON.stringify([]));
}

// Função para ler vídeos do banco de dados
function getVideos() {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
}

// Função para salvar vídeos no banco de dados
function saveVideos(videos) {
    fs.writeFileSync(dbPath, JSON.stringify(videos, null, 2));
}

// Função para ler artigos do banco de dados
function getArticles() {
    const data = fs.readFileSync(articlesDbPath, 'utf8');
    return JSON.parse(data);
}

// Função para salvar artigos no banco de dados
function saveArticles(articles) {
    fs.writeFileSync(articlesDbPath, JSON.stringify(articles, null, 2));
}

// Função para ler projetos do banco de dados
function getProjects() {
    const data = fs.readFileSync(projectsDbPath, 'utf8');
    return JSON.parse(data);
}

// Função para salvar projetos no banco de dados
function saveProjects(projects) {
    fs.writeFileSync(projectsDbPath, JSON.stringify(projects, null, 2));
}

const audiobooksDbPath = path.join(__dirname, 'database', 'audiobooks.json');
const playbooksDbPath = path.join(__dirname, 'database', 'playbooks.json');

// Garante que os arquivos existam
if (!fs.existsSync(audiobooksDbPath)) fs.writeFileSync(audiobooksDbPath, JSON.stringify([]));
if (!fs.existsSync(playbooksDbPath)) fs.writeFileSync(playbooksDbPath, JSON.stringify([]));

// Função para ler usuários do banco de dados
function getUsers() {
    const data = fs.readFileSync(usersDbPath, 'utf8');
    return JSON.parse(data);
}

// Função para salvar usuários no banco de dados
function saveUsers(users) {
    fs.writeFileSync(usersDbPath, JSON.stringify(users, null, 2));
}

function getAudiobooks() { return JSON.parse(fs.readFileSync(audiobooksDbPath, 'utf8')); }
function saveAudiobooks(data) { fs.writeFileSync(audiobooksDbPath, JSON.stringify(data, null, 2)); }

function getPlaybooks() { return JSON.parse(fs.readFileSync(playbooksDbPath, 'utf8')); }
function savePlaybooks(data) { fs.writeFileSync(playbooksDbPath, JSON.stringify(data, null, 2)); }

// Rota para listar todos os vídeos
app.get('/api/videos', (req, res) => {
    try {
        const videos = getVideos();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar vídeos' });
    }
});

const https = require('https');
const http = require('http');

app.get('/api/audiobooks', (req, res) => {
    try { res.json(getAudiobooks()); } catch(e) { res.status(500).json({ error: 'Erro' }); }
});

// Proxy de Streaming para Áudios (Google Drive / Links Externos)
app.get('/api/stream-audio', (req, res) => {
    const rawUrl = req.query.url;
    if (!rawUrl) return res.status(400).send('URL do áudio não informada');

    let targetUrl = rawUrl;
    const driveMatch = rawUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                       rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
        targetUrl = `https://docs.google.com/uc?export=download&id=${driveMatch[1]}`;
    }

    function fetchStream(url, depth = 0) {
        if (depth > 6) return res.status(500).send('Muitos redirecionamentos');
        const client = url.startsWith('https') ? https : http;

        const request = client.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                let redirectUrl = response.headers.location;
                if (!redirectUrl.startsWith('http')) {
                    const parsed = new URL(url);
                    redirectUrl = `${parsed.protocol}//${parsed.host}${redirectUrl}`;
                }
                return fetchStream(redirectUrl, depth + 1);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg');
            res.setHeader('Accept-Ranges', 'bytes');
            if (response.headers['content-length']) {
                res.setHeader('Content-Length', response.headers['content-length']);
            }
            response.pipe(res);
        });

        request.on('error', (err) => {
            console.error('Erro no streaming de áudio:', err.message);
            if (!res.headersSent) res.status(500).send('Erro ao buscar áudio');
        });
    }

    fetchStream(targetUrl);
});

// Verifica se um arquivo do Google Drive está acessível publicamente
app.get('/api/check-drive-access', (req, res) => {
    const fileId = req.query.id;
    if (!fileId) return res.json({ accessible: false, error: 'ID não informado' });

    const checkUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    const opts = new URL(checkUrl);

    const request = https.get({
        hostname: opts.hostname,
        path: opts.pathname + opts.search,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
    }, (response) => {
        let body = '';
        response.on('data', chunk => { body += chunk; });
        response.on('end', () => {
            const status = response.statusCode;
            // 200 com conteúdo de preview = acessível
            // 403 ou redirect para accounts.google.com = não acessível
            const location = response.headers.location || '';
            const isBlocked =
                status === 403 ||
                status === 401 ||
                location.includes('accounts.google.com') ||
                body.includes('"errorCode":403') ||
                body.includes('ServiceLogin');

            res.json({ accessible: !isBlocked, status });
        });
    });

    request.on('error', () => res.json({ accessible: false, error: 'network error' }));
    request.setTimeout(8000, () => {
        request.destroy();
        res.json({ accessible: false, error: 'timeout' });
    });
});

// Proxy de PDF para Google Drive / Links Externos (evita CORS e bloqueio do browser)
app.get('/api/proxy-pdf', (req, res) => {
    const rawUrl = req.query.url;
    if (!rawUrl) return res.status(400).send('URL do PDF não informada');

    let targetUrl = rawUrl;
    const driveMatch = rawUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                       rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const fileId = driveMatch ? driveMatch[1] : null;

    if (fileId) {
        // Usa o usercontent.google.com que é mais confiável para download direto
        targetUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
    }

    function fetchPdf(url, depth = 0) {
        if (depth > 8) return res.status(500).send('Muitos redirecionamentos');
        if (res.headersSent) return;

        const client = url.startsWith('https') ? https : http;
        let parsedUrl;
        try { parsedUrl = new URL(url); } catch(e) { return res.status(400).send('URL inválida'); }

        const reqOptions = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/pdf,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9',
            }
        };

        const request = client.get(reqOptions, (response) => {
            // Segue redirecionamentos HTTP
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                let redirectUrl = response.headers.location;
                if (!redirectUrl.startsWith('http')) {
                    redirectUrl = `${parsedUrl.protocol}//${parsedUrl.host}${redirectUrl}`;
                }
                response.resume(); // descarta body do redirect
                return fetchPdf(redirectUrl, depth + 1);
            }

            const ct = response.headers['content-type'] || '';

            // Drive retornou HTML (página de confirmação de vírus/antivírus)
            if (ct.includes('text/html')) {
                let htmlBody = '';
                response.on('data', chunk => { htmlBody += chunk.toString(); });
                response.on('end', () => {
                    // Tenta extrair o link de confirmação do formulário Drive
                    const patterns = [
                        /href="(https:\/\/drive\.usercontent\.google\.com\/download[^"]+confirm=t[^"]+)"/,
                        /href="(https:\/\/drive\.google\.com\/uc\?[^"]+confirm=t[^"]+)"/,
                        /action="([^"]+download[^"]+confirm[^"]+)"/,
                        /"downloadUrl":"([^"]+)"/,
                    ];
                    let nextUrl = null;
                    for (const pat of patterns) {
                        const m = htmlBody.match(pat);
                        if (m) { nextUrl = m[1].replace(/&amp;/g, '&'); break; }
                    }
                    if (nextUrl) {
                        return fetchPdf(nextUrl, depth + 1);
                    }
                    // Última tentativa: usercontent direto com confirm
                    if (fileId && depth < 3) {
                        return fetchPdf(`https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t&uuid=${Date.now()}`, depth + 1);
                    }
                    if (!res.headersSent) res.status(422).send('Não foi possível obter o PDF do Google Drive. Verifique se o arquivo está compartilhado publicamente.');
                });
                return;
            }

            // Recebeu o PDF — envia para o cliente
            if (!res.headersSent) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Accept-Ranges', 'bytes');
                res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
                if (response.headers['content-length']) {
                    res.setHeader('Content-Length', response.headers['content-length']);
                }
                response.pipe(res);
            }
        });

        request.on('error', (err) => {
            console.error('Erro no proxy de PDF:', err.message);
            if (!res.headersSent) res.status(500).send('Erro ao buscar PDF: ' + err.message);
        });
        request.setTimeout(30000, () => {
            request.destroy();
            if (!res.headersSent) res.status(504).send('Timeout ao buscar PDF');
        });
    }

    fetchPdf(targetUrl);
});

app.get('/api/playbooks', (req, res) => {
    try { res.json(getPlaybooks()); } catch(e) { res.status(500).json({ error: 'Erro' }); }
});

app.delete('/api/playbooks/:id', (req, res) => {
    try {
        const playbooks = getPlaybooks();
        const filtered = playbooks.filter(p => p.id !== req.params.id);
        savePlaybooks(filtered);
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: 'Erro ao deletar playbook' });
    }
});

app.delete('/api/audiobooks/:id', (req, res) => {
    try {
        const audiobooks = getAudiobooks();
        const filtered = audiobooks.filter(a => a.id !== req.params.id);
        saveAudiobooks(filtered);
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: 'Erro ao deletar audiobook' });
    }
});

// Rota para buscar um vídeo específico
app.get('/api/videos/:id', (req, res) => {
    try {
        const videos = getVideos();
        const video = videos.find(v => v.id === req.params.id);
        if (video) {
            res.json(video);
        } else {
            res.status(404).json({ error: 'Vídeo não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar vídeo' });
    }
});

// Rota para adicionar novo vídeo
app.post('/api/videos', requireApiKey, uploadVideoFields, (req, res) => {
    try {
        // Validações pós-upload (covers não devem exceder 5MB)
        if (req.files && req.files.cover && req.files.cover[0] && req.files.cover[0].size > 5 * 1024 * 1024) {
            // remover arquivo grande
            const filePath = path.join(__dirname, `/assets/videos/${req.files.cover[0].filename}`.replace(/^\//, ''));
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'Cover exceeds size limit (5MB)' });
        }

        const videos = getVideos();
        
        const newVideo = {
            id: Date.now().toString(),
            title: req.body.title,
            category: req.body.category,
            author: req.body.author,
            youtube: req.body.youtube,
            description: req.body.description,
            featured: req.body.featured === 'true',
            videoPath: req.files && req.files.video ? `/assets/videos/${req.files.video[0].filename}` : null,
            coverPath: req.files && req.files.cover ? `/assets/videos/${req.files.cover[0].filename}` : null,
            createdAt: new Date().toISOString()
        };

        videos.push(newVideo);
        saveVideos(videos);

        res.json(newVideo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar vídeo' });
    }
});

// Rota para deletar vídeo
app.delete('/api/videos/:id', requireApiKey, (req, res) => {
    try {
        const videos = getVideos();
        const index = videos.findIndex(v => v.id === req.params.id);

        if (index !== -1) {
            const video = videos[index];

            // Deletar arquivos físicos
            if (video.videoPath) {
                const videoFilePath = path.join(__dirname, video.videoPath.replace(/^\//, ''));
                if (fs.existsSync(videoFilePath)) {
                    fs.unlinkSync(videoFilePath);
                }
            }

            if (video.coverPath) {
                const coverFilePath = path.join(__dirname, video.coverPath.replace(/^\//, ''));
                if (fs.existsSync(coverFilePath)) {
                    fs.unlinkSync(coverFilePath);
                }
            }

            videos.splice(index, 1);
            saveVideos(videos);

            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Vídeo não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar vídeo' });
    }
});

// Rotas para Artigos

// Rota para listar todos os artigos
app.get('/api/articles', (req, res) => {
    try {
        const articles = getArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar artigos' });
    }
});

// Rota para buscar um artigo específico
app.get('/api/articles/:id', (req, res) => {
    try {
        const articles = getArticles();
        const article = articles.find(a => a.id === req.params.id);
        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ error: 'Artigo não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar artigo' });
    }
});

// Rota para adicionar novo artigo
app.post('/api/articles', requireApiKey, uploadArticleFiles, (req, res) => {
    try {
        const articles = getArticles();

        const newArticle = {
            id: Date.now().toString(),
            title: req.body.title,
            category: req.body.category,
            author: req.body.author,
            content: req.body.content,
            featured: req.body.featured === 'true',
            imagePath: req.files && req.files.image ? `/assets/artigos/capas/${req.files.image[0].filename}` : null,
            pdfPath: req.files && req.files.pdf ? `/assets/artigos/pdfs/${req.files.pdf[0].filename}` : null,
            createdAt: new Date().toISOString()
        };

        articles.push(newArticle);
        saveArticles(articles);

        res.json(newArticle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar artigo' });
    }
});

// Rota para deletar artigo
app.delete('/api/articles/:id', requireApiKey, (req, res) => {
    try {
        const articles = getArticles();
        const index = articles.findIndex(a => a.id === req.params.id);

        if (index !== -1) {
            const article = articles[index];

            // Deletar arquivo físico da imagem
            if (article.imagePath) {
                const imageFilePath = path.join(__dirname, article.imagePath.replace(/^\//, ''));
                if (fs.existsSync(imageFilePath)) {
                    fs.unlinkSync(imageFilePath);
                }
            }

            // Deletar arquivo PDF
            if (article.pdfPath) {
                const pdfFilePath = path.join(__dirname, article.pdfPath.replace(/^\//, ''));
                if (fs.existsSync(pdfFilePath)) {
                    fs.unlinkSync(pdfFilePath);
                }
            }

            articles.splice(index, 1);
            saveArticles(articles);

            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Artigo não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar artigo' });
    }
});

// Rotas para Projetos

// Rota para listar todos os projetos
app.get('/api/projects', (req, res) => {
    try {
        const projects = getProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
});

// Rota para buscar um projeto específico
app.get('/api/projects/:id', (req, res) => {
    try {
        const projects = getProjects();
        const project = projects.find(p => p.id === req.params.id);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ error: 'Projeto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar projeto' });
    }
});

// Rota para adicionar novo projeto (aceita arquivo opcional)
app.post('/api/projects', requireApiKey, uploadProjectFields, (req, res) => {
    try {
        const projects = getProjects();

        const filePath = (req.files && req.files.files && req.files.files[0])
            ? `/assets/projetos/${req.files.files[0].filename}`
            : (req.files && req.files.image && req.files.image[0])
                ? `/assets/projetos/${req.files.image[0].filename}`
                : null;

        const newProject = {
            id: Date.now().toString(),
            title: req.body.title,
            description: req.body.description,
            link: req.body.link,
            filePath: filePath,
            createdAt: new Date().toISOString()
        };

        projects.push(newProject);
        saveProjects(projects);

        res.json(newProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar projeto' });
    }
});

// Rota para deletar projeto
app.delete('/api/projects/:id', requireApiKey, (req, res) => {
    try {
        const projects = getProjects();
        const index = projects.findIndex(p => p.id === req.params.id);

        if (index !== -1) {
            const project = projects[index];

            if (project.filePath) {
                const filePath = path.join(__dirname, project.filePath.replace(/^\//, ''));
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            projects.splice(index, 1);
            saveProjects(projects);

            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Projeto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar projeto' });
    }
});

// Rotas para Usuários

// Rota para registrar novo usuário
app.post('/api/register', (req, res) => {
    try {
        const users = getUsers();
        
        // Verificar se email já existe
        const existingUser = users.find(u => u.email === req.body.email);
        if (existingUser) {
            return res.status(400).json({ error: 'E-mail já cadastrado' });
        }

        const newUser = {
            id: Date.now().toString(),
            fullName: req.body.fullName,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password, // Em produção, usar hash de senha
            status: 'pending', // pending, approved
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        res.json({ success: true, message: 'Usuário cadastrado com sucesso. Aguarde aprovação.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
});

// Rota para login
app.post('/api/login', (req, res) => {
    try {
        const users = getUsers();
        const { email, password } = req.body;

        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos' });
        }

        if (user.status !== 'approved') {
            return res.status(403).json({ error: 'Acesso ainda não liberado. Aguarde aprovação do pagamento.' });
        }

        res.json({ 
            success: true, 
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                isAdmin: user.isAdmin || false
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Rota para listar usuários (admin only)
app.get('/api/users', requireApiKey, (req, res) => {
    try {
        const users = getUsers();
        // Retornar usuários sem senha
        const usersWithoutPassword = users.map(u => ({
            id: u.id,
            fullName: u.fullName,
            phone: u.phone,
            email: u.email,
            status: u.status,
            createdAt: u.createdAt
        }));
        res.json(usersWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// Rota para aprovar usuário (admin only)
app.put('/api/users/:id/approve', requireApiKey, (req, res) => {
    try {
        const users = getUsers();
        const index = users.findIndex(u => u.id === req.params.id);

        if (index !== -1) {
            users[index].status = 'approved';
            saveUsers(users);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao aprovar usuário' });
    }
});

// Rota para editar usuário (admin only)
app.put('/api/users/:id', requireApiKey, (req, res) => {
    try {
        const users = getUsers();
        const index = users.findIndex(u => u.id === req.params.id);

        if (index !== -1) {
            users[index].fullName = req.body.fullName || users[index].fullName;
            users[index].phone = req.body.phone || users[index].phone;
            users[index].email = req.body.email || users[index].email;
            users[index].status = req.body.status || users[index].status;
            users[index].isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : users[index].isAdmin;
            saveUsers(users);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao editar usuário' });
    }
});

// Rota para deletar usuário (admin only)
app.delete('/api/users/:id', requireApiKey, (req, res) => {
    try {
        const users = getUsers();
        const index = users.findIndex(u => u.id === req.params.id);

        if (index !== -1) {
            // Não permitir excluir o super admin
            const protectedEmails = ['edukadoshmda@gmail.com', 'gilbertobertho@gmail.com', 'gilbertbertho@gmail.com'];
            if (users[index].isAdmin && protectedEmails.includes(users[index].email)) {
                return res.status(403).json({ error: 'Não é possível excluir o super admin' });
            }

            users.splice(index, 1);
            saveUsers(users);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

// Rota para upload de conteúdo (vídeo ou artigo)
const contentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'file') {
            const contentType = req.body.contentType;
            if (contentType === 'video') {
                cb(null, 'uploads/videos/');
            } else {
                cb(null, 'uploads/articles/');
            }
        } else if (file.fieldname === 'cover') {
            cb(null, 'uploads/covers/');
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const contentUpload = multer({
    storage: contentStorage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB
    },
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'file') {
            const contentType = req.body.contentType;
            if (contentType === 'video') {
                if (!file.mimetype.startsWith('video/')) {
                    return cb(new Error('Apenas arquivos de vídeo são permitidos'));
                }
            } else {
                if (file.mimetype !== 'application/pdf') {
                    return cb(new Error('Apenas arquivos PDF são permitidos'));
                }
            }
        } else if (file.fieldname === 'cover') {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Apenas arquivos de imagem são permitidos'));
            }
        }
        cb(null, true);
    }
});

app.post('/api/content', express.json(), async (req, res) => {
    try {
        let { contentType, title, category, contentUrl, coverUrl } = req.body;

        if (!contentType || !title || !category) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }

        if (!contentUrl) {
            return res.status(400).json({ error: 'Link do conteúdo é obrigatório' });
        }

        // Se a capa não for fornecida, gerar uma baseada no tipo de conteúdo apenas se possível (ex: YouTube)
        if (!coverUrl || coverUrl.trim() === '') {
            if (contentType === 'video' && contentUrl) {
                const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
                const match = contentUrl.match(ytRegex);
                if (match && match[1]) {
                    // Extrai a capa padrão do YouTube em alta resolução
                    coverUrl = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
                } else {
                    coverUrl = ''; // Deixa vazio para o frontend criar o gradiente
                }
            } else {
                coverUrl = ''; // Deixa vazio para o frontend criar o gradiente dinâmico com ícones
            }
        }

        const contentData = {
            id: Date.now().toString(),
            contentType,
            title: title || 'Sem título',
            category: category || 'Geral',
            contentUrl,
            coverUrl,
            createdAt: new Date().toISOString()
        };

        if (contentType === 'video') {
            const videos = getVideos();
            videos.push({ ...contentData, duration: '00:00', description: '' });
            saveVideos(videos);
        } else if (contentType === 'article') {
            const articles = getArticles();
            articles.push({ ...contentData, description: '' });
            saveArticles(articles);
        } else if (contentType === 'audiobook') {
            const audiobooks = getAudiobooks();
            audiobooks.push({ ...contentData, duration: '00:00', description: '' });
            saveAudiobooks(audiobooks);
        } else if (contentType === 'playbook') {
            const playbooks = getPlaybooks();
            playbooks.push({ ...contentData, totalPages: 0, description: '' });
            savePlaybooks(playbooks);
        } else {
            return res.status(400).json({ error: 'Tipo de conteúdo inválido' });
        }

        res.json({ success: true, content: contentData });
    } catch (error) {
        console.error('Erro ao salvar conteúdo:', error);
        res.status(500).json({ error: 'Erro ao salvar conteúdo' });
    }
});

// Servir arquivos estáticos da pasta assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middleware de tratamento de erros do Multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Tipos de erro comuns: LIMIT_FILE_SIZE, LIMIT_UNEXPECTED_FILE, etc.
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message });
    } else if (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
    next();
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

module.exports = app;

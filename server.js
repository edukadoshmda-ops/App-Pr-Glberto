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

// Autenticação simples via X-API-KEY quando API_KEY estiver definida
function requireApiKey(req, res, next) {
    const key = process.env.API_KEY;
    if (!key) return next();
    const header = req.get('X-API-KEY') || req.get('x-api-key');
    if (header && header === key) return next();
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

// Função para ler usuários do banco de dados
function getUsers() {
    const data = fs.readFileSync(usersDbPath, 'utf8');
    return JSON.parse(data);
}

// Função para salvar usuários no banco de dados
function saveUsers(users) {
    fs.writeFileSync(usersDbPath, JSON.stringify(users, null, 2));
}

// Rota para listar todos os vídeos
app.get('/api/videos', (req, res) => {
    try {
        const videos = getVideos();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar vídeos' });
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
            if (users[index].isAdmin && users[index].email === 'edukadoshmda@gmail.com') {
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

app.post('/api/content', contentUpload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
]), async (req, res) => {
    try {
        const { contentType, title, category } = req.body;
        
        if (!contentType || !title || !category) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }

        const contentData = {
            id: Date.now().toString(),
            contentType,
            title,
            category,
            filePath: req.files['file'] && req.files['file'][0] ? req.files['file'][0].path : null,
            coverPath: req.files['cover'] && req.files['cover'][0] ? req.files['cover'][0].path : null,
            createdAt: new Date().toISOString()
        };

        if (contentType === 'video') {
            // Salvar no database/videos.json
            const videos = getVideos();
            videos.push({
                ...contentData,
                duration: '00:00',
                description: ''
            });
            saveVideos(videos);
        } else {
            // Salvar no database/articles.json
            const articles = getArticles();
            articles.push({
                ...contentData,
                description: ''
            });
            saveArticles(articles);
        }

        res.json({ success: true, content: contentData });
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        res.status(500).json({ error: 'Erro ao fazer upload do conteúdo' });
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

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

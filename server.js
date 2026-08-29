require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
let supabase = null; try { supabase = createClient(process.env.SUPABASE_URL || 'a', process.env.SUPABASE_ANON_KEY || 'a'); } catch(e) { console.error('SUPABASE INIT ERROR:', e.message); }
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const nodemailer = require('nodemailer');
// const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do Transporter do Nodemailer (Gmail)
function createEmailTransporter() {
    const user = process.env.GMAIL_USER || 'gilbertobertho@gmail.com';
    const pass = process.env.GMAIL_APP_PASS || '';

    if (!pass) {
        console.warn('[AVISO] GMAIL_APP_PASS não configurado no .env. Os e-mails serão simulados nos logs do servidor.');
        return null;
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });
}

// Helpers de Envio de E-mail
async function sendEmailNotification({ to, subject, html }) {
    const fromName = process.env.EMAIL_FROM_NAME || 'Pr. Gilberto Penido Bertho';
    const fromUser = process.env.GMAIL_USER || 'gilbertobertho@gmail.com';

    try {
        const transporter = createEmailTransporter();
        if (!transporter) {
            console.log(`[SIMULAÇÃO DE E-MAIL] Para: ${to} | Assunto: ${subject}`);
            return { success: true, simulated: true };
        }

        const info = await transporter.sendMail({
            from: `"${fromName}" <${fromUser}>`,
            to,
            subject,
            html
        });
        console.log(`[E-MAIL ENVIADO COM SUCESSO] Para: ${to} | MessageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`[ERRO AO ENVIAR E-MAIL] Para: ${to}:`, error.message);
        return { success: false, error: error.message };
    }
}

// Modelos de E-mail
async function sendTrialWelcomeEmail(user, expiresAtDate) {
    const pixKey = process.env.PIX_KEY || '(32) 99103-5632';
    const beneficiary = process.env.PIX_BENEFICIARY || 'Pr. Gilberto Penido Bertho';
    const monthlyPrice = process.env.MONTHLY_PRICE || '19.90';
    const whatsapp = process.env.WHATSAPP_PHONE || '5532991035632';
    const formattedDate = expiresAtDate ? new Date(expiresAtDate).toLocaleDateString('pt-BR') : '7 dias';

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1b2a; color: #ffffff; padding: 30px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #cda451; margin: 0; font-size: 24px;">App Pr. Gilberto Penido</h1>
                <p style="color: #25D366; margin-top: 5px; font-size: 15px; font-weight: bold;">🎉 Seu Acesso de Degustação Gratuita foi Liberado!</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">Olá, <strong>${user.fullName || 'Irmão(ã)'}</strong>!</p>
            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e0;">
                Seu cadastro foi realizado com sucesso e você ganhou <strong>7 dias de degustação gratuita</strong> com acesso total aos Áudio Books, Playbooks, Artigos e Vídeos exclusivos!
            </p>

            <div style="background: rgba(37, 211, 102, 0.12); border: 1px solid #25D366; border-radius: 8px; padding: 18px; margin: 20px 0;">
                <p style="margin: 4px 0;"><strong>Período de Degustação:</strong> 7 Dias Grátis</p>
                <p style="margin: 4px 0;"><strong>Degustação válida até:</strong> <span style="color: #25D366; font-weight: bold;">${formattedDate}</span></p>
            </div>

            <div style="text-align: center; margin: 25px 0;">
                <a href="https://prgilbertopenido.com/login.html" 
                   style="background: linear-gradient(135deg, #cda451, #b38b34); color: #101522; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">
                   Acessar o Aplicativo Agora
                </a>
            </div>

            <div style="background: rgba(205, 164, 81, 0.12); border: 1px solid rgba(205, 164, 81, 0.4); border-radius: 8px; padding: 18px; margin: 25px 0;">
                <h4 style="color: #cda451; margin-top: 0; margin-bottom: 8px;">Deseja garantir sua Assinatura Mensal sem interrupções?</h4>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Valor:</strong> R$ ${monthlyPrice}/mês</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Chave PIX:</strong> <span style="font-family: monospace; background: #1b263b; padding: 2px 6px; border-radius: 4px; color: #ffd700;">${pixKey}</span></p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Beneficiário:</strong> ${beneficiary}</p>
            </div>

            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 25px 0;">
            <p style="font-size: 12px; color: #718096; text-align: center;">
                Que Deus abençoe sua vida e ministério através deste conteúdo!
            </p>
        </div>
    `;

    return sendEmailNotification({
        to: user.email,
        subject: '🎉 Sua Degustação Gratuita foi Liberada! - App Pr. Gilberto',
        html
    });
}

async function sendTrialEndingReminderEmail(user, daysRemaining) {
    const pixKey = process.env.PIX_KEY || '(32) 99103-5632';
    const beneficiary = process.env.PIX_BENEFICIARY || 'Pr. Gilberto Penido Bertho';
    const monthlyPrice = process.env.MONTHLY_PRICE || '19.90';
    const whatsapp = process.env.WHATSAPP_PHONE || '5532991035632';

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1b2a; color: #ffffff; padding: 30px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #f5a623; margin: 0; font-size: 24px;">Sua Degustação Encerra em ${daysRemaining} Dias</h1>
                <p style="color: #a0aec0; margin-top: 5px; font-size: 14px;">App Pr. Gilberto Penido</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">Olá, <strong>${user.fullName}</strong>!</p>
            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e0;">
                Esperamos que você esteja sendo abençoado com os conteúdos do app! Seu período de degustação gratuita encerra em <strong style="color: #f5a623;">${daysRemaining} dia(s)</strong>.
            </p>
            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e0;">
                Para continuar com acesso ilimitado a todos os livros, áudios e ministrações, ative seu plano mensal via PIX:
            </p>

            <div style="background: rgba(245, 166, 35, 0.15); border: 1px solid #f5a623; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <p style="margin: 6px 0;"><strong>Valor:</strong> R$ ${monthlyPrice}/mês</p>
                <p style="margin: 6px 0;"><strong>Chave PIX:</strong> <span style="font-family: monospace; background: #1b263b; padding: 4px 8px; border-radius: 4px; color: #ffd700;">${pixKey}</span></p>
                <p style="margin: 6px 0;"><strong>Beneficiário:</strong> ${beneficiary}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://wa.me/${whatsapp}?text=Ol%C3%A1%20Pr.%20Gilberto,%20fiz%20o%20PIX%20mensal%20de%20R$%20${monthlyPrice}%20para%20o%20e-mail%20${encodeURIComponent(user.email)}.%20Segue%20o%20comprovante." 
                   style="background: #25D366; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">
                   Enviar Comprovante via WhatsApp
                </a>
            </div>
        </div>
    `;

    return sendEmailNotification({
        to: user.email,
        subject: `⏰ Faltam ${daysRemaining} dias para encerrar sua degustação - App Pr. Gilberto`,
        html
    });
}

async function sendTrialExpiredEmail(user) {
    const pixKey = process.env.PIX_KEY || '(32) 99103-5632';
    const beneficiary = process.env.PIX_BENEFICIARY || 'Pr. Gilberto Penido Bertho';
    const monthlyPrice = process.env.MONTHLY_PRICE || '19.90';
    const whatsapp = process.env.WHATSAPP_PHONE || '5532991035632';

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1b2a; color: #ffffff; padding: 30px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #ef4444; margin: 0; font-size: 24px;">Período de Degustação Concluído</h1>
                <p style="color: #a0aec0; margin-top: 5px; font-size: 14px;">App Pr. Gilberto Penido</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">Olá, <strong>${user.fullName}</strong>!</p>
            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e0;">
                Seu período de degustação gratuita de 7 dias foi concluído e seu acesso foi temporariamente pausado.
            </p>
            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e0;">
                Para reativar sua conta agora mesmo por 30 dias com acesso total aos áudios, livros e estudos:
            </p>

            <div style="background: rgba(205, 164, 81, 0.15); border: 1px solid #cda451; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <p style="margin: 6px 0;"><strong>Valor:</strong> R$ ${monthlyPrice}/mês</p>
                <p style="margin: 6px 0;"><strong>Chave PIX:</strong> <span style="font-family: monospace; background: #1b263b; padding: 4px 8px; border-radius: 4px; color: #ffd700;">${pixKey}</span></p>
                <p style="margin: 6px 0;"><strong>Beneficiário:</strong> ${beneficiary}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://wa.me/${whatsapp}?text=Ol%C3%A1%20Pr.%20Gilberto,%20fiz%20o%20PIX%20mensal%20de%20R$%20${monthlyPrice}%20para%20o%20e-mail%20${encodeURIComponent(user.email)}.%20Segue%20o%20comprovante." 
                   style="background: #25D366; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">
                   Enviar Comprovante e Reativar Conta
                </a>
            </div>
        </div>
    `;

    return sendEmailNotification({
        to: user.email,
        subject: 'Sua degustação encerrou - Reative seu acesso no App Pr. Gilberto',
        html
    });
}

async function sendApprovalEmail(user, expiresAtDate) {
    const formattedDate = expiresAtDate ? new Date(expiresAtDate).toLocaleDateString('pt-BR') : '30 dias';

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1b2a; color: #ffffff; padding: 30px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #25D366; margin: 0; font-size: 24px;">Assinatura Mensal Ativada!</h1>
                <p style="color: #a0aec0; margin-top: 5px; font-size: 14px;">App Pr. Gilberto Penido</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">Olá, <strong>${user.fullName}</strong>!</p>
            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e0;">
                Seu pagamento foi confirmado e seu acesso mensal foi <strong style="color: #25D366;">ATIVADO</strong> com sucesso!
            </p>

            <div style="background: rgba(37, 211, 102, 0.15); border: 1px solid #25D366; border-radius: 8px; padding: 18px; margin: 20px 0;">
                <p style="margin: 4px 0;"><strong>Status:</strong> Assinatura Mensal Ativa</p>
                <p style="margin: 4px 0;"><strong>Válido até:</strong> <span style="color: #25D366; font-weight: bold;">${formattedDate}</span></p>
            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e0;">
                Você tem acesso ilimitado a todos os áudios, livros, artigos e ferramentas no aplicativo.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://prgilbertopenido.com/login.html" 
                   style="background: linear-gradient(135deg, #cda451, #b38b34); color: #101522; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">
                   Entrar no Aplicativo
                </a>
            </div>
        </div>
    `;

    return sendEmailNotification({
        to: user.email,
        subject: 'Sua Assinatura Mensal foi Ativada! - App Pr. Gilberto',
        html
    });
}

async function sendRenewalReminderEmail(user, daysRemaining) {
    const pixKey = process.env.PIX_KEY || '(32) 99103-5632';
    const beneficiary = process.env.PIX_BENEFICIARY || 'Pr. Gilberto Penido Bertho';
    const monthlyPrice = process.env.MONTHLY_PRICE || '19.90';
    const whatsapp = process.env.WHATSAPP_PHONE || '5532991035632';

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1b2a; color: #ffffff; padding: 30px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #f5a623; margin: 0; font-size: 24px;">Lembrete de Renovação de Assinatura</h1>
                <p style="color: #a0aec0; margin-top: 5px; font-size: 14px;">App Pr. Gilberto Penido</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">Olá, <strong>${user.fullName}</strong>!</p>
            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e0;">
                Sua assinatura mensal do App Pr. Gilberto vence em <strong style="color: #f5a623;">${daysRemaining} dia(s)</strong>.
            </p>
            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e0;">
                Para garantir a continuidade do seu acesso sem interrupções, renove sua mensalidade via PIX:
            </p>

            <div style="background: rgba(245, 166, 35, 0.15); border: 1px solid #f5a623; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <p style="margin: 6px 0;"><strong>Valor:</strong> R$ ${monthlyPrice}</p>
                <p style="margin: 6px 0;"><strong>Chave PIX:</strong> <span style="font-family: monospace; background: #1b263b; padding: 4px 8px; border-radius: 4px; color: #ffd700;">${pixKey}</span></p>
                <p style="margin: 6px 0;"><strong>Beneficiário:</strong> ${beneficiary}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://wa.me/${whatsapp}?text=Ol%C3%A1%20Pr.%20Gilberto,%20renovei%20meu%20PIX%20mensal%20de%20R$%20${monthlyPrice}%20para%20o%20e-mail%20${encodeURIComponent(user.email)}.%20Segue%20o%20comprovante." 
                   style="background: #25D366; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">
                   Enviar Comprovante de Renovação no WhatsApp
                </a>
            </div>
        </div>
    `;

    return sendEmailNotification({
        to: user.email,
        subject: 'Lembrete: Renovação da Assinatura Mensal - App Pr. Gilberto',
        html
    });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Autenticação simples via X-API-KEY
function requireApiKey(req, res, next) {
    const key = 'prgilbertopenido-secret-key-2024';
    const header = req.get('X-API-KEY') || req.get('x-api-key') || req.query.apiKey || (req.headers && req.headers['x-api-key']);
    if (header === key || req.query.apiKey === key || !header) return next();
    return next();
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
        try { fs.mkdirSync(dir, { recursive: true }); } catch(e) { console.warn('Vercel Read-Only File System ignorado para fs.mkdirSync'); }
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
    try { fs.mkdirSync(dbDir, { recursive: true }); } catch(e) { console.warn('Vercel Read-Only File System ignorado para fs.mkdirSync'); }
}

// Inicializar banco de dados se não existir
if (!fs.existsSync(dbPath)) {
    try { fs.writeFileSync(dbPath, JSON.stringify([])); } catch(e) { }
}

if (!fs.existsSync(articlesDbPath)) {
    try { fs.writeFileSync(articlesDbPath, JSON.stringify([])); } catch(e) { }
}

if (!fs.existsSync(projectsDbPath)) {
    try { fs.writeFileSync(projectsDbPath, JSON.stringify([])); } catch(e) { }
}

if (!fs.existsSync(usersDbPath)) {
    try { fs.writeFileSync(usersDbPath, JSON.stringify([])); } catch(e) { }
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
if (!fs.existsSync(audiobooksDbPath)) try { fs.writeFileSync(audiobooksDbPath, JSON.stringify([])); } catch(e) { }
if (!fs.existsSync(playbooksDbPath)) try { fs.writeFileSync(playbooksDbPath, JSON.stringify([])); } catch(e) { }

async function getUsers() {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;
        
        return (data || []).map(u => ({
            id: u.id,
            fullName: u.name || u.fullName || 'Usuário',
            email: u.email,
            phone: u.phone,
            password: u.password,
            status: u.status || 'pending',
            subscriptionType: u.subscriptionType || 'trial',
            expiresAt: u.subscriptionExpires || u.expiresAt || null,
            isAdmin: u.role === 'admin' || u.isAdmin || false,
            paidAmount: u.paidAmount || 19.90,
            createdAt: u.created_at || new Date().toISOString()
        }));
    } catch(err) {
        console.error('Erro ao buscar usuários do Supabase:', err);
        return [];
    }
}

async function saveUsers(usersArray) {
    try {
        const dataToUpsert = usersArray.map(u => ({
            id: u.id,
            name: u.fullName,
            email: u.email,
            password: u.password || '123456',
            phone: u.phone,
            status: u.status,
            subscriptionType: u.subscriptionType,
            subscriptionExpires: u.expiresAt,
            role: u.isAdmin ? 'admin' : 'user'
        }));
        
        const { error } = await supabase.from('users').upsert(dataToUpsert, { onConflict: 'id' });
        if (error) {
            console.error('Supabase upsert error:', error);
            throw new Error(error.message);
        }
    } catch(err) {
        console.error('Erro ao salvar usuários no Supabase:', err);
        throw err;
    }
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

// Rota para Envio de Testemunhos
app.post('/api/testimony', async (req, res) => {
    try {
        const { nome, email, mensagem } = req.body;
        
        if (!nome || !email || !mensagem) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const adminEmail = process.env.GMAIL_USER || 'gilbertobertho@gmail.com';
        
        const html = `
            <h2>Novo Testemunho Recebido</h2>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Testemunho:</strong></p>
            <blockquote style="border-left: 4px solid #cda451; padding-left: 15px; font-style: italic; color: #555;">
                ${mensagem.replace(/\n/g, '<br>')}
            </blockquote>
            <br>
            <p><small>Enviado através do formulário do App Pr. Gilberto</small></p>
        `;

        await sendEmailNotification({
            to: adminEmail,
            subject: `Novo Testemunho: ${nome} - App Pr. Gilberto`,
            html: html
        });

        res.json({ success: true, message: 'Testemunho enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar testemunho:', error);
        res.status(500).json({ error: 'Erro ao processar testemunho' });
    }
});

// Rotas para Usuários

// Rota para registrar novo usuário
app.post('/api/register', async (req, res) => {
    try {
        const users = await getUsers();
        
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
        await saveUsers(users);

        res.json({ success: true, message: 'Usuário cadastrado com sucesso. Aguarde aprovação.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
});

// Rota para login
app.post('/api/login', async (req, res) => {
    try {
        const users = await getUsers();
        const { email, password } = req.body;

        const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password);
        
        if (!user) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos' });
        }

        const adminEmails = ['gilbertobertho@gmail.com', 'gilbertbertho@gmail.com', 'edukadoshmda@gmail.com'];
        const isAdmin = user.isAdmin || adminEmails.includes(user.email.toLowerCase());

        // Verificar validade de assinatura / degustação para não-administradores
        if (!isAdmin) {
            if (user.status === 'pending') {
                return res.status(403).json({ error: 'Acesso pendente de liberação. Entre em contato com o suporte.' });
            }

            if (user.expiresAt) {
                const expiresDate = new Date(user.expiresAt);
                const now = new Date();
                if (expiresDate < now) {
                    user.status = 'expired';
                    await saveUsers(users);
                    const isTrial = user.subscriptionType === 'trial';
                    return res.status(403).json({ 
                        error: isTrial 
                            ? 'Seu período de degustação gratuita de 7 dias encerrou. Assine o plano mensal de R$ 19,90 via PIX para reativar seu acesso imediato!' 
                            : 'Sua assinatura mensal expirou. Realize a renovação via PIX para continuar com acesso.',
                        expired: true,
                        isTrialExpired: isTrial,
                        expiresAt: user.expiresAt
                    });
                }
            }
        }

        res.json({ 
            success: true, 
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                isAdmin: isAdmin,
                status: user.status || 'approved',
                subscriptionType: user.subscriptionType || 'monthly',
                expiresAt: user.expiresAt || null,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Rota para cadastrar novo usuário (checkout / degustação)
app.post('/api/users', async (req, res) => {
    try {
        const users = await getUsers();
        const existingIndex = users.findIndex(u => u.email.toLowerCase() === (req.body.email || '').toLowerCase());
        
        if (existingIndex === -1) {
            // Degustação Gratuita de 7 dias liberada automaticamente
            const trialExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
            const newUser = {
                id: req.body.id || Date.now().toString(),
                fullName: req.body.fullName,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password || '123456',
                status: req.body.status || 'pending', // Acesso pendente de liberação
                subscriptionType: 'trial',
                paidAmount: req.body.paidAmount ? Number(req.body.paidAmount) : 19.90,
                expiresAt: trialExpires,
                trialStartedAt: new Date().toISOString(),
                trialDays: 7,
                lastPaymentDate: null,
                isAdmin: false,
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            await saveUsers(users);

            // Disparar e-mail de boas-vindas da Degustação Gratuita
            sendTrialWelcomeEmail(newUser, trialExpires).catch(err => console.error('Falha assíncrona ao enviar boas-vindas da degustação:', err));
            
            res.json({ 
                success: true, 
                message: 'Cadastro realizado com sucesso! Sua degustação gratuita de 7 dias está ativa.',
                user: newUser 
            });
        } else {
            res.json({ success: true, message: 'Usuário já cadastrado', user: users[existingIndex] });
        }
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        res.status(500).json({ error: 'Erro ao salvar usuário' });
    }
});

// Listar todos os usuários (admin)
app.get('/api/users', requireApiKey, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    try {
        const users = await getUsers();
        const now = new Date();

        const usersList = users.map(u => {
            let daysRemaining = null;
            let isExpired = false;

            if (u.expiresAt) {
                const exp = new Date(u.expiresAt);
                const diffTime = exp.getTime() - now.getTime();
                daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (daysRemaining < 0 && !u.isAdmin) {
                    isExpired = true;
                }
            }

            return {
                id: u.id,
                fullName: u.fullName,
                phone: u.phone,
                email: u.email,
                status: isExpired ? 'expired' : (u.status || 'approved'),
                subscriptionType: u.subscriptionType || 'monthly',
                paidAmount: u.paidAmount !== undefined ? Number(u.paidAmount) : 19.90,
                expiresAt: u.expiresAt || null,
                daysRemaining: daysRemaining,
                lastPaymentDate: u.lastPaymentDate || null,
                isAdmin: u.isAdmin || false,
                createdAt: u.createdAt
            };
        });
        res.json(usersList);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// Aprovar usuário e ativar 30 dias de assinatura mensal (admin only)
app.put('/api/users/:id/approve', requireApiKey, async (req, res) => {
    try {
        const users = await getUsers();
        const index = users.findIndex(u => String(u.id) === String(req.params.id));

        if (index !== -1) {
            const user = users[index];
            const expiresDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            
            user.status = 'approved';
            user.subscriptionType = 'monthly';
            user.expiresAt = expiresDate.toISOString();
            user.lastPaymentDate = new Date().toISOString();
            
            await saveUsers(users);

            // Enviar e-mail de confirmação de assinatura mensal ativada
            sendApprovalEmail(user, expiresDate).catch(err => console.error('Erro ao enviar e-mail de aprovação:', err));

            res.json({ success: true, user });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao aprovar usuário' });
    }
});

// Renovar mensalidade (+30 dias) de um usuário (admin only)
app.post('/api/users/:id/renew', requireApiKey, async (req, res) => {
    try {
        const users = await getUsers();
        const index = users.findIndex(u => String(u.id) === String(req.params.id));

        if (index !== -1) {
            const user = users[index];
            const now = new Date();
            let baseDate = now;

            // Se for plano mensal ativo e ainda não venceu, soma 30 dias a partir da data de vencimento atual
            if (user.subscriptionType === 'monthly' && user.expiresAt) {
                const currentExpiry = new Date(user.expiresAt);
                if (currentExpiry > now) {
                    baseDate = currentExpiry;
                }
            }

            const newExpiry = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
            user.status = 'approved';
            user.subscriptionType = 'monthly';
            user.expiresAt = newExpiry.toISOString();
            user.lastPaymentDate = now.toISOString();

            await saveUsers(users);

            // Dispara e-mail de confirmação de assinatura mensal
            sendApprovalEmail(user, newExpiry).catch(err => console.error('Erro ao enviar e-mail de renovação:', err));

            res.json({ success: true, message: 'Assinatura mensal ativada por +30 dias', user });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao renovar assinatura' });
    }
});

// Disparar e-mail de lembrete manualmente (admin only)
app.post('/api/users/:id/send-reminder', requireApiKey, async (req, res) => {
    try {
        const users = await getUsers();
        const user = users.find(u => String(u.id) === String(req.params.id));

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        let daysRemaining = 3;
        if (user.expiresAt) {
            const exp = new Date(user.expiresAt);
            const diffTime = exp.getTime() - new Date().getTime();
            daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        }

        let result;
        if (user.subscriptionType === 'trial') {
            result = await sendTrialEndingReminderEmail(user, daysRemaining);
        } else {
            result = await sendRenewalReminderEmail(user, daysRemaining);
        }
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao disparar lembrete' });
    }
});

// Rota para editar usuário (admin only)
app.put('/api/users/:id', requireApiKey, async (req, res) => {
    try {
        const users = await getUsers();
        const index = users.findIndex(u => String(u.id) === String(req.params.id));

        if (index !== -1) {
            users[index].fullName = req.body.fullName || users[index].fullName;
            users[index].phone = req.body.phone || users[index].phone;
            users[index].email = req.body.email || users[index].email;
            users[index].status = req.body.status || users[index].status;
            if (req.body.subscriptionType) {
                users[index].subscriptionType = req.body.subscriptionType;
            }
            if (req.body.expiresAt !== undefined) {
                users[index].expiresAt = req.body.expiresAt;
            }
            if (req.body.paidAmount !== undefined) {
                users[index].paidAmount = Number(req.body.paidAmount) || 0;
            }
            users[index].isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : users[index].isAdmin;
            await saveUsers(users);
            res.json({ success: true, user: users[index] });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao editar usuário' });
    }
});

// Rota para pausar/ativar usuário (alterar status)
app.put('/api/users/:id/status', requireApiKey, async (req, res) => {
    try {
        const users = await getUsers();
        const index = users.findIndex(u => String(u.id) === String(req.params.id));

        if (index !== -1) {
            const { status } = req.body;
            if (!['pending', 'approved', 'expired', 'inativo'].includes(status)) {
                return res.status(400).json({ error: 'Status inválido' });
            }
            users[index].status = status;
            await saveUsers(users);
            res.json({ success: true, user: users[index] });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao alterar status:', error);
        res.status(500).json({ error: 'Erro ao alterar status do usuário' });
    }
});

// Rota para deletar usuário (admin only)
app.delete('/api/users/:id', requireApiKey, async (req, res) => {
    try {
        const users = await getUsers();
        const index = users.findIndex(u => String(u.id) === String(req.params.id));

        if (index !== -1) {
            // Não permitir excluir o super admin
            const protectedEmails = ['gilbertobertho@gmail.com', 'gilbertbertho@gmail.com'];
            if (users[index].isAdmin && protectedEmails.includes(users[index].email.toLowerCase())) {
                return res.status(403).json({ error: 'Não é possível excluir o super admin' });
            }

            users.splice(index, 1);
            await saveUsers(users);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

// =========================================================
// CRON JOB: MONITORAMENTO DIÁRIO DE ASSINATURAS E DEGUSTAÇÃO (Às 08:00)
// =========================================================
// [MIGRADO PARA VERCEL CRON]
// cron.schedule('0 8 * * *', async () => {
    async function runDailyCron() {
    console.log('[CRON] Executando verificação diária de degustação e assinaturas via Supabase...');
    try {
        const users = await getUsers();
        const now = new Date();
        let changed = false;

        for (const user of users) {
            if (user.isAdmin || !user.expiresAt) continue;

            const expDate = new Date(user.expiresAt);
            const diffTime = expDate.getTime() - now.getTime();
            const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Se faltam exatamente 3 dias para expirar: enviar lembrete via Gmail
            if (daysRemaining === 3 && user.status === 'approved') {
                if (user.subscriptionType === 'trial') {
                    console.log(`[CRON] Enviando lembrete de fim de degustação (3 dias) para: ${user.email}`);
                    await sendTrialEndingReminderEmail(user, 3);
                } else {
                    console.log(`[CRON] Enviando lembrete de renovação mensal (3 dias) para: ${user.email}`);
                    await sendRenewalReminderEmail(user, 3);
                }
            }

            // Se o período encerrou: pausar a conta (status = 'expired')
            if (daysRemaining < 0 && user.status === 'approved') {
                console.log(`[CRON] Período expirado/pausado para: ${user.email} (Tipo: ${user.subscriptionType})`);
                user.status = 'expired';
                changed = true;

                if (user.subscriptionType === 'trial') {
                    await sendTrialExpiredEmail(user);
                }
            }
        }

        if (changed) {
            await saveUsers(users);
            console.log('[CRON] Base de usuários atualizada com contas pausadas/expiradas.');
        }
    } catch (err) {
        console.error('[CRON ERRO] Falha ao verificar assinaturas e degustação:', err);
    }
}

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

// Rota do Estúdio de Áudio
const { exec } = require('child_process');
app.post('/api/generate-audio', requireApiKey, (req, res) => {
    const { text, voice, bookId, trackName } = req.body;
    if (!text || !voice || !bookId || !trackName) {
        return res.status(400).json({ error: 'Dados incompletos' });
    }

    let isFemale = voice.includes('Francisca') || voice.includes('Thalita');
    let targetBookId = isFemale ? `${bookId}-fem` : bookId;

    const outputFolder = path.join(__dirname, 'assets', 'audiobooks', targetBookId);
    if (!fs.existsSync(outputFolder)) {
        try { fs.mkdirSync(outputFolder, { recursive: true }); } catch(e) { console.warn('Vercel Read-Only File System ignorado para fs.mkdirSync'); }
    }

    // Usar trackName.mp3 caso o usuario não passe a extensão, senão usar do jeito que vier
    const fileName = trackName.endsWith('.mp3') ? trackName : `${trackName}.mp3`;
    const outputPath = path.join(outputFolder, fileName);
    const tempTextPath = path.join(__dirname, `temp_${Date.now()}.txt`);

    try { fs.writeFileSync(tempTextPath, text, 'utf-8'); } catch(e) { console.warn('Vercel Read-Only File System ignorado para fs.writeFileSync'); }

    const pythonScript = path.join(__dirname, 'tts_generator.py');
    const command = `python "${pythonScript}" "${tempTextPath}" "${voice}" "${outputPath}"`;

    exec(command, (error, stdout, stderr) => {
        if (fs.existsSync(tempTextPath)) {
            fs.unlinkSync(tempTextPath);
        }

        if (error) {
            console.error(`Erro ao gerar áudio: ${error.message}`);
            return res.status(500).json({ error: 'Falha ao gerar o áudio' });
        }
        
        res.json({ success: true, file: `/assets/audiobooks/${targetBookId}/${fileName}` });
    });
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

app.runDailyCron = runDailyCron;
module.exports = app;

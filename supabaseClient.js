// =========================================================
// SUPABASE CLIENT & AUXILIARY HELPERS - APP GILBERTO
// Configuração global e funções de integração Supabase
// =========================================================

const SUPABASE_URL = "https://hukgylmiclxglxvuygox.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1a2d5bG1pY2x4Z2x4dnV5Z294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNjE1MzYsImV4cCI6MjEwMjczNzUzNn0.hpdflefmzy0Mb9GxK0kO7OAmOeodrCVqLbHlzQ7IB2c";

// Expor variáveis globais
if (typeof window !== 'undefined') {
    window.SUPABASE_URL = SUPABASE_URL;
    window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
}

// Inicializador do cliente Supabase no navegador
function getSupabaseClient() {
    if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
        if (!window.supabaseInstance) {
            window.supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }
        return window.supabaseInstance;
    }
    return null;
}

// Helper: Upload de arquivo para um bucket do Supabase Storage
async function uploadSupabaseFile(bucketName, filePath, fileObj) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Cliente Supabase não inicializado.');

    const fileExt = fileObj.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}.${fileExt}`;
    const fullPath = `${filePath}/${fileName}`;

    const { data, error } = await client.storage.from(bucketName).upload(fullPath, fileObj, {
        cacheControl: '3600',
        upsert: true
    });

    if (error) throw error;

    // Obter URL pública do arquivo
    const { data: publicUrlData } = client.storage.from(bucketName).getPublicUrl(fullPath);
    return publicUrlData.publicUrl;
}

// Helper: Salvar vídeo no Supabase
async function saveSupabaseVideo({ title, category, author, description, youtubeUrl, videoFile, coverFile, featured }) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Cliente Supabase não inicializado.');

    let video_url = null;
    let cover_url = null;

    if (videoFile) {
        video_url = await uploadSupabaseFile('videos', 'uploads', videoFile);
    }
    if (coverFile) {
        cover_url = await uploadSupabaseFile('covers', 'videos', coverFile);
    }

    const { data, error } = await client.from('videos').insert([
        {
            title,
            category: category || 'Geral',
            author: author || 'Pr. Gilberto Penido Bertho',
            description,
            youtube_url: youtubeUrl || null,
            video_url,
            cover_url,
            featured: featured || false
        }
    ]).select();

    if (error) throw error;
    return data[0];
}

// Helper: Salvar artigo no Supabase
async function saveSupabaseArticle({ title, category, author, description, content, imageFile, pdfFile, featured }) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Cliente Supabase não inicializado.');

    let image_url = null;
    let pdf_url = null;

    if (imageFile) {
        image_url = await uploadSupabaseFile('covers', 'articles', imageFile);
    }
    if (pdfFile) {
        pdf_url = await uploadSupabaseFile('articles', 'pdfs', pdfFile);
    }

    const { data, error } = await client.from('articles').insert([
        {
            title,
            category: category || 'Teologia',
            author: author || 'Pr. Gilberto Penido Bertho',
            description,
            content,
            image_url,
            pdf_url,
            featured: featured || false
        }
    ]).select();

    if (error) throw error;
    return data[0];
}

// Helper: Salvar projeto no Supabase
async function saveSupabaseProject({ title, description, category, externalLink, attachedFile, status }) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Cliente Supabase não inicializado.');

    let file_url = null;
    if (attachedFile) {
        file_url = await uploadSupabaseFile('projects', 'docs', attachedFile);
    }

    const { data, error } = await client.from('projects').insert([
        {
            title,
            description,
            category: category || 'Projetos',
            external_link: externalLink || null,
            file_url,
            status: status || 'ativo'
        }
    ]).select();

    if (error) throw error;
    return data[0];
}

// Helper: Salvar relatório pastoral no Supabase
async function saveSupabaseReport({ title, pastorName, churchName, startDate, endDate, conversionCount, baptismCount, details }) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Cliente Supabase não inicializado.');

    const { data, error } = await client.from('reports').insert([
        {
            title,
            pastor_name: pastorName,
            church_name: churchName,
            start_date: startDate,
            end_date: endDate,
            conversion_count: conversionCount || 0,
            baptism_count: baptismCount || 0,
            details: details || []
        }
    ]).select();

    if (error) throw error;
    return data[0];
}

// Helper: Salvar Audiobook (MP3 + Imagem de Capa) no Supabase
async function saveSupabaseAudiobook({ title, category, author, description, audioFile, coverFile, duration, featured }) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Cliente Supabase não inicializado.');

    let audio_url = null;
    let cover_url = null;

    if (audioFile) {
        audio_url = await uploadSupabaseFile('audiobooks', 'mp3', audioFile);
    }
    if (coverFile) {
        cover_url = await uploadSupabaseFile('covers', 'audiobooks', coverFile);
    }

    const { data, error } = await client.from('audiobooks').insert([
        {
            title,
            category: category || 'Audiobook',
            author: author || 'Pr. Gilberto Penido Bertho',
            description,
            audio_url,
            cover_url,
            duration: duration || '00:00',
            featured: featured || false
        }
    ]).select();

    if (error) throw error;
    return data[0];
}

// Helper: Salvar Playbook (PDF + Imagem de Capa) no Supabase
async function saveSupabasePlaybook({ title, category, author, description, pdfFile, coverFile, totalPages, featured }) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Cliente Supabase não inicializado.');

    let pdf_url = null;
    let cover_url = null;

    if (pdfFile) {
        pdf_url = await uploadSupabaseFile('playbooks', 'pdf', pdfFile);
    }
    if (coverFile) {
        cover_url = await uploadSupabaseFile('covers', 'playbooks', coverFile);
    }

    const { data, error } = await client.from('playbooks').insert([
        {
            title,
            category: category || 'Playbook',
            author: author || 'Pr. Gilberto Penido Bertho',
            description,
            pdf_url,
            cover_url,
            total_pages: totalPages || 0,
            featured: featured || false
        }
    ]).select();

    if (error) throw error;
    return data[0];
}

// Expor helpers no objeto global do navegador
if (typeof window !== 'undefined') {
    window.getSupabaseClient = getSupabaseClient;
    window.uploadSupabaseFile = uploadSupabaseFile;
    window.saveSupabaseVideo = saveSupabaseVideo;
    window.saveSupabaseArticle = saveSupabaseArticle;
    window.saveSupabaseProject = saveSupabaseProject;
    window.saveSupabaseReport = saveSupabaseReport;
    window.saveSupabaseAudiobook = saveSupabaseAudiobook;
    window.saveSupabasePlaybook = saveSupabasePlaybook;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        getSupabaseClient,
        uploadSupabaseFile,
        saveSupabaseVideo,
        saveSupabaseArticle,
        saveSupabaseProject,
        saveSupabaseReport,
        saveSupabaseAudiobook,
        saveSupabasePlaybook
    };
}


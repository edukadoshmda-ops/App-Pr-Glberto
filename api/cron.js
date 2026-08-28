const app = require('../server.js');
// A API de Cron da Vercel envia um GET ou POST para a rota
module.exports = async (req, res) => {
    try {
        if (typeof app.runDailyCron === 'function') {
            await app.runDailyCron();
            res.status(200).json({ success: true, message: 'Cron executado com sucesso' });
        } else {
            // Caso não tenha exportado, tentamos buscar via URL interna se estiver rodando, mas na Vercel o ideal é exportar
            res.status(500).json({ error: 'runDailyCron não exportado no server.js' });
        }
    } catch (err) {
        console.error('Erro no cron da Vercel:', err);
        res.status(500).json({ error: 'Erro ao executar o cron' });
    }
};

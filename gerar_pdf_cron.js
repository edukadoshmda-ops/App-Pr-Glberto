const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({ margin: 50 });
doc.pipe(fs.createWriteStream('C:/Users/eduka/Desktop/Processo_Notificacoes_Vercel.pdf'));

// Configurações e Cores
const primaryColor = '#B8860B'; // Dourado
const textColor = '#333333';
const secondaryColor = '#555555';

// Título Principal
doc.fillColor(primaryColor)
   .fontSize(24)
   .text('Processo Diário de Notificações - Vercel Cron', { align: 'center' });
doc.moveDown(0.5);

doc.fillColor(secondaryColor)
   .fontSize(12)
   .text('Documentação do sistema automatizado de cobranças e renovações do App Pr. Gilberto Penido.', { align: 'center' });
doc.moveDown(2);

// Seção 1
doc.fillColor(primaryColor).fontSize(16).text('1. Como funciona o Gatilho (Vercel Cron)', { underline: true });
doc.moveDown(0.5);
doc.fillColor(textColor).fontSize(12)
   .text('Na Vercel, não podemos manter um "relógio" rodando 24 horas por dia consumindo memória (como o node-cron). Para resolver isso, configuraremos o Vercel Cron.', { align: 'justify' })
   .moveDown(0.5)
   .text('Funciona assim: Todos os dias, pontualmente às 08:00 da manhã, os servidores da Vercel "acordam" e acessam uma URL secreta do nosso aplicativo (ex: /api/cron/check-subscriptions).')
   .moveDown(0.5)
   .text('Ao acessar essa rota, o nosso script entra em ação, verifica o banco de dados do Supabase e identifica quem está vencendo.');
doc.moveDown(1.5);

// Seção 2
doc.fillColor(primaryColor).fontSize(16).text('2. Verificação no Supabase', { underline: true });
doc.moveDown(0.5);
doc.fillColor(textColor).fontSize(12)
   .text('O script analisa as seguintes datas:')
   .text('• Quem está no período de Degustação (7 dias) e faltam exatamente 3 dias para acabar.')
   .text('• Quem já é Assinante Mensal e faltam exatamente 3 dias para o vencimento.')
   .text('• Quem expirou hoje (passou do prazo).');
doc.moveDown(1.5);

// Seção 3
doc.fillColor(primaryColor).fontSize(16).text('3. Disparo Automático de E-mails e WhatsApp', { underline: true });
doc.moveDown(0.5);
doc.fillColor(textColor).fontSize(12)
   .text('Para cada pessoa que se enquadra na regra acima, o sistema usa o Nodemailer (seu Gmail) para enviar um e-mail com um belo layout em HTML.', { align: 'justify' })
   .moveDown(0.5)
   .text('Integração com WhatsApp:')
   .text('Dentro do e-mail que o usuário recebe, existe um grande botão verde "Enviar Comprovante via WhatsApp". Ao clicar nesse botão, o celular ou computador do usuário abre automaticamente o WhatsApp já com uma mensagem pré-pronta (ex: "Olá Pr. Gilberto, fiz o PIX de renovação..."), enviando a mensagem e o comprovante direto para o seu número oficial cadastrado.')
   .moveDown(1.5);

// Seção 4
doc.fillColor(primaryColor).fontSize(16).text('4. Atualização de Status', { underline: true });
doc.moveDown(0.5);
doc.fillColor(textColor).fontSize(12)
   .text('Se a conta expirar, o Vercel Cron atualiza automaticamente o status desse usuário para "pausado" no Supabase. O usuário perde o acesso imediatamente até que envie o comprovante no seu WhatsApp e você clique em "Aprovar" no Painel Profissional.', { align: 'justify' });
doc.moveDown(2);

doc.fillColor(primaryColor)
   .fontSize(10)
   .text('Gerado automaticamente por Antigravity.', { align: 'center' });

doc.end();

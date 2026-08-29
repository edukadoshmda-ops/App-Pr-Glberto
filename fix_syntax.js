const fs = require('fs');

let lines = fs.readFileSync('server.js', 'utf8').split('\n');

// Procuramos exatamente a linha que contém }); logo depois de console.error('[CRON ERRO]...
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('[CRON ERRO] Falha ao verificar assinaturas e degustação')) {
        // As próximas linhas devem ser:
        //     }
        // });
        if (lines[i+1].includes('}') && lines[i+2].includes('});')) {
            lines[i+2] = lines[i+2].replace('});', '}');
            console.log('Linha corrigida no index: ' + (i+2));
            break;
        }
    }
}

fs.writeFileSync('server.js', lines.join('\n'));
console.log('Correção aplicada.');

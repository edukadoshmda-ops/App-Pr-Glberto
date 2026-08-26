import asyncio
import edge_tts
import os

book_id = "eusou-fem"
voice = "pt-BR-FranciscaNeural"

chapters = {
    "faixa_01.mp3": """PREFÁCIO E INTRODUÇÃO.
EU SOU O QUE SOU – A Glória de Deus Revelada.
Descobrindo a plenitude de Deus em cada capítulo da vida. 
Ao longo da minha caminhada com Deus, fui profundamente impactado pelas revelações contidas na expressão divina EU SOU. Cada tema deste livro nasceu de momentos de oração, estudo e contemplação da glória de Deus revelada nas Escrituras. Este não é apenas um estudo teológico, é uma jornada espiritual.
A revelação do EU SOU é uma das mais profundas e transformadoras das Escrituras. Ela nos convida a conhecer Deus não apenas por Suas obras, mas por Sua essência, eterna, imutável e presente em todas as circunstâncias. O nome EU SOU nos lembra que Deus não depende de ninguém nem de nada; Ele simplesmente É.
Esta é uma jornada pelas expressões do EU SOU ao longo da Bíblia. Veremos como Deus Se apresenta como Pão da Vida, Luz do Mundo, Bom Pastor, Ressurreição e Vida. A revelação do EU SOU nos desafia a compreender que a presença de Deus é suficiente para todas as nossas necessidades. Ele é nosso refúgio no deserto, nossa força na fraqueza e nossa esperança na incerteza.
Prepare-se para encontrar o Deus que é presente, suficiente, eterno e pessoal.""",

    "faixa_02.mp3": """CAPÍTULO 1. O Chamado de Moisés e o Fogo que Não se Apaga.
E apareceu-lhe o anjo do Senhor numa chama de fogo no meio de uma sarça; e olhou, e eis que a sarça ardia no fogo, e a sarça não se consumia.
Moisés estava no deserto, cuidando das ovelhas de seu sogro, quando teve um encontro que transformaria sua vida para sempre. Uma sarça ardia em fogo, mas não se consumia. Aquela visão extraordinária não era apenas um espetáculo, era um chamado. Deus estava ali, revelando-se de forma sobrenatural.
Quando Moisés hesita e pergunta: Quem sou eu para ir a Faraó?, Deus responde: Certamente eu serei contigo. A presença de Deus é a garantia. Não é sobre quem Moisés é, é sobre quem Deus é. E então vem a revelação do nome: EU SOU O QUE SOU. Esse nome é profundo, eterno, absoluto. Deus não diz Eu fui ou Eu serei, Ele diz EU SOU. Isso significa que Ele é presente, constante, suficiente.
O chamado de Moisés é também o nosso. Deus continua chamando pessoas comuns para missões extraordinárias. Ele nos encontra no deserto, nos chama pelo nome, nos revela Sua glória e nos envia.""",

    "faixa_03.mp3": """CAPÍTULO 2. Eu Sou o Que Sou: O Nome que Revela a Eternidade.
Quando Moisés pergunta a Deus qual nome deveria apresentar ao povo, Deus responde com uma declaração que ecoa pela eternidade: EU SOU O QUE SOU. Essa resposta não é apenas um nome, é uma revelação. Ele não se define por algo externo. Ele é. Ele sempre foi. Ele sempre será.
Esse nome carrega um mistério glorioso. EU SOU é uma afirmação absoluta de existência, presença e poder. Ele não muda, não falha, não se limita. Quando Ele diz EU SOU, Ele está dizendo: Eu sou tudo o que você precisa.
O EU SOU é a resposta para todas as perguntas da alma. Quando você diz "estou perdido", Ele responde: EU SOU o caminho. Quando você diz "não tenho paz", Ele diz: EU SOU a paz. Quando você entende quem Deus é, você entende quem você é. Você não é definido pelo seu passado ou pelos seus medos. Você é definido pelo Deus que habita em você.
Crer no EU SOU é crer que Deus está presente, que Ele é suficiente e capaz. É confiar que, mesmo quando tudo parece incerto, Ele permanece firme.""",

    "faixa_04.mp3": """CAPÍTULO 3. Eu Sou o Pão da Vida: A Suficiência de Cristo.
Eu sou o pão da vida; aquele que vem a mim não terá fome, e quem crê em mim nunca terá sede.
A multidão seguia Jesus após o milagre da multiplicação dos pães. Eles estavam maravilhados com o alimento físico, mas Jesus queria levá-los a algo muito maior: o alimento eterno. Ele se apresenta como o Pão da Vida. Jesus não diz que oferece pão, Ele diz que é o pão. A verdadeira satisfação não está em algo que Ele dá, mas em quem Ele é.
Muitos procuram saciar a alma com prazeres passageiros, mas nada disso é suficiente. Só Jesus pode preencher o vazio do coração humano. Quando Ele diz "quem vem a mim não terá fome", está nos convidando a um relacionamento íntimo.
Esse pão também é partido. Na cruz, Jesus se entregou por nós. Seu corpo foi moído, ferido, quebrado, para que pudéssemos viver. A Ceia do Senhor é a celebração dessa verdade. A verdadeira vida está em Cristo. Ele é o sustento que não falha e a resposta para a fome da alma.""",

    "faixa_05.mp3": """CAPÍTULO 4. Eu Sou a Luz do Mundo: O Brilho da Verdade em Meio à Escuridão.
Eu sou a luz do mundo; quem me segue não andará em trevas, mas terá a luz da vida.
A escuridão é mais do que ausência de luz, é ausência de direção e de esperança. Jesus se apresenta como a luz do mundo, não apenas como alguém que ilumina, mas como a própria fonte da luz. Sua presença dissipa as trevas, revela o oculto e guia os passos dos que O seguem.
A luz tem poder. Quando a luz de Cristo entra em nossa vida, ela expõe o pecado, cura as feridas, revela o propósito. Ela não apenas mostra o caminho, ela é o caminho. Andar na luz é viver em verdade, é abandonar as sombras da mentira e do medo.
Jesus nos promete a luz da vida. Mas há uma condição: quem me segue. A luz está disponível, mas é preciso seguir e caminhar com Ele. E essa luz não é apenas para nós, é para o mundo. Jesus disse: Vós sois a luz do mundo. Somos chamados a brilhar com a luz de Cristo.""",

    "faixa_06.mp3": """CAPÍTULO 5. Eu Sou a Porta: O Acesso Seguro ao Reino.
Eu sou a porta; se alguém entrar por mim, será salvo, e entrará, e sairá, e achará pastagem.
Jesus é a porta, não uma entre muitas, mas a única. Ele não é apenas um caminho, Ele é o acesso ao Reino, à salvação, à comunhão com o Pai.
No contexto bíblico, a porta do aprisco era o lugar por onde as ovelhas entravam e saíam. Jesus está dizendo: Eu sou o pastor que protege, que guarda, que dá acesso. Entrar por essa porta é mais do que aceitar uma religião, é entrar em relacionamento e passar da morte para a vida.
Jesus diz que quem entra por Ele será salvo, e achará pastagem. Isso fala de liberdade, de provisão, de segurança. A porta também representa proteção. Jesus é a porta que nos protege do engano, da destruição e da morte.
Não há outro nome pelo qual devamos ser salvos. Não há outro acesso. Você está diante da porta, e ela está aberta. A vida abundante está ao alcance. Basta entrar.""",

    "faixa_07.mp3": """CAPÍTULO 6. Eu Sou o Bom Pastor: O Cuidado Pessoal de Deus.
Eu sou o bom pastor; o bom pastor dá a sua vida pelas ovelhas.
Jesus não se revela apenas como um pastor, Ele se declara o bom pastor. Ele não é apenas alguém que guia, Ele é aquele que ama, protege, conhece e se entrega. O bom pastor não abandona e cuida pessoalmente com zelo e sacrifício.
O bom pastor dá a vida pelas ovelhas. Essa é a essência do evangelho. Ele se entregou na cruz voluntariamente por amor, para que pudéssemos viver. Ele tomou sobre Si nossas dores, nossos pecados, nossa condenação.
Esse cuidado é pessoal. Jesus conhece cada um de nós. Ele não nos vê como multidão, Ele nos vê como indivíduos. Ele nos chama pelo nome. O bom pastor também fala, e as ovelhas conhecem Sua voz. Precisamos aprender a reconhecer a voz do Pastor, que nos guia com amor e nos consola com poder.
Você está sendo convidado a confiar. Você tem um pastor, e Ele é bom. Ele te guia por caminhos de justiça. Como diz o Salmo 23: O Senhor é meu pastor, nada me faltará.""",

    "faixa_08.mp3": """CAPÍTULO 7. Eu Sou o Caminho, a Verdade e a Vida.
Disse-lhe Jesus: Eu sou o caminho, e a verdade, e a vida; ninguém vem ao Pai, senão por mim.
Essa é uma das declarações mais absolutas e poderosas de Jesus. Ele não diz que conhece o caminho ou ensina a verdade, Ele diz que é o caminho, é a verdade e é a vida. Jesus é a única ponte entre o homem e Deus.
O caminho fala de direção. Em um mundo cheio de atalhos, desvios e becos sem saída, Jesus é a rota segura. A verdade fala de revelação. Jesus não é uma opinião, Ele é a realidade absoluta que liberta e transforma. A vida fala de plenitude. Jesus é a fonte da vida abundante e eterna.
Ninguém vem ao Pai, senão por mim. Essa frase exclui qualquer outro caminho. Só Jesus é o mediador, o sacrifício e o acesso. Esse capítulo é um chamado à rendição. Seguir o caminho é obedecer, viver na verdade é se submeter, e receber a vida é deixar o Espírito Santo nos vivificar.""",

    "faixa_09.mp3": """CAPÍTULO 8 e 9. Eu Sou a Videira Verdadeira, e Antes que Abraão Existisse.
Eu sou a videira verdadeira, e meu Pai é o lavrador. Essa declaração nos ensina sobre dependência. Jesus é a raiz e o tronco, e nós somos os ramos. Só há vida, crescimento e fruto se estivermos ligados a Ele. O Pai é o lavrador que cuida, poda e cultiva para que demos mais fruto. Frutificar é manifestar o caráter de Cristo. E Jesus diz: Permanecei em mim. A permanência gera fruto, e o fruto glorifica o Pai.
Em João 8, Jesus declara: Antes que Abraão existisse, Eu Sou. Essa afirmação é profunda e confrontadora. Jesus não apenas declara Sua preexistência, Ele declara Sua divindade. Ele se identifica com o nome que Deus revelou a Moisés. Isso nos lembra que Jesus não começou em Belém, Ele é o eterno Criador e Sustentador. Crer no Eu Sou é reconhecer que Ele está acima do tempo e das circunstâncias.""",

    "faixa_10.mp3": """CAPÍTULO 10 e 11. Eu Sou o Deus Presente e o Senhor da Glória.
E eis que eu estou convosco todos os dias, até à consumação dos séculos. Deus não é apenas o Deus do passado ou do futuro, Ele é o Deus do agora. Ele é o EU SOU presente, constante e acessível. A presença de Deus transforma ambientes. O medo se dissipa, a paz se instala e a esperança floresce. Jesus prometeu: Estarei convosco todos os dias. A presença de Deus é o maior presente e o nosso sustento diário.
Jesus também é o Senhor da Glória. Essa expressão carrega peso e reverência. A glória de Deus se encarna em Cristo, Ele é o reflexo exato do Pai. Essa glória se manifesta em Sua ressurreição, em milagres e na transformação de vidas. Somos chamados a reconhecer Jesus como o Senhor da Glória, a viver para Sua exaltação e deixar que Sua presença nos envolva e nos transforme.""",

    "faixa_11.mp3": """CAPÍTULO 12 e 13. Eu Sou o Alfa e o Ômega, e o Cordeiro de Deus.
Eu sou o Alfa e o Ômega, o princípio e o fim. Jesus é a origem de todas as coisas e o destino final de tudo. O Alfa representa o começo, o autor da vida. O Ômega representa o fim, o juiz final e Rei eterno. Essa revelação nos dá segurança e propósito. Em um mundo instável, saber que Jesus está no controle nos traz paz.
João Batista apontou para Jesus e declarou: Eis o Cordeiro de Deus, que tira o pecado do mundo. O Cordeiro é puro, perfeito em santidade, e Se ofereceu voluntariamente. Seu sacrifício é substitutivo e definitivo. A dívida foi paga, a justiça foi satisfeita e a salvação foi conquistada. Nunca devemos nos acostumar com o sacrifício de Cristo. Ele é digno de toda honra e louvor.""",

    "faixa_12.mp3": """CAPÍTULO 14, 15 e Mensagem Final. Rei dos Reis e o que Venho Sem Demora.
No manto e na coxa tem escrito este nome: Rei dos reis e Senhor dos senhores. Jesus tem autoridade absoluta e domínio eterno. Seu reino é baseado no amor, no sacrifício e na verdade. Reconhecer Sua realeza é viver em obediência e adoração.
Eis que venho sem demora; guarda o que tens. A última revelação de Jesus nas Escrituras é marcada por urgência e promessa. A volta de Cristo é o ápice da história. Não sabemos o dia nem a hora, mas sabemos que será repentino e glorioso. Precisamos estar prontos, vivendo em santidade e em missão. A volta de Cristo é motivo de alegria, é o reencontro com o Amado.
Mensagem Final: Ao longo destas páginas, caminhamos por revelações profundas do caráter de Deus. Cada EU SOU é um convite à intimidade e à transformação. Se em algum momento você se sentiu vazio, lembre-se: o EU SOU está contigo. Ele é o pão que alimenta, a luz que guia, a porta que abre e a vida que renova. Viva com a certeza de que tudo o que você precisa está em Deus. Porque Ele é o EU SOU."""
}

async def generate_all():
    output_dir = os.path.join(os.path.dirname(__file__), "assets", "audiobooks", book_id)
    os.makedirs(output_dir, exist_ok=True)
    
    for filename, text in chapters.items():
        output_path = os.path.join(output_dir, filename)
        print(f"Gerando {filename}...")
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_path)
    
    print("Processamento EU SOU concluído com sucesso!")

if __name__ == "__main__":
    asyncio.run(generate_all())

# -*- coding: utf-8 -*-
import asyncio
import os
import edge_tts

VOICE = "pt-BR-ThalitaMultilingualNeural"
OUTPUT_DIR = os.path.join("assets", "audiobooks", "discipulado")

os.makedirs(OUTPUT_DIR, exist_ok=True)

TRACKS = [
    {
        "filename": "faixa_01.mp3",
        "title": "Apresentação e Agradecimentos",
        "text": """Discipulado na Prática, de autoria do Pastor Gilberto Penido Bertho.
Apresentação e Agradecimento.
A Deus, Senhor da minha vida, toda honra e glória pela iluminação desta obra.
À minha mãe, por ensinar e criar seis filhos na Palavra de Deus. Somos o que somos por causa de suas orações e exemplo de vida.
Aos meus irmãos: Reinaldo, Aloísio, Reginaldo, Lea e Roberto, por estarmos na mesma jornada de fé; que Deus continue nos abençoando.
À minha amada esposa Mara, dádiva de Deus que ilumina meus dias, fortalece meu coração e torna minha existência plena de bênçãos.
Ao meu amado filho Jônatas e ao meu querido neto Benjamim, presentes divinos que iluminam nossa existência e enchem nosso coração de amor.
Ao querido amigo e irmão em Cristo, Pastor Roberto Casas, um dos melhores discipuladores que conheço, por ter me ajudado na parte prática deste material e por incentivar-me a escrever este livro.
A presente obra se constitui em um manual prático com o objetivo fundamental de fornecer um vínculo transformador entre discipulador e discipulando, para o aperfeiçoamento dos santos e a conquista de vidas para o Reino de Deus."""
    },
    {
        "filename": "faixa_02.mp3",
        "title": "Capítulo 1 — O que é Discipulado",
        "text": """Capítulo um: O que é o discipulado.
Nos últimos dias de treinamento de seus seguidores, Jesus deu ênfase primordial à importância de se fazer discípulos. Hoje, nós temos o grande privilégio de fazer o mesmo.
Surgem então as principais dúvidas: Por qual caminho eu devo começar? Por quanto tempo eu preciso treinar a pessoa? O que eu devo ensinar a ela?
A maioria dos membros de nossas igrejas não faz discípulos simplesmente porque não sabe como fazer. O nosso objetivo é alcançar aqueles que não dispõem de muito tempo para longos treinamentos, mas que ardem no desejo de colaborar ativamente com o crescimento da Igreja.
O discipulado é um dos melhores e mais eficientes meios para se alcançar uma pessoa para Jesus Cristo. Pois ele, muito além de apenas evangelizar, tem por sublime finalidade conduzir o indivíduo desde a sua conversão inicial, passando por sua completa integração à igreja local, até alcançar a maturidade espiritual e começar a frutificar."""
    },
    {
        "filename": "faixa_03.mp3",
        "title": "Visão Geral e Propósitos do Discipulado",
        "text": """Visão Geral e Propósitos do Discipulado.
Conforme Efésios capítulo 4, versículo 12: Tendo em vista o aperfeiçoamento dos santos para o desempenho do seu ministério, para a edificação do corpo de Cristo.
Este programa tem como propósito treinar toda a igreja no discipulado, visando a um compromisso profundo com a Evangelização e a Integração do novo convertido.
Como consequência direta, teremos um crescimento quantitativo, qualitativo, sadio e equilibrado.
Os propósitos específicos envolvem: treinar no pré-evangelismo, treinar no evangelismo direto, treinar no pós-evangelismo e consolidar o discipulado multiplicador.
Nos propósitos pessoais, cada servo de Deus é capacitado para ser bem treinado, saber como discipular com excelência, treinar outros crentes, conquistar a amizade genuína das pessoas, ganhar almas para Cristo e abrir núcleos frutíferos de estudo bíblico."""
    },
    {
        "filename": "faixa_04.mp3",
        "title": "As Bases Bíblicas e a Multiplicação",
        "text": """As Bases Bíblicas para o Discipulado.
Em Mateus capítulo 28, versículos 19 e 20, Jesus ordenou: Portanto ide, fazei discípulos de todas as nações, batizando-os em nome do Pai, e do Filho, e do Espírito Santo; ensinando-os a guardar todas as coisas que eu vos tenho mandado; e eis que eu estou convosco todos os dias, até a consumação dos séculos. Amém.
A ordem de Jesus aos seus discípulos apresenta a única estratégia infalível para o crescimento da igreja em todos os tempos.
O discipulado é permanente. Em Atos capítulo 5, versículo 42, lemos: E todos os dias, no templo e de casa em casa, não cessavam de ensinar e de anunciar a Jesus, o Cristo.
O método é relacional e multiplicador: Os apóstolos discipularam Barnabé. Barnabé discipulou Paulo. Paulo discipulou Timóteo. Timóteo discipulou homens fiéis. E homens fiéis discipularam a muitos outros, alcançando cidades e nações inteiras."""
    },
    {
        "filename": "faixa_05.mp3",
        "title": "Capítulo 2 — Pré-Evangelismo e Quebra de Barreiras",
        "text": """Capítulo dois: o que é o Pré-Evangelismo.
Há muitas pessoas que enfrentam grandes barreiras e impedimentos interiores para compreender a mensagem da cruz. O pré-evangelismo vem justamente para suprir essa deficiência.
Portanto, pré-evangelismo é o ministério amoroso de reduzir os impedimentos, a fim de que a pessoa compreenda o evangelho e receba a Jesus como seu único Senhor e Salvador.
Dentre os maiores impedimentos estão: preconceitos religiosos, falta de conhecimento bíblico, más experiências anteriores ou brigas em ambientes eclesiásticos.
Dois meios poderosos para reduzir os impedimentos são: primeiro, ganhar a amizade sincera das pessoas; segundo, ensinar pacientemente os fatos básicos do amor de Deus."""
    },
    {
        "filename": "faixa_06.mp3",
        "title": "Grupos de Comunhão e Novas Amizades",
        "text": """Grupos de Comunhão e a Conquista de Novas Amizades.
Pesquisas revelam que de 86 a 96 por cento das conversões cristãs ocorrem por influência direta de amigos e familiares. Portanto, devemos concentrar nossos esforços em nossos lares, colegas de trabalho e vizinhança.
Em Marcos capítulo 5, versículo 19, Jesus disse: Volte para a sua casa e conte aos seus parentes o que o Senhor fez por você e como teve misericórdia de você.
A atividade principal do discipulador é construir novas pontes de amizade genuína, porque esta é a chave de ouro do evangelismo eficaz.
Jesus foi chamado de amigo de publicanos e pecadores. A igreja primitiva conquistou a simpatia de todo o povo, e o Senhor acrescentava diariamente aqueles que iam sendo salvos."""
    },
    {
        "filename": "faixa_07.mp3",
        "title": "Evangelismo Pessoal e a Sigla Fiél",
        "text": """Evangelismo Pessoal e o Método Fiél.
Quase todas as pessoas acreditam em Deus e respeitam a Jesus, mas a grande maioria não sabe com clareza bíblica como alcançar a salvação eterna.
Para introduzir o evangelho com naturalidade e sabedoria, o discipulador utiliza o guia da sigla FIEL:
F, de Família: Inicie conversando com interesse real sobre a família da pessoa.
I, de Interesses: Pergunte sobre seu trabalho, projetos, sonhos e atividades diárias.
E, de Experiência Religiosa: Busque entender sua história de fé e relação com a igreja.
L, de Levantamento Espiritual: Faça a pergunta chave: Se você morresse hoje, você tem a certeza absoluta de que iria para o céu?
Se a pessoa responder que tem certeza, aprofunde: Suponha que você estivesse diante de Deus agora e Ele lhe perguntasse: Por que Eu deveria deixar você entrar no Meu céu? O que você responderia?"""
    },
    {
        "filename": "faixa_08.mp3",
        "title": "O Testemunho Pessoal Impactante",
        "text": """Compartilhando o seu Testemunho Pessoal.
O testemunho é a proclamação da sua experiência viva com Jesus Cristo. Ele é único, pessoal, toca corações e não pode ser refutado.
Como orienta Primeira Pedro 3.15: Estai sempre preparados para responder com mansidão e temor a qualquer que vos pedir a razão da esperança que há em vós.
Para estruturar o seu testemunho de dois a três minutos com alto impacto:
Letra A: Como era a minha vida antes de conhecer a Cristo.
Letra B: Como percebi a minha necessidade desesperada de salvação.
Letra C: Onde e como tomei a decisão consciente de entregar minha vida a Jesus.
Letra D: Como minha vida foi transformada pela graça desde que aceitei o Senhor.
Conclusão obrigatória: Agora eu tenho a plena certeza da vida eterna. Deixe-me mostrar na Bíblia como você também pode ter essa mesma certeza."""
    },
    {
        "filename": "faixa_09.mp3",
        "title": "O Plano de Salvação — Vida Eterna",
        "text": """O Plano de Salvação e a Certeza da Vida Eterna.
Ao apresentar os versículos fundamentais, aplicamos o método Péa: Propósito, Explicação e Aplicação.
Primeiro texto, Primeira João capítulo 5, versículos 11 a 13: Deus nos deu a vida eterna, e esta vida está no Seu Filho. Quem tem o Filho tem a vida.
Segundo texto, Romanos capítulo 3, versículo 23: Pois todos pecaram e carecem da glória de Deus. Todos nós necessitamos da graça redentora.
Terceiro texto, Romanos capítulo 6, versículo 23: Porque o salário do pecado é a morte, mas o dom gratuito de Deus é a vida eterna em Cristo Jesus.
Quarto texto, Romanos capítulo 10, versículos 9 e 10: Se com a tua boca confessares a Jesus como Senhor e em teu coração creres que Deus o ressuscitou dentre os mortos, serás salvo!
Faça o convite em oração: Senhor Jesus, reconheço que sou pecador. Recebo-te agora como meu único e suficiente Salvador e Senhor da minha vida. Amém!"""
    },
    {
        "filename": "faixa_10.mp3",
        "title": "Evangelismo em Lições nos Lares",
        "text": """Evangelismo em Lições e Direção de Estudos nos Lares.
O estudo bíblico no lar é a ferramenta mais acolhedora e eficaz para consolidar novos convertidos.
Diretrizes fundamentais para a reunião:
Primeiro, comece sempre em oração, pois ela é a base de todo fruto ministerial.
Segundo, prepare-se com antecedência dominando a lição que será ministrada.
Terceiro, leve a Bíblia e o material didático correspondente.
Quarto, nunca transforme o estudo em um debate teológico, mas sim em um momento de revelação do amor de Deus.
Quinto, saiba ouvir com paciência, estimule a participação de todos e respeite o limite de tempo de até uma hora por encontro.
Ao longo de sete semanas com a série Boas Novas, a pessoa estará plenamente firmada na fé e pronta para o batismo."""
    },
    {
        "filename": "faixa_11.mp3",
        "title": "Pós-Evangelismo e Integração",
        "text": """Pós-Evangelismo e o Processo de Integração.
A missão da igreja não termina na oração de entrega, ela começa ali. O pós-evangelismo tem como objetivo conduzir o novo convertido ao crescimento espiritual contínuo.
Para isso, quatro pilares são indispensáveis:
Um: Comunhão e frequência assídua às reuniões da igreja e grupos de discipulado.
Dois: Vida diária de oração como diálogo íntimo com o Pai celestial.
Três: Leitura diária e meditação nas Escrituras Sagradas, começando pelos evangelhos.
Quatro: Testemunho corajoso aos familiares e amigos sobre as maravilhas que Jesus realizou.
O discipulador deve acompanhar o novo irmão de perto na primeira semana, matriculá-lo na classe de discipulado e prepará-lo para as águas batismais."""
    },
    {
        "filename": "faixa_12.mp3",
        "title": "Apresentação dos Novos e o Batismo Bíblico",
        "text": """A Festa dos Novos e o Significado do Batismo na Bíblia.
A nossa igreja deve celebrar cada alma que nasce de novo através da Festa dos Novos, promovendo uma ótima confraternização com a liderança e também os membros antigos.
Sobre o Batismo, de acordo com o livro de Marcos capítulo 16, versículo 16, e o livro de Romanos capítulo 6, versículo 4:
O batismo nas águas por imersão é uma ordem muito importante deixada por Jesus.
Ele representa a morte e o sepultamento da velha natureza para o pecado, e a ressurreição maravilhosa para uma vida nova em total comunhão com Cristo Jesus.
O batismo é o testemunho público e corajoso de que o discípulo pertence exclusivamente ao Senhor Jesus e está totalmente comprometido com o avanço do Seu Reino."""
    },
    {
        "filename": "faixa_13.mp3",
        "title": "Visitas de Restauração e o Discípulo Multiplicador",
        "text": """Visitas de Restauração e o Princípio do Discípulo Multiplicador.
Como ensinou Jesus na parábola da ovelha perdida em Lucas capítulo 15, versículo 4: Qual de vós, possuindo cem ovelhas e perdendo uma, não vai em busca da ovelha perdida até encontrá-la?
As visitas de restauração devem ser cheias de amor, sem julgamentos, resgatando irmãos feridos ou afastados para o aconchego da comunhão.
E em Segunda Timóteo capítulo 2, versículo 2, encontramos a chave mestra da multiplicação cristã: O que de mim ouviste, transmite a homens fiéis que sejam idôneos para também ensinarem a outros.
O verdadeiro discipulador não gera apenas convertidos; ele gera novos discipuladores que continuarão a missão até os confins da terra."""
    },
    {
        "filename": "faixa_14.mp3",
        "title": "Projeto Culto Dez e Conclusão",
        "text": """Projeto Culto Dez e Metodologia de Expansão Missionária.
O Culto Dez é uma estratégia prática e dinâmica de mobilização total da igreja para colheita de almas.
Cada membro da igreja é desafiado a colocar em oração o nome de dez pessoas não crentes do seu convívio ao longo de três meses.
Com planejamento, comissão de oração, recepção calorosa, música inspirativa e uma pregação centrada no evangelho de até vinte e cinco minutos, colhe-se um número extraordinário de conversões e novos discípulos.
Discipulado não é um programa passageiro, é o coração do ministério de Jesus Cristo.
Que esta obra abençoe ricamente a sua vida, sua liderança e toda a sua igreja!"""
    }
]

async def generate_audio(track):
    output_path = os.path.join(OUTPUT_DIR, track["filename"])
    print(f"Gerando {track['filename']}: {track['title']}...")
    communicate = edge_tts.Communicate(track["text"], VOICE, rate="+0%", pitch="+0Hz")
    await communicate.save(output_path)
    print(f"OK: {track['filename']} salvo ({os.path.getsize(output_path)} bytes)")

async def main():
    print(f"Iniciando conversao TTS com voz: {VOICE}")
    for track in TRACKS:
        await generate_audio(track)
    print("Todas as faixas de audio foram geradas com sucesso!")

if __name__ == "__main__":
    asyncio.run(main())

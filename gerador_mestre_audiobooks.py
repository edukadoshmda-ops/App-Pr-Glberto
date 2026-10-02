# -*- coding: utf-8 -*-
"""
gerador_mestre_audiobooks.py
Pipeline mestre para geração e correção fonética e de pontuação de todos os 5 audiobooks
do aplicativo do Pastor Gilberto Penido, gerando áudios para narrador masculino e feminino.
"""

import asyncio
import os
import sys
import edge_tts
from biblical_tts_normalizer import normalize_text_for_tts

VOICE_MALE = "pt-BR-AntonioNeural"
VOICE_FEMALE = "pt-BR-FranciscaNeural"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, "assets", "audiobooks")

# ==============================================================================
# LIVRO 1: DISCIPULADO NA PRÁTICA (14 faixas)
# ==============================================================================
DISCIPULADO_TRACKS = [
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
        "text": """Capítulo 1: O que é o discipulado.
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
Em Mateus 28:19-20, Jesus ordenou: Portanto ide, fazei discípulos de todas as nações, batizando-os em nome do Pai, e do Filho, e do Espírito Santo; ensinando-os a guardar todas as coisas que eu vos tenho mandado; e eis que eu estou convosco todos os dias, até a consumação dos séculos. Amém.
A ordem de Jesus aos seus discípulos apresenta a única estratégia infalível para o crescimento da igreja em todos os tempos.
O discipulado é permanente. Em Atos 5:42, lemos: E todos os dias, no templo e de casa em casa, não cessavam de ensinar e de anunciar a Jesus, o Cristo.
O método é relacional e multiplicador: Os apóstolos discipularam Barnabé. Barnabé discipulou Paulo. Paulo discipulou Timóteo. Timóteo discipulou homens fiéis. E homens fiéis discipularam a muitos outros, alcançando cidades e nações inteiras."""
    },
    {
        "filename": "faixa_05.mp3",
        "title": "Capítulo 2 — Pré-Evangelismo e Quebra de Barreiras",
        "text": """Capítulo 2: o que é o Pré-Evangelismo.
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
Em Marcos 5:19, Jesus disse: Volte para a sua casa e conte aos seus parentes o que o Senhor fez por você e como teve misericórdia de você.
A atividade principal do discipulador é construir novas pontes de amizade genuína, porque esta é a chave de ouro do evangelismo eficaz.
Jesus foi chamado de amigo de publicanos e pecadores. A igreja primitiva conquistou a simpatia de todo o povo, e o Senhor acrescentava diariamente aqueles que iam sendo salvos."""
    },
    {
        "filename": "faixa_07.mp3",
        "title": "Evangelismo Pessoal e a Sigla FIEL",
        "text": """Evangelismo Pessoal e o Método FIEL.
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
Como orienta 1 Pedro 3:15: Estai sempre preparados para responder com mansidão e temor a qualquer que vos pedir a razão da esperança que há em vós.
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
Ao apresentar os versículos fundamentais, aplicamos o método de ensino com Propósito, Explicação e Aplicação.
Primeiro texto, em 1 João 5:11-13: Deus nos deu a vida eterna, e esta vida está no Seu Filho. Quem tem o Filho tem a vida.
Segundo texto, em Romanos 3:23: Pois todos pecaram e carecem da glória de Deus. Todos nós necessitamos da graça redentora.
Terceiro texto, em Romanos 6:23: Porque o salário do pecado é a morte, mas o dom gratuito de Deus é a vida eterna em Cristo Jesus.
Quarto texto, em Romanos 10:9-10: Se com a tua boca confessares a Jesus como Senhor e em teu coração creres que Deus o ressuscitou dentre os mortos, serás salvo!
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
A nossa igreja deve celebrar cada alma que nasce de novo através da Festa dos Novos, promovendo uma confraternização abençoada com a liderança e também os membros antigos.
Sobre o Batismo, de acordo com o livro de Marcos 16:16, e a carta aos Romanos 6:4:
O batismo nas águas por imersão é uma ordem muito importante deixada por Jesus.
Ele representa a morte e o sepultamento da velha natureza para o pecado, e a ressurreição maravilhosa para uma vida nova em total comunhão com Cristo Jesus.
O batismo é o testemunho público e corajoso de que o discípulo pertence exclusivamente ao Senhor Jesus e está totalmente comprometido com o avanço do Seu Reino."""
    },
    {
        "filename": "faixa_13.mp3",
        "title": "Visitas de Restauração e o Discípulo Multiplicador",
        "text": """Visitas de Restauração e o Princípio do Discípulo Multiplicador.
Como ensinou Jesus na parábola da ovelha perdida, em Lucas 15:4: Qual de vós, possuindo cem ovelhas e perdendo uma, não vai em busca da ovelha perdida até encontrá-la?
As visitas de restauração devem ser cheias de amor, sem julgamentos, resgatando irmãos feridos ou afastados para o aconchego da comunhão.
E em 2 Timóteo 2:2, encontramos a chave mestra da multiplicação cristã: O que de mim ouviste, transmite a homens fiéis que sejam idôneos para também ensinarem a outros.
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

# ==============================================================================
# LIVRO 2: OS 5 NÍVEIS DA LIDERANÇA CRISTÃ (14 faixas: faixa_02.mp3 a faixa_15.mp3)
# ==============================================================================
LIDERANCA_TRACKS = [
    {
        "filename": "faixa_02.mp3",
        "title": "Prefácio",
        "text": """Os 5 Níveis da Liderança Cristã: Formando Líderes com Verdade, Cumplicidade e Legado.
Prefácio, por Reginaldo Bertho, irmão mais velho do autor.
Conheço o Gilberto desde os seus primeiros passos, literalmente na infância e ministerialmente quando Deus acendeu nele a chama do serviço ao Reino.
Como irmão mais velho, acompanhei de perto cada fase dessa jornada, desde os dias em que a liderança era apenas uma inquietação profunda na alma até o momento em que se transformou em uma verdadeira missão de vida.
Este livro é o resultado maduro de décadas de dedicação diária, oração fervorosa, lágrimas no altar e vivência pastoral prática.
O Gilberto não escreve como um acadêmico distante da realidade do rebanho, mas como alguém que vive rigorosamente tudo aquilo que ensina no púlpito e no aconselhamento pastoral.
Sua liderança é pautada pela transparência da verdade, pelo caminhar ombro a ombro com os irmãos e pela busca constante de construir um legado que permaneça para além do seu próprio tempo.
Se o seu desejo sincero é crescer e amadurecer como líder cristão, este livro servirá como um divisor de águas em sua caminhada."""
    },
    {
        "filename": "faixa_03.mp3",
        "title": "Apresentação do Autor",
        "text": """Apresentação do Autor.
O Pastor Gilberto Penido Bertho tem dedicado sua vida integralmente ao ministério pastoral e à formação de lideranças cristãs, sempre sustentado por uma abordagem biblicamente fundamentada, altamente prática e essencialmente relacional.
Acumulando mais de 40 anos de experiência direta no campo ministerial, sua caminhada pastoral é marcada de forma inegociável pelo compromisso absoluto com a verdade das Escrituras, pelo discipulado vivenciado na rotina da comunidade e pela edificação constante da igreja local.
Ao longo dessas mais de quatro décadas, o Pastor Gilberto tem atuado ativamente como mentor de obreiros e vocacionados nos mais diversos contextos eclesiais.
Seu propósito permanente é ajudar na formação de homens e mulheres capazes de liderar com integridade inabalável, humildade sincera e uma clara visão do Reino de Deus.
A liderança cristã autêntica não começa em técnicas de gestão ou carisma pessoal, mas no coração regenerado que se expressa diariamente através do serviço sacrificial aos irmãos."""
    },
    {
        "filename": "faixa_04.mp3",
        "title": "Capítulo 1: Perfis de Liderança Cristã",
        "text": """Capítulo 1: Perfis de Liderança Cristã.
A liderança no contexto cristão transcende qualquer definição puramente institucional ou funcional; ela constitui um chamado divino soberano e solene.
Vivemos uma época frequentemente marcada pela superficialidade, pelo imediatismo e pela busca de resultados rápidos a qualquer custo. Diante desse cenário, a tarefa de formar líderes que cultivem profundidade espiritual, vida de oração, integridade moral e compromisso com o Reino torna-se uma urgência inadiável para a igreja de Jesus Cristo.
A atuação da liderança na igreja não é uniforme nem homogênea, pois o Espírito Santo concede dons diversos para a edificação do Corpo de Cristo.
Reconhecemos quatro perfis fundamentais que formam a base da liderança no rebanho: o perfil pastoral, o perfil missionário, o perfil conselheiro e o perfil administrador.
O perfil pastoral é impulsionado pelo cuidado com as vidas, pelo ensino paciente das Escrituras e pelo acompanhamento próximo, como ensina João 10:11, o modelo do Bom Pastor.
O perfil missionário carrega no peito o ardor pelo avanço do Reino e recusa a acomodação eclesiástica.
O perfil conselheiro acolhe, escuta com sabedoria e oferece direção espiritual nas crises.
E o perfil administrador zela pela excelência, transparência e organização dos recursos e ministérios da igreja."""
    },
    {
        "filename": "faixa_05.mp3",
        "title": "Capítulo 2: Os 5 Níveis da Liderança Cristã",
        "text": """Capítulo 2: Os 5 Níveis da Liderança Cristã.
O desenvolvimento da liderança no Reino de Deus é um processo gradual de formação do caráter e amadurecimento espiritual. Não estamos tratando de títulos ou hierarquias humanas de poder, mas de uma caminhada contínua de rendição, aprendizado e serviço, dividida em cinco etapas fundamentais:
Nível 1. O Chamado, que é a Convocação e Vocação: a etapa inicial onde o vocacionado é despertado pela graça soberana de Deus para servir.
Nível 2. O Compromisso, Integridade e Caráter: a fase onde a fidelidade e o caráter do líder são forjados nas provações diárias.
Nível 3. A Comunhão, Unidade e Trabalho em Equipe: onde o líder compreende que o ministério jamais deve ser exercido de forma isolada, valorizando o Corpo de Cristo.
Nível 4. O Crescimento, Multiplicação e Mentoria: o líder se dedica ativamente a mentorear, instruir e delegar autoridade com generosidade ministerial.
Nível 5. O Legado, Continuidade e Fruto Permanente: o líder dedica suas melhores energias a preparar sua sucessão, plantando sementes que florescerão por gerações."""
    },
    {
        "filename": "faixa_06.mp3",
        "title": "Capítulo 3: Fundamentos Bíblicos da Liderança",
        "text": """Capítulo 3: Fundamentos Bíblicos da Liderança.
A liderança no ambiente eclesiástico não pode ser construída sobre filosofias seculares de gestão, técnicas de manipulação comportamental ou busca por prestígio pessoal. Ela precisa estar firmemente fincada na autoridade inerrante das Sagradas Escrituras.
Em Filipenses 2:3, o apóstolo Paulo apresenta o padrão de atitude para o líder cristão ao escrever: Nada façais por contenda ou por vanglória, mas por humildade; cada um considere os outros superiores a si mesmo.
A liderança serva, ensinada e encarnada por Jesus Cristo, estabelece o divisor de águas entre a religiosidade e o verdadeiro discipulado.
Em Marcos 10:43-45, diante da disputa dos discípulos por posições de honra, Jesus ensina com clareza: Quem quiser ser o primeiro deverá ser o servo de todos. Pois o próprio Filho do Homem não veio para ser servido, mas para servir e dar a sua vida em resgate de muitos.
E em 2 Timóteo 2:2, temos o mandamento de transmitir a sã doutrina a líderes fiéis e idôneos."""
    },
    {
        "filename": "faixa_07.mp3",
        "title": "Capítulo 4: Ferramentas para Formação de Líderes",
        "text": """Capítulo 4: Ferramentas Práticas para Formação de Líderes.
A formação de novos vocacionados no Corpo de Cristo é uma tarefa que exige intenção deliberada, paciência pedagógica e acompanhamento constante. Não se formam obreiros maduros apenas em salas teóricas; a maturidade acontece na convivência diária.
Quatro ferramentas indispensáveis são:
Primeira: Mentoria em Dupla e Acompanhamento Pessoal. Inspirada no modelo de Jesus, que enviou os discípulos de dois em dois, e de Paulo com Timóteo. A mentoria cria um ambiente seguro para prestação de contas, oração conjunta e encorajamento mútuo.
Segunda: Estudos Bíblicos Semanais com Foco na Prática Ministerial, onde a Palavra é aplicada à realidade do dia a dia.
Terceira: Avaliação de Frutos e Discernimento Espiritual, pautada nos frutos do Espírito Santo descritos em Gálatas 5:22-23: amor, alegria, paz, longanimidade, benignidade, bondade, fidelidade, mansidão e domínio próprio.
Quarta: Planejamento Estratégico de Sucessão e Delegação Progressiva, capacitando os líderes mais jovens com autoridade e supervisão afetuosa."""
    },
    {
        "filename": "faixa_08.mp3",
        "title": "Capítulo 5: Vivendo para o Legado",
        "text": """Capítulo 5: Vivendo para o Legado.
O verdadeiro teste do ministério cristão não se mede durante o período em que o líder ocupa o centro do púlpito ou detém a autoridade formal sobre a instituição. O verdadeiro teste se revela no estado em que a igreja permanece após a sua saída.
Se a comunidade entrar em colapso espiritual quando o líder se afasta, fica demonstrado que ele construiu um monumento em torno de si mesmo, e não o Reino de Deus.
Viver para o legado exige a profunda consciência de que somos apenas mordomos e despenseiros da graça divina.
O Senhor Jesus dedicou a maior parte de Seu ministério terreno à formação de doze homens simples. Ao subir aos céus, deixou uma comunidade viva de discípulos inflamados pelo Espírito Santo, capazes de levar o Evangelho aos confins da terra.
E o apóstolo Paulo concluiu em 2 Timóteo 4:7: Combati o bom combate, acabei a carreira, guardei a fé. O legado é a vida que continua gerando frutos na vida de outros."""
    },
    {
        "filename": "faixa_09.mp3",
        "title": "Capítulo 6: Autoliderança e Vida Devocional",
        "text": """Capítulo 6: Autoliderança e Vida Devocional do Líder.
A vida ministerial autêntica se sustenta naquilo que é cultivado na intimidade com Deus, longe dos olhares públicos e dos aplausos dos homens.
Antes de querer pastorear uma igreja, aconselhar famílias ou liderar equipes de trabalho, o pastor precisa aprender a governar o seu próprio coração, suas emoções e seus pensamentos. O líder que negligencia a sua alma torna-se incapaz de conduzir outros com integridade.
A primeira e mais difícil pessoa que precisamos aprender a liderar somos nós mesmos.
Como advertiu o apóstolo Paulo em 1 Coríntios 9:27: Antes subjugo o meu corpo e o reduzo à sujeição, para que, tendo pregado a outros, não venha eu mesmo a ser desqualificado.
A oração secreta, a meditação diária nas Escrituras e a prática do jejum formam os pilares inegociáveis que abastecem o coração do obreiro."""
    },
    {
        "filename": "faixa_10.mp3",
        "title": "Capítulo 7: Liderança em Tempos de Crise",
        "text": """Capítulo 7: Liderança Espiritual em Tempos de Crise.
O momento de crise não cria o caráter de um líder cristão; ele apenas revela publicamente aquilo que já estava consolidado ou oculto no seu íntimo.
Nos dias de bonança, é fácil manter a serenidade. Porém, quando as tempestades da escassez financeira, da perseguição ou da doença atingem o rebanho, a firmeza e a fé do pastor são provadas pelo fogo.
Os verdadeiros líderes espirituais funcionam como termostatos, e não como termômetros. O termômetro limita-se a registrar a temperatura do ambiente, enquanto o termostato altera e estabiliza o clima ao seu redor.
Em momentos de pânico coletivo, o líder não se deixa contaminar pelo desespero; ele fixa os olhos na soberania de Deus, transmitindo paz, discernimento e direção segura à igreja."""
    },
    {
        "filename": "faixa_11.mp3",
        "title": "Capítulo 8: Relacionamentos e Conflitos",
        "text": """Capítulo 8: Gestão de Relacionamentos e Resolução Bíblica de Conflitos.
O ministério pastoral é essencialmente uma vocação relacional. Liderar é lidar dia a dia com pessoas reais, com suas histórias, personalidades distintas e diferentes graus de maturidade espiritual.
Onde seres humanos convivem de forma próxima, divergências e atritos são naturais. O diferencial do líder cristão maduro não é a ausência de conflitos, mas a maneira graciosa e bíblica como ele busca a reconciliação e a restauração da paz.
Conforme o princípio de Mateus 18:15, as questões devem ser tratadas em particular, com verdade e profundo amor.
A fofoca e os juízos precipitados destroem comunidades. O líder deve sempre ser um promotor da unidade e um curador de feridas no Corpo de Cristo."""
    },
    {
        "filename": "faixa_12.mp3",
        "title": "Capítulo 9: Visão Ministerial e Planejamento",
        "text": """Capítulo 9: Visão Ministerial, Planejamento Estratégico e Dependência do Espírito.
Provérbios 29:18 nos adverte: Não havendo profecia, o povo se corrompe. Uma liderança sem visão bíblica clara gera uma comunidade desorientada e estagnada.
A visão ministerial não nasce de ambições pessoais de grandeza, mas da escuta atenta da voz de Deus através da oração e da comunhão.
Unir a dependência soberana do Espírito Santo ao planejamento cuidadoso não é contradição, mas sabedoria divina em ação.
Neemias planejou com precisão a reconstrução dos muros de Jerusalém, calculou recursos e mobilizou o povo, sem jamais afastar o coração da oração e da dependência de Deus.
Planejar é colocar a fidelidade e a prudência a serviço dos propósitos eternos do Senhor."""
    },
    {
        "filename": "faixa_13.mp3",
        "title": "Capítulo 10: Formação de Equipes e Cultura de Honra",
        "text": """Capítulo 10: Formação de Equipes e a Prática da Cultura de Honra.
Nenhum líder consegue cumprir sozinho a missão que Deus lhe confiou. Moisés aprendeu essa lição valiosa com seu sogro Jetro em Êxodo 18, ao ser orientado a repartir o peso da liderança com homens sábios, tementes a Deus e inimigos do suborno.
Formar equipes ministeriais requer discernimento, paciência e a capacidade de celebrar os dons de cada irmão.
A cultura da honra mútua, expressa em Romanos 12:10, ensina: Dedicai-vos uns aos outros com amor fraternal; preferi-vos em honra uns aos outros.
Quando líderes honram seus liderados, e a liderança é sustentada em amor pela comunidade, o ambiente da igreja torna-se saudável, fecundo e acolhedor."""
    },
    {
        "filename": "faixa_14.mp3",
        "title": "Conclusão: O Legado que Permanece",
        "text": """Conclusão: O Legado que Permanece para a Glória de Deus.
Chegamos ao final desta reflexão sobre os 5 níveis da liderança cristã.
Mais do que acumular conhecimentos sobre perfis ou estratégias, o verdadeiro convite do Senhor para nós é uma renovação de aliança e entrega no Seu altar.
Líderes passam, metodologias mudam com as épocas, mas o Reino de Deus permanece inabalável por todas as gerações.
Que a sua caminhada pastoral seja assinalada pela simplicidade de coração, pela coragem profética de defender a verdade bíblica e pelo amor incondicional às ovelhas de Jesus.
Como declarou o salmista no Salmo 115:1: Não a nós, Senhor, não a nós, mas ao Teu nome dá glória, por amor da Tua misericórdia e da Tua fidelidade."""
    },
    {
        "filename": "faixa_15.mp3",
        "title": "Palavras Finais",
        "text": """Palavras Finais e Bênção Pastoral.
Agradeço a Deus por ter me permitido compartilhar estas verdades forjadas ao longo de mais de quatro décadas de ministério de campo.
Minha oração diária é que cada irmão e irmã que ouviu este livro seja tocado pelo Espírito Santo e levantado como uma tocha viva de esperança, amor e integridade em sua cidade e geração.
Que o Senhor te abençoe e te guarde. Que o Senhor faça resplandecer o Seu rosto sobre ti e tenha misericórdia de ti. Que o Senhor sobre ti levante o Seu rosto e te dê a paz.
Em nome de Jesus Cristo, nosso Senhor e Salvador, Amém!"""
    }
]

# ==============================================================================
# LIVRO 3: TRANSFORMANDO HÁBITOS (14 faixas: faixa_01.mp3 a faixa_14.mp3)
# ==============================================================================
HABITOS_TRACKS = [
    {
        "filename": "faixa_01.mp3",
        "title": "Capítulo 1: A Anatomia dos Hábitos",
        "text": """Transformando Hábitos: O Código da Mudança Consciente e Engenharia Comportamental.
Capítulo 1: A Anatomia dos Hábitos, o Mecanismo Oculto e a Matriz do Coração.
Hábitos não são meras escolhas casuais do cotidiano; são a própria arquitetura invisível sobre a qual a existência humana é construída. Tudo o que você faz de forma recorrente é governado por um sistema de automação neurológica refinado.
Estudos de neurociência comportamental indicam que mais de 40 por cento das ações diárias de um indivíduo não são decisões conscientes, mas sim automações operadas pelos gânglios da base do cérebro.
Na antropologia bíblica, essa dimensão do comportamento conecta-se com o coração como o centro moral e executivo de onde fluem as saídas da vida, conforme Provérbios 4:23.
A formação de qualquer hábito obedece ao ciclo de três etapas fundamentais: o Gatilho que dispara a ação, a Rotina que é o comportamento executado, e a Recompensa neuroquímica que valida e fixa o circuito no cérebro.
O discernimento espiritual nos capacita a alinhar essas automações à vontade de Deus."""
    },
    {
        "filename": "faixa_02.mp3",
        "title": "Capítulo 2: Diagnóstico Comportamental",
        "text": """Capítulo 2: Diagnóstico Comportamental, Ganhos Secundários e Ídolos do Coração.
Não é possível transformar o que não se compreende com exatidão. O erro mais comum nas tentativas de mudança é o combate direto à superfície do hábito, sem antes diagnosticar os elementos subterrâneos que o sustentam.
Nenhum comportamento persiste sem entregar uma vantagem imediata ao organismo. Na psicologia, isso é chamado de ganho secundário: alívio momentâneo da ansiedade ou esquiva de sentimentos desconfortáveis.
Na teologia bíblica, todo vício enraizado é alimentado por um ídolo funcional do coração: algo criado em que depositamos nossa busca por segurança ou significado fora do Criador.
Para mapear um comportamento de forma sincera, responda a quatro perguntas:
Primeira: Qual é o gatilho temporal e ambiental exato?
Segunda: Que estado emocional antecede a ação?
Terceira: Quem são as influências presentes no ambiente?
Quarta: Qual é o alívio que a alma está buscando no curto prazo?"""
    },
    {
        "filename": "faixa_03.mp3",
        "title": "Capítulo 3: Arquitetura de Objetivos",
        "text": """Capítulo 3: Arquitetura de Objetivos, Intenção e Design Ambiental.
A motivação é um estado emocional passageiro; confiar apenas nela para sustentar transformações duradouras é uma falha de engenharia comportamental.
Pessoas que mantêm disciplina constante não possuem necessariamente mais força de vontade; elas constroem ambientes físicos onde a necessidade de decisões conscientes é minimizada.
A lei do atrito dita: Para cultivar um hábito virtuoso, diminua o atrito ao mínimo. Deixe a Bíblia visível na mesa de cabeceira e o material de estudo preparado com antecedência.
Para eliminar um mau hábito, aumente o atrito ao máximo: distancie os gatilhos digitais, utilize senhas complexas e remova distrações do quarto de dormir.
Essa sabedoria ecoa Provérbios 22:3: O prudente vê o mal e esconde-se; mas os simples passam e sofrem a pena."""
    },
    {
        "filename": "faixa_04.mp3",
        "title": "Capítulo 4: Engenharia da Transformação",
        "text": """Capítulo 4: Engenharia da Transformação e a Teologia do Despojar-se e Vestir-se.
A neurociência comprova que caminhos neurais consolidados raramente são eliminados por completo. Tentar banir um comportamento apenas reprimindo o pensamento costuma gerar o efeito rebote e recaídas severas.
A estratégia mais eficaz consiste em manter o Gatilho e a Recompensa de alívio, inserindo uma Nova Rotina construtiva entre eles.
Esse método de substituição é a exata tradução comportamental do ensino do apóstolo Paulo em Efésios 4:22-24: Despojar-se do velho homem e vestir-se do novo homem.
O processo desdobra-se em três passos diários:
Primeiro: Despojar-se, interrompendo conscientemente a conduta destrutiva.
Segundo: Renovar a mente, alinhando as emoções às promessas da Palavra.
Terceiro: Vestir-se da nova prática que glorifica a Deus e edifica a saúde integral."""
    },
    {
        "filename": "faixa_05.mp3",
        "title": "Capítulo 5: Psicologia Interna e Força de Vontade",
        "text": """Capítulo 5: Psicologia Interna, Força de Vontade e Neuroplasticidade.
A força de vontade funciona como uma bateria que se desgasta ao longo do dia em cada escolha realizada, provocando o fenômeno da fadiga de decisão.
O cérebro possui neuroplasticidade: a notável capacidade de criar novas conexões e fortalecer circuitos através da repetição deliberada de novas disciplinas.
No início, trilhar um novo hábito parece uma estrada de terra acidentada que exige energia redobrada. Com a constância diária, essa via transforma-se em uma autoestrada asfaltada, tornando a atitude fluida e espontânea.
Como Jesus advertiu em Mateus 26:41: O espírito, na verdade, está pronto, mas a carne é fraca.
A vitória não vem da autossuficiência humana, mas da cooperação diligente com o poder capacitador do Espírito Santo."""
    },
    {
        "filename": "faixa_06.mp3",
        "title": "Capítulo 6: Construção e Sustentação de Rotinas",
        "text": """Capítulo 6: Construção e Sustentação de Rotinas Inabaláveis.
A consistência supera a intensidade na construção de resultados duradouros no Reino de Deus e na vida pessoal.
Vinte minutos de leitura bíblica e oração mantidos diariamente por cinco anos produzem frutos infinitamente mais profundos do que maratonas isoladas e inconstantes.
Utilize a técnica do empilhamento de hábitos: ancore o novo comportamento logo após uma rotina já enraizada em seu dia.
Por exemplo: Logo após tomar a primeira xícara de café pela manhã, lerei o Salmo do dia e dedicarei momentos à oração.
O profeta Daniel mantinha o hábito inabalável de orar três vezes ao dia em seu quarto, uma rotina sagrada que nem mesmo as ameaças reais puderam desestabilizar."""
    },
    {
        "filename": "faixa_07.mp3",
        "title": "Capítulo 7: Resiliência e Gestão de Recaídas",
        "text": """Capítulo 7: Resiliência Comportamental e Gestão de Recaídas.
O caminho do crescimento pessoal e espiritual não é uma linha reta impecável; ele inclui tropeços e momentos de vulnerabilidade.
O que distingue o vencedor do derrotado não é nunca ter caído, mas a forma bíblica e rápida com que ele se levanta.
Como declara Provérbios 24:16: Sete vezes cai o justo e se levanta.
A culpa paralisante é uma armadilha do adversário. A verdadeira graça produz arrependimento saudável que restaura o ânimo e corrige a rota sem desespero.
Se houver uma recaída, nunca permita que ela se repita no dia seguinte. Aplique a regra de nunca falhar duas vezes consecutivas, retomando imediatamente o rumo da disciplina e da comunhão."""
    },
    {
        "filename": "faixa_08.mp3",
        "title": "Capítulo 8: A Base Biológica da Performance",
        "text": """Capítulo 8: A Base Biológica e a Saúde do Templo do Espírito.
O apóstolo Paulo lembra em 1 Coríntios 6:19 que o nosso corpo é templo do Espírito Santo de Deus.
A mente e o organismo físico formam uma unidade integrada. A privação crônica de sono, o sedentarismo e uma alimentação desordenada afetam diretamente o humor, a clareza mental e a resistência contra as tentações.
O sono de qualidade restaura o córtex cerebral e reequilibra a química das decisões morais.
Cuidar da saúde física não é vaidade secular; é administração responsável e santa da ferramenta que Deus nos confiou para cumprir a Sua obra na terra."""
    },
    {
        "filename": "faixa_09.mp3",
        "title": "Capítulo 9: Produtividade Profunda e Gestão de Energia",
        "text": """Capítulo 9: Produtividade Profunda e Sabedoria do Tempo.
Em uma era de distrações incessantes e notificações constantes no bolso, a capacidade de foco profundo tornou-se uma virtude rara e preciosa.
Em Efésios 5:15-16, a Palavra nos exorta: Vede prudentemente como andais, não como néscios, mas como sábios, remindo o tempo, porque os dias são maus.
A verdadeira produtividade cristã não consiste em fazer mais coisas em velocidade frenética, mas em realizar as tarefas prioritárias com excelência e unção.
Proteja blocos de tempo para a oração matinal, a família e os compromissos estratégicos, desligando ruídos desnecessários que roubam a energia da alma."""
    },
    {
        "filename": "faixa_10.mp3",
        "title": "Capítulo 10: A Dinâmica Social e Relações",
        "text": """Capítulo 10: O Impacto do Círculo Social nos Padrões de Vida.
Nós somos profundamente moldados pelas companhias e vozes com as quais convivemos de forma habitual.
O Salmo 1:1 abre o saltério com essa verdade solene: Bem-aventurado o homem que não anda no conselho dos ímpios, não se detém no caminho dos pecadores, nem se assenta na roda dos escarnecedores.
Se você deseja cultivar hábitos de retidão e santidade, cerque-se de irmãos maduros que buscam o Senhor com coração puro.
Relacionamentos saudáveis fornecem prestação de contas, oração intercessória e encorajamento nos momentos em que a nossa própria determinação vacila."""
    },
    {
        "filename": "faixa_11.mp3",
        "title": "Capítulo 11: O Modelo Mental de Alto Desempenho",
        "text": """Capítulo 11: O Modelo Mental do Reino e a Humildade Sincera.
O alto desempenho aos olhos do mundo é motivado pelo orgulho, pela vaidade e pela competição predatória.
No Reino de Deus, a métrica é diametralmente oposta: o maior é aquele que serve a todos com mansidão e integridade.
Cultivar a mente de Cristo significa rejeitar o vitimismo e assumir a responsabilidade pelas próprias decisões diante do Pai celestial.
A fé bíblica não é passividade complacente; é confiança ativa que opera pela fé e pelo amor, manifestando excelência em cada área do chamado profissional e familiar."""
    },
    {
        "filename": "faixa_12.mp3",
        "title": "Capítulo 12: Consolidação da Identidade",
        "text": """Capítulo 12: Consolidação da Identidade de Filho de Deus.
A transformação mais profunda e duradoura de hábitos ocorre no nível da identidade.
Enquanto você acreditar intimamente que é refém de seus erros do passado, qualquer esforço disciplinar será temporário e frustrante.
Em 2 Coríntios 5:17, lemos a declaração máxima da nossa nova natureza: Se alguém está em Cristo, nova criatura é; as coisas velhas já passaram; eis que tudo se fez novo.
Nós não praticamos disciplinas espirituais para conquistar a aprovação de Deus; nós as praticamos porque já fomos amados, aceitos e reconciliados por meio do sacrifício perfeito de Cristo Jesus."""
    },
    {
        "filename": "faixa_13.mp3",
        "title": "Capítulo 13: Automação e Sustentabilidade",
        "text": """Capítulo 13: Automação da Fidelidade e Sustentabilidade Espiritual.
Quando as boas práticas da vida cristã tornam-se automatizadas no coração, o desgaste da indecisão cede lugar à fluidez da obediência.
O ato de orar, meditar na Palavra, falar a verdade e perdoar o próximo deixa de ser uma batalha exaustiva e torna-se a respiração natural da alma regenerada.
Essa estabilidade é descrita por Jesus na parábola dos dois construtores em Mateus 7:24-25: Aquele que ouve as Minhas palavras e as pratica é comparado ao homem prudente que edificou a sua casa sobre a rocha.
Vieram as tempestades e os ventos contrários, mas a casa não caiu, porque estava firmada na rocha eterna."""
    },
    {
        "filename": "faixa_14.mp3",
        "title": "Conclusão: O Plano de Ação Prático",
        "text": """Conclusão: O Plano de Ação Prático para a Vida Diária.
A reflexão teórica sem ação deliberada é estéril. Hoje o Senhor convida você a dar o primeiro passo prático em direção à renovação dos seus hábitos.
Escolha uma única rotina fundamental que você deseja consolidar a partir de amanhã pela manhã.
Identifique o gatilho, simplifique o ambiente e comprometa-se em oração com o Senhor.
Lembre-se de Filipenses 1:6: Aquele que começou a boa obra em vós há de completá-la até ao Dia de Cristo Jesus.
Que a sua vida seja um testemunho brilhante da graça transformadora de Deus em cada pequeno detalhe do seu caminhar."""
    }
]

# ==============================================================================
# LIVRO 4: JONAS 3 INCONFORMADO (14 faixas: faixa_01.mp3 a faixa_14.mp3)
# ==============================================================================
JONAS_TRACKS = [
    {
        "filename": "faixa_01.mp3",
        "title": "Prefácio e Introdução",
        "text": """Jonas 3 Inconformado: O Profeta em Fuga e a Extraordinária Graça de Deus.
Prefácio e Introdução.
Escrever sobre o livro de Jonas é aceitar o desafio de olhar além de uma das narrativas mais conhecidas de toda a Bíblia Sagrada.
Muitos conhecem Jonas simplesmente como o profeta que fugiu em um navio ou como o homem engolido por um grande peixe. No entanto, essas são apenas partes de uma história infinitamente maior.
O tema central deste livro bíblico não é o peixe nem a tempestade, mas a extraordinária e soberana misericórdia de Deus.
Ao longo destas páginas, perceberemos que Jonas não é apresentado como um herói intocável, mas como um homem real, com preconceitos, medos, conflitos interiores e relutâncias semelhantes às nossas.
Talvez seja exatamente por isso que a sua história permaneça tão viva e urgente para a nossa própria geração."""
    },
    {
        "filename": "faixa_02.mp3",
        "title": "Capítulo 1: A Fuga de um Homem",
        "text": """Capítulo 1: A Fuga de um Homem que Conhecia Demais o Coração de Deus.
Em Jonas 1:1-2, o chamado do Senhor soa de forma imperativa: Levanta-te, vai à grande cidade de Nínive e clama contra ela, porque a sua malícia subiu até mim. Jonas, porém, se levantou para fugir para Társis.
A fuga de Jonas não nasceu da ignorância sobre quem era Deus, mas de profunda resistência interior.
Ele não fugiu porque desconhecia o caráter do Senhor; fugiu porque sabia perfeitamente que o Senhor é misericordioso, clemente, tardio em irar-se e pronto a perdoar.
Nínive era a capital do sanguinário Império Assírio, inimigo histórico e brutal de Israel.
No íntimo de sua alma nacionalista, Jonas não queria que aquele povo pagão fosse perdoado. Ele preferia ver a destruição dos seus inimigos do que a salvação deles pela graça de Deus."""
    },
    {
        "filename": "faixa_03.mp3",
        "title": "Capítulo 2: Três Dias na Escuridão",
        "text": """Capítulo 2: No Fundo do Abismo: Quando Deus Fala no Silêncio da Tempestade.
A fuga parecia bem-sucedida. Jonas comprou a passagem, desceu ao porão do navio e caiu em sono profundo.
Mas há uma verdade que nenhum servo de Deus pode esquecer: podemos fugir do lugar do nosso ministério, porém jamais conseguiremos fugir dos olhos daquele que nos criou.
O Senhor enviou um forte vento sobre o mar e uma grande tempestade se levantou.
Os marinheiros pagãos clamavam desesperados aos seus deuses, enquanto o profeta do Deus vivo dormia no porão. O capitão teve que acordá-lo dizendo: Como dormes? Levanta-te e clama ao teu Deus!
Reconhecendo a sua culpa, Jonas pediu que o lançassem ao mar. Ao ser arremessado às águas agitadas, o mar se acalmou. E o Senhor deparou um grande peixe para recolher a Jonas com vida."""
    },
    {
        "filename": "faixa_04.mp3",
        "title": "Capítulo 3: O Maior Avivamento da História",
        "text": """Capítulo 3: Nínive e o Maior Avivamento da História.
Dentro do ventre escuro do peixe, Jonas orou em contrição e o Senhor ordenou que o peixe o vomitasse em terra seca.
Em Jonas 3:1-2, a palavra do Senhor veio pela segunda vez: Levanta-te, vai a Nínive e proclama a mensagem que Eu te ordeno.
O Deus da Bíblia é o Deus das segundas oportunidades.
Desta vez Jonas foi e proclamou pelas ruas da metrópole: Ainda quarenta dias, e Nínive será destruída!
O resultado foi estarrecedor: os ninivitas creram em Deus, proclamaram um jejum nacional, vestiram-se de pano de saco desde o rei até o mais humilde cidadão e abandonaram seus maus caminhos.
E Deus viu as suas obras de arrependimento e usou de misericórdia, poupando a cidade."""
    },
    {
        "filename": "faixa_05.mp3",
        "title": "Capítulo 4: Quando o Profeta se Irrita",
        "text": """Capítulo 4: Quando o Profeta se Irrita com a Graça de Deus.
O capítulo 4 de Jonas registra um dos episódios mais paradoxais de todas as Escrituras.
Em vez de se alegrar com a salvação de mais de cento e vinte mil almas que se arrependeram, Jonas desgostou-se profundamente e ficou irado!
Ele orou ao Senhor em tom de censura: Ah! Senhor, não foi isso que eu disse quando ainda estava na minha terra? Por isso me apressei em fugir para Társis, pois sabia que és Deus bondoso e compassivo!
O profeta preferia ver a cidade em cinzas para justificar o seu ressentimento do que contemplar a vitória do perdão divino.
É possível exercer dons ministeriais, orar e jejuar, e ainda assim carregar no peito um coração amargurado que não reflete a compaixão de Cristo."""
    },
    {
        "filename": "faixa_06.mp3",
        "title": "Capítulo 5: Nínive, Cidade que Deus Não Desistiu de Amar",
        "text": """Capítulo 5: Nínive, a Cidade que Deus Não Desistiu de Amar.
Enquanto o profeta Jonas enxergava apenas criminosos merecedores do fogo do juízo, os olhos de Deus enxergavam seres humanos carentes de reconciliação.
Deus fez crescer uma planta que cobriu a cabeça de Jonas e lhe deu sombra fresca, e Jonas alegrou-se intensamente com ela.
Mas, na manhã seguinte, Deus enviou um verme que feriu a planta até que ela secou. Com o sol escaldante e o vento quente, o profeta desfaleceu e pediu para morrer.
Então o Senhor lhe fez a pergunta fulcral: Você tem compaixão de uma planta pela qual não trabalhou nem fez crescer, e Eu não teria compaixão da grande cidade de Nínive, onde há mais de cento e vinte mil pessoas inocentes e também muitos animais?
O livro de Jonas termina em aberto com essa pergunta, convidando cada um de nós a sondar as prioridades do nosso próprio coração."""
    },
    {
        "filename": "faixa_07.mp3",
        "title": "Capítulo 6: Jonas e Jesus",
        "text": """Capítulo 6: O Sinal de Jonas: O Profeta que Apontava para Jesus.
Nos evangelhos, Jesus fez referência direta ao profeta ao declarar em Mateus 12:40: Pois assim como Jonas esteve três dias e três noites no ventre do grande peixe, assim o Filho do Homem estará três dias e três noites no seio da terra.
Jonas é um tipo e uma sombra que aponta para o Redentor eterno.
Mas enquanto Jonas foi lançado ao mar por causa de sua própria rebelião, Jesus entregou-se voluntariamente à morte de cruz pelos nossos pecados.
Onde Jonas pregou a destruição com relutância e frieza, Jesus chorou sobre Jerusalém e derramou Seu sangue para salvar o mundo.
Um profeta maior do que Jonas ressuscitou dos mortos e está assentado à destra de Deus Pai."""
    },
    {
        "filename": "faixa_08.mp3",
        "title": "Capítulo 7: Jonas e a Igreja de Hoje",
        "text": """Capítulo 7: O Chamado Missionário que Ainda Ecoa na Igreja de Hoje.
A igreja contemporânea corre constantemente o risco de repetir a rota de Társis.
Quando nos fechamos em quatro paredes, quando nos preocupamos apenas com o conforto da nossa comunidade e nos tornamos indiferentes ao clamor das multidões perdidas em nossas ruas, nós nos assemelhamos a Jonas adormecido no porão.
A missão de pregar o Evangelho da graça não é um compromisso opcional para um grupo seleto; é a razão de ser de cada crente redimido por Cristo.
O mundo precisa desesperadamente de reconciliação e cura espiritual."""
    },
    {
        "filename": "faixa_09.mp3",
        "title": "Capítulo 8: O Clamor da Cidade",
        "text": """Capítulo 8: O Clamor da Cidade e a Responsabilidade dos Santos.
As cidades modernas enfrentam desafios imensos: violência, desigualdade, solidão e vazios existenciais profundos.
Nínive era uma cidade que clamava aos céus por causa de suas feridas e iniquidades.
Deus ouve o gemido das periferias, das famílias desfeitas e dos jovens sem esperança.
A igreja local precisa estar presente nas ruas, nos lares e nos ambientes de trabalho, funcionando como sal da terra e luz do mundo, comunicando a verdade bíblica com amor inabalável."""
    },
    {
        "filename": "faixa_10.mp3",
        "title": "Capítulo 9: A Planta e o Verme",
        "text": """Capítulo 9: A Lição da Planta e do Verme: Onde Está o Seu Afeto?
A lição da planta que secou e do verme que a consumiu ensina que muitas vezes valorizamos mais o nosso bem-estar imediato do que o destino eterno das almas humanas.
Jonas lamentou a perda da sombra que refrescava a sua cabeça, mas não foi capaz de derramar uma única lágrima pela salvação de um milhão de cidadãos.
Quantas vezes nos apegamos a comodidades passageiras enquanto almas preciosas caminham para a eternidade sem o conhecimento do Senhor?
Deus deseja alinhar os nossos afetos ao coração dEle."""
    },
    {
        "filename": "faixa_11.mp3",
        "title": "Capítulo 10: Graça Inesperada",
        "text": """Capítulo 10: A Graça Inesperada que Alcança os Improváveis.
A salvação de Nínive nos lembra que ninguém está além do alcance da mão poderosa do Senhor.
A graça de Deus é livre, soberana e escandalosa aos olhos dos religiosos moralistas da época.
Pessoas que a sociedade rotula como irrecuperáveis são alcançadas e transformadas pelo toque santificador do Evangelho.
O testemunho vivo de um pecador redimido cala as vozes da arrogância e glorifica o poder do sangue de Cristo."""
    },
    {
        "filename": "faixa_12.mp3",
        "title": "Capítulo 11: O Deus que Perdoa",
        "text": """Capítulo 11: O Deus que Perdoa, Restaura e Envia Novamente.
Se você hoje se sente no fundo do poço ou distante da comunhão do Pai por causa de escolhas erradas no passado, saiba que o Senhor não desistiu do seu propósito.
Ele é o Deus que ouviu a oração de Jonas nas profundezas do abismo marinho.
O perdão do Senhor é pleno, gratuito e abundante. Ele perdoa a transgressão, cura a rebeldia da alma e renova as forças do servo caído para uma nova jornada de vitória."""
    },
    {
        "filename": "faixa_13.mp3",
        "title": "Capítulo 12: A Resposta do Coração",
        "text": """Capítulo 12: A Resposta do Coração Diante do Espelho Divino.
Ao encerrar a leitura deste fascinante livro bíblico, o leitor é confrontado consigo mesmo.
Qual é a sua postura diante dos inimigos ou das pessoas difíceis do seu convívio diário?
Você tem nutrido ressentimento secreto ou tem orado pela transformação e bênção daqueles que o feriram?
Seguir a Jesus exige abandonar a postura amarga de Jonas e vestir o manto de misericórdia do Mestre da Galileia."""
    },
    {
        "filename": "faixa_14.mp3",
        "title": "Conclusão: O Deus que Continua Chamando",
        "text": """Conclusão: O Deus que Continua Chamando a Sua Igreja.
O chamado que ecoou nas colinas da Galileia e nas ruas de Nínive continua ressoando nos nossos corações hoje.
Jesus nos diz em Marcos 16:15: Ide por todo o mundo e pregai o evangelho a toda criatura.
Que a nossa resposta ao Pai não seja o silêncio da fuga nem a amargura da revolta, mas a entrega jubilosa de Isaías 6:8: Eis-me aqui, envia-me a mim!
A Deus seja toda a glória, honra e louvor, para todo o sempre. Amém!"""
    }
]

# ==============================================================================
# LIVRO 5: EU SOU (19 faixas: faixa_01.mp3 a faixa_19.mp3)
# ==============================================================================
EUSOU_TRACKS = [
    {
        "filename": "faixa_01.mp3",
        "title": "Prefácio e Apresentação",
        "text": """Eu Sou o Que Sou: A Glória de Deus Revelada.
Descobrindo a plenitude de Deus em cada capítulo da vida.
Ao longo da minha caminhada com o Senhor, fui profundamente impactado pelas revelações contidas na solene expressão divina EU SOU.
Cada capítulo deste livro nasceu de vigílias, oração fervorosa, lágrimas no altar e contemplação reverente das Sagradas Escrituras.
Este não é apenas um estudo teológico abstrato; é uma jornada espiritual de encontro com o Criador.
A revelação do EU SOU convida você a conhecer o Senhor não apenas por Seus feitos milagrosos, mas pela Sua própria essência eterna, imutável e soberana."""
    },
    {
        "filename": "faixa_02.mp3",
        "title": "Capítulo 1: O Chamado de Moisés e o Fogo que Não se Apaga",
        "text": """Capítulo 1: O Chamado de Moisés e o Fogo que Não se Apaga.
Em Êxodo 3:2 lemos: E apareceu-lhe o anjo do Senhor numa chama de fogo no meio de uma sarça; e olhou, e eis que a sarça ardia no fogo, e a sarça não se consumia.
Moisés cuidava das ovelhas de seu sogro no deserto de Midiã quando teve um encontro transformador.
A sarça ardia sem ser destruída. Aquela visão não era apenas um milagre visual; era a manifestação da presença santa de Deus.
Quando Moisés hesitou dizendo: Quem sou eu para ir perante Faraó?, Deus respondeu com firmeza: Certamente Eu serei contigo!
Não é sobre a nossa fraqueza, mas sobre o poder daquele que nos envia."""
    },
    {
        "filename": "faixa_03.mp3",
        "title": "Capítulo 2: Eu Sou o Que Sou: O Nome que Revela a Eternidade",
        "text": """Capítulo 2: Eu Sou o Que Sou: O Nome que Revela a Eternidade.
Quando Moisés perguntou a Deus qual nome deveria apresentar aos israelitas cativos no Egito, o Altíssimo respondeu com uma declaração absoluta em Êxodo 3:14: EU SOU O QUE SOU. Disse mais: Assim dirás aos filhos de Israel: EU SOU me enviou a vós.
Deus não diz Eu fui nem Eu serei; Ele diz EU SOU.
Isso revela que o Senhor habita a eternidade. Ele é o Deus do presente contínuo, a fonte inesgotável de vida e poder.
Quando você diz: Estou perdido, Ele diz: Eu Sou o Caminho. Quando você diz: Não tenho forças, Ele diz: Eu Sou a sua fortaleza."""
    },
    {
        "filename": "faixa_04.mp3",
        "title": "Capítulo 3: Eu Sou o Pão da Vida: A Suficiência de Cristo",
        "text": """Capítulo 3: Eu Sou o Pão da Vida: A Suficiência de Cristo.
Em João 6:35, Jesus declarou solenemente: Eu sou o pão da vida; aquele que vem a mim não terá fome, e quem crê em mim nunca terá sede.
A multidão seguia a Cristo após o milagre da multiplicação dos pães físicos.
Mas Jesus queria conduzi-los a uma realidade muito superior: o alimento da alma que dura para a vida eterna.
Jesus não disse apenas que dá o pão; Ele afirmou que Ele próprio é o pão vivo descido do céu.
A verdadeira satisfação da existência não se encontra em bens materiais perecíveis, mas na comunhão viva com a pessoa de Jesus."""
    },
    {
        "filename": "faixa_05.mp3",
        "title": "Capítulo 4: Eu Sou a Luz do Mundo: O Brilho da Verdade",
        "text": """Capítulo 4: Eu Sou a Luz do Mundo: O Brilho da Verdade em Meio à Escuridão.
Em João 8:12, o Mestre proclama: Eu sou a luz do mundo; quem me segue não andará em trevas, mas terá a luz da vida.
A escuridão espiritual é a ausência de esperança, verdade e orientação divina.
Jesus não é uma pequena chama que clareia um canto escuro; Ele é o Sol da Justiça cujos raios dissipam o pecado, desmascaram o engano do inimigo e mostram com clareza o caminho da salvação.
Andar na luz de Cristo é viver em transparência, integridade moral e paz interior."""
    },
    {
        "filename": "faixa_06.mp3",
        "title": "Capítulo 5: Eu Sou a Porta: O Acesso Seguro ao Reino",
        "text": """Capítulo 5: Eu Sou a Porta: O Acesso Seguro ao Reino.
Em João 10:9, Jesus declara: Eu sou a porta; se alguém entrar por mim, salvar-se-á, e entrará, e sairá, e achará pastagens.
Jesus não é uma porta entre várias alternativas filosóficas; Ele é a única porta que dá acesso ao Pai celestial.
No aprisco dos tempos bíblicos, o pastor deitava-se na entrada e seu próprio corpo funcionava como a porta que protegia as ovelhas contra lobos e assaltantes.
Entrar por Cristo é encontrar salvação garantida, liberdade da condenação eterna e alimento abundante para a caminhada espiritual."""
    },
    {
        "filename": "faixa_07.mp3",
        "title": "Capítulo 6: Eu Sou o Bom Pastor: O Cuidado Pessoal de Deus",
        "text": """Capítulo 6: Eu Sou o Bom Pastor: O Cuidado Pessoal de Deus.
Em João 10:11, o Filho de Deus diz: Eu sou o bom pastor; o bom pastor dá a sua vida pelas ovelhas.
O mercenário cuida do rebanho por dinheiro e foge quando o lobo se aproxima.
Mas o Senhor Jesus conhece cada uma de Suas ovelhas pelo nome, cuida de suas feridas e deu a Sua própria vida na cruz do Calvário para nos resgatar da morte eterna.
Sob o cajado do Bom Pastor, podemos descansar com a confiança inabalável do Salmo 23:1: O Senhor é o meu pastor; nada me faltará."""
    },
    {
        "filename": "faixa_08.mp3",
        "title": "Capítulo 7: Eu Sou o Caminho, a Verdade e a Vida",
        "text": """Capítulo 7: Eu Sou o Caminho, a Verdade e a Vida.
Em João 14:6, encontramos uma das declarações mais absolutas de toda a história: Disse-lhe Jesus: Eu sou o caminho, e a verdade, e a vida; ninguém vem ao Pai, senão por mim.
Jesus não se apresenta como um guia turístico que mostra a estrada, nem como um filósofo que debate hipóteses.
Ele é o Caminho exclusivo que nos conduz à presença do Pai. Ele é a Verdade inalterável que liberta da mentira do mundo. E Ele é a Vida eterna que ressuscita o pecador espiritualmente morto."""
    },
    {
        "filename": "faixa_09.mp3",
        "title": "Capítulo 8: Eu Sou a Videira Verdadeira",
        "text": """Capítulo 8: Eu Sou a Videira Verdadeira e a Seiva da Frutificação.
Em João 15:1-5, o Salvador ensina: Eu sou a videira verdadeira, e meu Pai é o lavrador. Vós sois as varas; quem está em mim, e eu nele, esse dá muito fruto; porque sem mim nada podeis fazer.
O ramo não produz uvas por esforço próprio desvinculado do tronco; ele frutifica porque a seiva viva da videira corre através dele.
Permanecer em Cristo através da oração, da Palavra e da obediência é a única garantia de uma vida cristã fértil, vigorosa e relevante."""
    },
    {
        "filename": "faixa_10.mp3",
        "title": "Capítulo 9: Antes que Abraão Existisse, Eu Sou",
        "text": """Capítulo 9: Antes que Abraão Existisse, Eu Sou.
Em João 8:58, ao confrontar os líderes religiosos, Jesus fez uma afirmação de impacto eterno: Em verdade, em verdade vos digo que antes que Abraão existisse, Eu Sou.
Ao usar essa expressão exata, Jesus declarou abertamente Sua divindade e preexistência eterna perante a criação.
Ele não teve o Seu início histórico na manjedoura de Belém; Ele é o Verbo eterno pelo qual todas as coisas foram feitas no princípio dos tempos.
Diante de Sua glória divina, prostramo-nos em adoração reverente e submissão total."""
    },
    {
        "filename": "faixa_11.mp3",
        "title": "Capítulo 10: Eu Sou o Deus Presente",
        "text": """Capítulo 10: Eu Sou o Deus Presente: Emanuel, Deus Conosco.
Em Mateus 28:20, a última promessa de Jesus ecoa com triunfo: E eis que eu estou convosco todos os dias, até à consumação dos séculos. Amém.
Deus não é uma divindade distante observando o universo de longe.
Ele habita no meio do Seu povo através do Espírito Santo Consolador.
Nas noites solitárias de angústia, nas salas de hospital ou nos momentos de desafio no lar, a Sua presença reconfortante nos envolve dizendo: Não temas, porque Eu sou contigo; Eu sou o teu Deus."""
    },
    {
        "filename": "faixa_12.mp3",
        "title": "Capítulo 11: Eu Sou o Senhor da Glória",
        "text": """Capítulo 11: Eu Sou o Senhor da Glória e o Mistério da Cruz.
Em 1 Coríntios 2:8, o apóstolo Paulo afirma: Nenhuma das potestades deste mundo conheceu a sabedoria de Deus; porque, se a conhecessem, nunca crucificariam ao Senhor da Glória.
A glória que Moisés vislumbrou de costas no monte Sinai resplandeceu em plenitude na face de Cristo Jesus.
Essa glória manifestou-se no amor incompreensível do Calvário, onde o Justo morreu pelos injustos para nos conduzir a Deus.
A cruz não foi uma derrota temporária, mas a demonstração suprema da majestade divina."""
    },
    {
        "filename": "faixa_13.mp3",
        "title": "Capítulo 12: Eu Sou o Alfa e o Ômega",
        "text": """Capítulo 12: Eu Sou o Alfa e o Ômega: O Princípio e o Fim de Tudo.
No livro de Apocalipse 1:8, o Senhor declara: Eu sou o Alfa e o Ômega, o princípio e o fim, diz o Senhor, que é, e que era, e que há de vir, o Todo-Poderoso.
Alfa é a primeira letra do alfabeto grego e Ômega é a última.
Isso significa que Jesus tem a primeira e a última palavra sobre a história humana e sobre a sua história pessoal.
Nada foge ao Seu controle soberano. Os impérios sobem e descem, mas o trono do Cordeiro permanece firmado para todo o sempre."""
    },
    {
        "filename": "faixa_14.mp3",
        "title": "Capítulo 13: Eu Sou o Cordeiro de Deus",
        "text": """Capítulo 13: Eu Sou o Cordeiro de Deus que Tira o Pecado do Mundo.
Em João 1:29, João Batista aponta para o Messias às margens do Jordão e exclama: Eis o Cordeiro de Deus, que tira o pecado do mundo!
No Antigo Testamento, milhares de cordeiros foram imolados sem jamais conseguir apagar a culpa humana de forma definitiva.
Mas Jesus Cristo, o Cordeiro puro e imaculado, ofereceu um único sacrifício de valor infinito na cruz.
Por meio do Seu sangue precioso derramado, fomos comprados, perdoados e selados com o Espírito da promessa."""
    },
    {
        "filename": "faixa_15.mp3",
        "title": "Capítulo 14: Eu Sou o Rei dos Reis",
        "text": """Capítulo 14: Eu Sou o Rei dos Reis e Senhor dos Senhores.
Em Apocalipse 19:16, o apóstolo João contempla o retorno triunfal de Cristo: E no manto e na sua coxa tem escrito este nome: Rei dos reis e Senhor dos senhores.
Jesus não reinará no futuro apenas; Ele já reina agora de forma soberana à destra do Pai nos lugares celestiais.
Todo joelho se dobrará e toda língua confessará que Jesus Cristo é o Senhor, para glória de Deus Pai.
Viver debaixo do Seu senhorio é a nossa maior honra e alegria cotidiana."""
    },
    {
        "filename": "faixa_16.mp3",
        "title": "Capítulo 15: Eu Sou o que Venho Sem Demora",
        "text": """Capítulo 15: Eu Sou o que Venho Sem Demora: A Bendita Esperança.
Nas páginas finais do Apocalipse 22:20, o Senhor sela a Sua revelação com uma solene promessa: Aquele que testifica estas coisas diz: Certamente cedo venho. Amém. Ora vem, Senhor Jesus!
A bendita esperança da igreja militante é o retorno visível e glorioso do nosso Noivo e Salvador.
Essa promessa renova o nosso fervor evangelístico, nos convida à santidade de vida e nos consola nas tribulações terrenas."""
    },
    {
        "filename": "faixa_17.mp3",
        "title": "Capítulo 16: A Glória Revelada",
        "text": """Capítulo 16: A Glória de Deus Revelada em Vasos de Barro.
Em 2 Coríntios 4:6-7, Paulo registra: Porque Deus, que disse que das trevas resplandecesse a luz, é quem resplandeceu em nossos corações. Temos, porém, este tesouro em vasos de barro, para que a excelência do poder seja de Deus, e não de nós.
A glória do EU SOU habita no coração frágil do crente redimido.
Somos vasos de barro frágeis, mas carregamos dentro de nós a presença incomparável do Deus Altíssimo para abençoar o mundo."""
    },
    {
        "filename": "faixa_18.mp3",
        "title": "Capítulo 17: A Presença que Transforma",
        "text": """Capítulo 17: A Presença Viva que Transforma o Deserto em Manancial.
No livro do profeta Isaías 43:19, o Senhor proclama: Eis que farei uma coisa nova, e agora sairá à luz; porventura não a sabereis? Eis que porei um caminho no deserto e rios no ermo.
Quando a presença do EU SOU entra em uma família despedaçada, Ele opera o milagre da reconciliação.
Quando Ele toca a mente atormentada pelo medo, Ele estabelece a paz que excede todo o entendimento humano.
Tudo se transforma diante da glória do Seu santo nome."""
    },
    {
        "filename": "faixa_19.mp3",
        "title": "Conclusão: A Plenitude do Eu Sou",
        "text": """Conclusão: Descansando na Plenitude do Eterno EU SOU.
Ao chegarmos ao final desta caminhada de fé, o convite que ecoa para você é simples: descanse no Senhor.
Você não precisa viver ansioso nem desanimado diante das incertezas do amanhã.
O Deus que chamou a Abraão, que falou com Moisés na sarça ardente e que ressuscitou a Jesus dentre os mortos é o mesmo Deus que cuida de você hoje.
Porque Ele é o EU SOU: tudo o que você precisa, em todo o tempo e em qualquer lugar.
A Ele seja o louvor, a honra e o domínio pelos séculos dos séculos. Amém!"""
    }
]

# Dicionário com todos os 5 livros e suas respectivas faixas
ALL_BOOKS = {
    "discipulado": DISCIPULADO_TRACKS,
    "lideranca": LIDERANCA_TRACKS,
    "habitos": HABITOS_TRACKS,
    "jonas": JONAS_TRACKS,
    "eusou": EUSOU_TRACKS
}

async def generate_single_track(text: str, voice: str, output_path: str):
    """Aplica a normalização fonética bíblica e sintetiza o áudio via edge_tts."""
    normalized_text = normalize_text_for_tts(text)
    communicate = edge_tts.Communicate(normalized_text, voice, rate="+0%", pitch="+0Hz")
    await communicate.save(output_path)

async def process_book(book_id: str, tracks: list):
    """Gera todas as faixas do livro para voz masculina e feminina."""
    print(f"\n=======================================================")
    print(f"PROCESSANDO LIVRO: {book_id.upper()} ({len(tracks)} faixas)")
    print(f"=======================================================")

    dir_male = os.path.join(ASSETS_DIR, book_id)
    dir_female = os.path.join(ASSETS_DIR, f"{book_id}-fem")
    os.makedirs(dir_male, exist_ok=True)
    os.makedirs(dir_female, exist_ok=True)

    for i, track in enumerate(tracks, 1):
        filename = track["filename"]
        title = track["title"]
        text = track["text"]

        path_male = os.path.join(dir_male, filename)
        path_female = os.path.join(dir_female, filename)

        print(f"[{i}/{len(tracks)}] Faixa '{filename}' ({title}):")
        
        # Voz Masculina
        try:
            await generate_single_track(text, VOICE_MALE, path_male)
            size_m = os.path.getsize(path_male) // 1024
            print(f"  -> Masculino ({VOICE_MALE}): OK ({size_m} KB)")
        except Exception as e:
            print(f"  -> Masculino ERRO: {e}")

        # Voz Feminina
        try:
            await generate_single_track(text, VOICE_FEMALE, path_female)
            size_f = os.path.getsize(path_female) // 1024
            print(f"  -> Feminino ({VOICE_FEMALE}): OK ({size_f} KB)")
        except Exception as e:
            print(f"  -> Feminino ERRO: {e}")

async def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "all"
    print(f"Iniciando pipeline de síntese fonética bíblica...")
    print(f"Voz Masculina: {VOICE_MALE}")
    print(f"Voz Feminina: {VOICE_FEMALE}")
    
    books_to_process = [target] if target in ALL_BOOKS else list(ALL_BOOKS.keys())

    for b_id in books_to_process:
        await process_book(b_id, ALL_BOOKS[b_id])

    print("\n=======================================================")
    print("TODOS OS AUDIOBOOKS FORAM PROCESSADOS COM SUCESSO!")
    print("=======================================================")

if __name__ == "__main__":
    asyncio.run(main())

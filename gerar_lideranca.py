import asyncio
import edge_tts
import os

book_id = "lideranca-fem"
voice = "pt-BR-FranciscaNeural"

chapters = {
    "faixa_01.mp3": """PREFÁCIO E APRESENTAÇÃO.
Conheço o Gilberto desde os seus primeiros passos, literalmente na infância e ministerialmente quando Deus acendeu nele a chama do serviço ao Reino. Como irmão mais velho, acompanhei de perto cada fase dessa jornada, desde os dias em que a liderança era apenas uma inquietação profunda na alma até o momento em que se transformou em uma verdadeira missão de vida. Este livro é o resultado maduro de décadas de dedicação diária, oração fervorosa, lágrimas no altar e vivência pastoral prática.
O Gilberto não escreve como um acadêmico distante da realidade do rebanho, mas como alguém que vive rigorosamente tudo aquilo que ensina no púlpito e no aconselhamento. Sua liderança é pautada pela transparência da verdade, pelo caminhar ombro a ombro com os irmãos e pela busca constante de construir um legado que permaneça para além do seu próprio tempo. Se o seu desejo sincero é crescer e amadurecer como líder cristão, este texto servirá como um divisor de águas em sua caminhada.
O Pastor Gilberto Penido Bertho tem dedicado sua vida integralmente ao ministério pastoral e à formação de lideranças cristãs, sempre sustentado por uma abordagem biblicamente fundamentada, altamente prática e essencialmente relacional. Acumulando mais de 40 anos de experiência direta no campo ministerial, sua caminhada pastoral é marcada de forma inegociável pelo compromisso absoluto com a verdade das Escrituras, pelo discipulado vivenciado na rotina da comunidade e pela edificação constante da igreja local.""",

    "faixa_02.mp3": """CAPÍTULO 1. Perfis de Liderança Cristã.
A liderança no contexto cristão transcende qualquer definição puramente institucional ou funcional; ela constitui um chamado divino soberano e solene. Vivemos uma época frequentemente marcada pela superficialidade, pelo imediatismo e pela busca de resultados rápidos a qualquer custo. Diante desse cenário, a tarefa de formar líderes que cultivem profundidade espiritual, vida de oração, integridade moral e compromisso com o Reino torna-se uma urgência inadiável para a igreja de Jesus Cristo.
A atuação da liderança na igreja não é uniforme nem homogênea, pois o Espírito Santo concede dons diversos para a edificação do Corpo de Cristo. A liderança se manifesta por meio de diferentes expressões e vocações que, quando devidamente compreendidas, valorizadas e integradas, compõem um ministério equilibrado, saudável e produtivo.
Para que a igreja alcance maturidade, precisamos reconhecer e cultivar quatro perfis fundamentais que formam a base da liderança no rebanho: o perfil pastoral, o perfil missionário, o perfil conselheiro e o perfil administrador.
O perfil pastoral é impulsionado pelo cuidado com as vidas, pelo ensino paciente das Escrituras e pelo acompanhamento próximo. Mover-se por compaixão e responsabilidade espiritual é a sua marca. O líder pastoral caminha lado a lado com os membros, compartilha suas alegrias e chora junto nas horas de luto e dor.
O perfil missionário possui um temperamento mobilizador e expansivo. Ele carrega no peito o ardor pelo avanço do Reino e recusa-se a aceitar a acomodação eclesiástica.
O perfil conselheiro destaca-se pela capacidade de acolher, escutar com atenção e oferecer direção espiritual em momentos de crise.
O perfil administrador traz consigo a capacidade de organizar, estruturar e zelar pelos processos e recursos do ministério. Nenhum desses quatro perfis é autossuficiente. A maturidade da igreja depende diretamente da integração harmônica entre eles.""",

    "faixa_03.mp3": """CAPÍTULO 2. Os 5 Níveis da Liderança Cristã.
O desenvolvimento da liderança no Reino de Deus não acontece por acasos ou improvisos; é um processo gradual de formação do caráter e amadurecimento espiritual. Não estamos tratando de títulos, hierarquias humanas ou posições de status. Trata-se de uma caminhada contínua de rendição, aprendizado e serviço, dividida em cinco etapas fundamentais:
Nível 1. O Chamado, que é a Convocação e Vocação. Esta é a etapa inicial onde o vocacionado é despertado pela graça de Deus para o serviço. Não se fundamenta em talentos naturais, mas na percepção clara de um propósito soberano.
Nível 2. O Compromisso, Integridade e Caráter. Após responder ao chamado, o líder entra na fase onde sua fidelidade e caráter são testados no fogo das provações diárias. O compromisso envolve viver com retidão moral e firmeza ética, mesmo quando as circunstâncias pressionam para o atalho.
Nível 3. A Comunhão, Unidade e Trabalho em Equipe. O líder compreende que o ministério jamais deve ser exercido de forma isolada ou individualista. Ele aprende a valorizar o Corpo de Cristo, a cultivar relacionamentos profundos e a ouvir os irmãos com humildade.
Nível 4. O Crescimento, Multiplicação e Mentoria. O foco do líder maduro deixa de ser apenas a execução direta das tarefas e passa a ser a formação e capacitação de outros obreiros. Ele se dedica ativamente a mentorear, instruir e delegar autoridade com generosidade ministerial.
Nível 5. O Legado, Continuidade e Fruto Permanente. Este é o estágio culminante do amadurecimento ministerial. O líder dedica suas energias a preparar sua sucessão, a construir estruturas bíblicas duradouras e a plantar sementes cujos frutos permanecerão mesmo após a sua partida.""",

    "faixa_04.mp3": """CAPÍTULO 3. Fundamentos Bíblicos da Liderança.
A liderança no ambiente eclesiástico não pode ser construída sobre filosofias seculares de gestão, técnicas de manipulação comportamental ou busca por prestígio pessoal. Ela precisa estar firmemente fincada na autoridade inerrante das Sagradas Escrituras. Quando o ministério se afasta do fundamento bíblico, ele se torna vulnerável ao orgulho, ao esgotamento emocional e à apostasia moral.
O modelo bíblico de liderança exige constante abnegação, humildade sincera e obediência à Palavra de Deus. A cultura moderna valoriza a autoafirmação e o domínio sobre os outros, enquanto o Evangelho exige o exato oposto: o abaixamento pessoal para a exaltação do nome de Cristo. Em Filipenses 2, o apóstolo Paulo apresenta o padrão de atitude para o líder cristão ao escrever: Nada façais por contenda ou por vanglória, mas por humildade; cada um considere os outros superiores a si mesmo.
A liderança serva, ensinada e encarnada por Jesus Cristo, estabelece o divisor de águas entre a religiosidade e o verdadeiro discipulado. Em Marcos 10, diante da disputa dos discípulos por posições de honra no Reino, Jesus corrige drasticamente a mentalidade deles, afirmando que na comunidade da fé a regra é inversa: quem quiser ser o primeiro deverá ser o servo de todos. E Ele conclui: Pois o próprio Filho do Homem não veio para ser servido, mas para servir e dar a sua vida em resgate de muitos.
Outro pilar bíblico indispensável é a responsabilidade do encadeamento geracional do ensino, expresso de forma magistral em 2 Timóteo 2:2, estabelecendo uma cadeia contínua de guardiões da sã doutrina.""",

    "faixa_05.mp3": """CAPÍTULO 4. Ferramentas para Formação de Líderes.
A formação de novos vocacionados no Corpo de Cristo é uma tarefa que exige intenção deliberada, paciência pedagógica e acompanhamento constante. Não se formam obreiros maduros exclusivamente por meio de aulas teóricas ou grandes eventos de massa. O amadurecimento espiritual e ministerial acontece na vivência diária, no compartilhamento das lutas e na aplicação prática das verdades bíblicas.
Entre as ferramentas essenciais, destacam-se:
Mentoria em Dupla e Acompanhamento Pessoal. Inspirada na prática do próprio Senhor Jesus, que enviou os discípulos de dois em dois, e no modelo apostólico de Paulo. A mentoria cria um espaço seguro para a prestação de contas, a oração conjunta, a correção amorosa e o encorajamento mútuo.
Estudos Bíblicos Semanais com Foco na Prática Ministerial. Reuniões periódicas estruturadas não apenas para o acúmulo de conhecimentos teológicos, mas para a aplicação direta das doutrinas à vida diária e ao serviço comunitário. A verdadeira maturidade bíblica se expressa no amor e na obediência.
Avaliação de Frutos e Discernimento Espiritual. Um processo de acompanhamento pautado na honestidade e na graça, onde a vida e o serviço do liderado são avaliados não pelo sucesso exterior ou carisma, mas pela manifestação dos frutos do Espírito Santo descritos em Gálatas 5: amor, alegria, paz, longanimidade, benignidade, bondade, fidelidade, mansidão e domínio próprio.
Planejamento Estratégico de Sucessão e Delegação Progressiva. A liderança madura antecipa o futuro e prepara intencionalmente os novos obreiros para assumirem responsabilidades crescentes. Delegar significa confiar autoridade acompanhada de mentoria contínua.""",

    "faixa_06.mp3": """CAPÍTULO 5. Vivendo para o Legado.
O teste derradeiro do ministério cristão não se mede durante o período em que o líder ocupa o centro do púlpito ou detém a autoridade formal sobre a instituição. O verdadeiro teste do ministério se revela no estado em que a igreja ou a obra permanecem após a sua saída. Se a comunidade entrar em colapso espiritual ou institucional quando o líder se afasta, fica demonstrado que ele edificou um monumento ao seu próprio nome, e não o Reino de Deus.
Viver para o legado exige a profunda compreensão de que somos apenas mordomos de uma obra que pertence exclusivamente ao Senhor. O objetivo central de quem vive para o legado é plantar sementes espirituais que continuarão germinando e dando frutos por muitas gerações.
O Senhor Jesus deixou o exemplo supremo dessa postura. Durante três anos e meio, investiu a maior parte de seu tempo e energia na formação intensiva de doze homens simples. Ao ascender aos céus, não deixou um livro escrito, um edifício construído ou uma estrutura política montada; deixou uma comunidade viva de discípulos inflamados pelo Espírito Santo, capacitados para dar continuidade ao Evangelho até os confins da terra.
O apóstolo Paulo também encerrou sua carreira com essa convicção serena de dever cumprido. Ao escrever sua última carta na prisão em Roma, ele declara em 2 Timóteo: Combati o bom combate, acabei a carreira, guardei a fé. Sua única preocupação era que a mensagem da cruz continuasse sendo proclamada com fidelidade inegociável.""",

    "faixa_07.mp3": """CAPÍTULO 6. Autoliderança e Vida Devocional.
A vida ministerial autêntica se sustenta naquilo que é cultivado na intimidade com Deus, longe dos olhares públicos e dos aplausos dos homens. Antes de ter a pretensão de guiar uma igreja, aconselhar famílias ou liderar equipes de trabalho, o pastor precisa aprender a governar os seus próprios afetos, pensamentos, hábitos e disciplinas espirituais. O líder que negligencia o cuidado com o seu próprio coração torna-se incapaz de conduzir outros com integridade.
A primeira e mais difícil pessoa que um líder precisa aprender a liderar é a si mesmo. Sem autoliderança fundamentada na graça, a vida ministerial converte-se rapidamente em ativismo eclesiástico estéril, onde o obreiro realiza a obra de Deus enquanto perde o contato íntimo com o Deus da obra. O apóstolo Paulo compreendia a gravidade desse risco ao registrar: Antes, subjugo o meu corpo e o reduzo à sujeição, para que, pregando a outros, eu mesmo não venha a ser desqualificado.
A vida devocional diária constitui o combustível indispensável para o exercício do ministério. A oração fervorosa mantém a alma sensível à voz do Espírito Santo; a meditação diária e sistemática na Palavra renova a mente e concede sabedoria para as decisões pastorais; o jejum mortifica a carne e disciplina os desejos.
Jesus Cristo é o nosso modelo supremo de autoliderança devocional. Mesmo vivendo cercado por multidões sequiosas, enfrentando demandas extenuantes de cura e ensino que tomavam todo o seu dia, Ele fazia questão absoluta de se retirar para lugares desertos a fim de orar a sós com o Pai.""",

    "faixa_08.mp3": """CAPÍTULO 7 e 8. Liderança em Tempos de Crise e Relacionamentos e Conflitos.
O momento de crise não cria o caráter de um líder cristão; ele apenas revela publicamente aquilo que já estava consolidado ou escondido no interior do seu coração. Nos dias de calmaria e prosperidade, é relativamente simples manter a compostura e proferir discursos edificantes. Contudo, quando as tempestades da perseguição, da escassez financeira, da divisão comunitária ou do luto atingem a igreja, a firmeza e a fé do líder são submetidas ao teste do fogo.
Os verdadeiros líderes funcionam como termostatos e não como termômetros. O termômetro limita-se a registrar passivamente a temperatura do ambiente, enquanto o termostato altera e define o clima da sala. Em momentos de pânico ou incerteza, o líder espiritual não pode se deixar levar pelas instabilidades emocionais do grupo; ele precisa manter o olhar fixo na soberania de Deus, trazendo paz e clareza para a comunidade.
O exercício da liderança eclesiástica é essencialmente uma atividade relacional. Liderar é lidar continuamente com pessoas reais, marcadas por histórias diferentes, personalidades distintas e imaturidades espirituais. Onde há seres humanos convivendo de forma próxima, o aparecimento de desacordo e tensão é inevitável. O grande diferencial do líder espiritual não consiste na ausência de conflitos, mas na forma madura, bíblica e graciosa como ele conduz a reconciliação.
O líder que deseja promover a paz em sua equipe precisa cultivar a disciplina de escutar com atenção antes de emitir julgamentos apressados, falar a verdade revestida de amor e praticar o perdão sistemático conforme o ensinamento de Jesus.""",

    "faixa_09.mp3": """CAPÍTULO 9 e 10. Visão Ministerial e Formação de Equipes.
Todo líder chamado por Deus necessita receber do Espírito Santo uma visão ministerial clara, ou seja, a percepção de para onde a igreja deve caminhar e quais são as prioridades registradas no coração do Pai para a comunidade local naquele momento histórico. Contudo, ter uma visão espiritual sem possuir um planejamento estratégico adequado equivale a cultivar apenas um sonho bonito sem eficácia prática. A inspiração divina não elimina a necessidade do trabalho organizado.
Provérbios nos adverte: Não havendo visão, o povo se corrompe. A visão ministerial atua como um farol que ilumina o caminho, consolida o propósito comunitário e mobiliza os membros para a ação. Quando o líder consegue articular a visão com clareza biblicamente fundamentada, a igreja responde com compromisso e entusiasmo no serviço.
A liderança cristã autêntica recusa terminantemente a tentação da centralização e do isolamento. O modelo bíblico de ministério é essencialmente comunitário e multiplicador. O próprio Senhor Jesus optou por não exercer seu ministério de forma solitária. Ele chamou doze homens para estarem com Ele, conviverem no cotidiano e serem instruídos para dar continuidade à sua missão no mundo.
A estrutura de uma equipe ministerial saudável exige o discernimento cuidadoso das vocações conferidas pelo Espírito Santo a cada membro, garantindo que cada um sirva na área onde pode frutificar com alegria. Exige também um treinamento contínuo, delegação real de autoridade acompanhada de mentoria amorosa e, acima de tudo, o cultivo de uma cultura eclesial marcada pela honra mútua e pela ausência de competição.""",

    "faixa_10.mp3": """CONCLUSÃO. O Legado que Permanece.
Ao chegarmos ao término desta jornada de reflexão sobre os princípios da liderança cristã fundamentada no caráter, no serviço e na maturidade, renovamos o convite para uma entrega irrestrita da nossa vida ao Senhor Jesus Cristo.
A liderança no Reino de Deus jamais será medida pelo número de aplausos recebidos dos homens, pela imponência de edifícios construídos ou pelo prestígio social alcançado. A única medida válida da liderança eclesiástica é a fidelidade à Palavra de Deus e a permanência dos frutos espirituais gerados nas vidas que nos foram confiadas.
Que o Senhor da ceifa forje em nós um coração humilde, disposto a servir no secreto com absoluta integridade, a caminhar em verdadeira cumplicidade e fraternidade com nossos irmãos no ministério, e a trabalhar incansavelmente para edificar um legado espiritual que glorifique ao Pai por toda a eternidade.
Que a nossa paixão diária seja diminuir a cada dia, servir com alegria e desaparecer completamente para que unicamente a pessoa e a glória de Jesus Cristo apareçam.
A Ele seja a glória na Igreja e em Cristo Jesus, por todas as gerações, para todo o sempre. Amém."""
}

async def generate_all():
    output_dir = os.path.join(os.path.dirname(__file__), "assets", "audiobooks", book_id)
    os.makedirs(output_dir, exist_ok=True)
    
    for filename, text in chapters.items():
        output_path = os.path.join(output_dir, filename)
        print(f"Gerando {filename}...")
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_path)
    
    print("Processamento LIDERANCA concluído com sucesso!")

if __name__ == "__main__":
    asyncio.run(generate_all())

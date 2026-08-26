import asyncio
import edge_tts
import os

# Dados do livro "Transformando Hábitos"
book_id = "habitos-fem"
voice = "pt-BR-FranciscaNeural"

chapters = {
    "faixa_01.mp3": """CAPÍTULO 1. A Anatomia dos Hábitos, o Mecanismo Oculto e a Matriz do Coração.
Hábitos não são meras escolhas casuais do cotidiano; são a própria arquitetura invisível sobre a qual a existência humana é construída. Tudo o que você faz de forma recorrente — desde a postura corporal ao responder a uma crítica até a primeira reação biológica ao ouvir o despertador — é governado por um sistema de automação neurológica profundamente refinado.
Estudos de neurociência comportamental indicam que mais de 40% das ações diárias de um indivíduo não são decisões conscientes, mas sim automações operadas pelos gânglios da base, uma estrutura subcortical antiga do cérebro. Essa economia cognitiva é o que permite ao ser humano realizar tarefas complexas enquanto reflete sobre o futuro ou processa ideias abstratas.
Na antropologia judaico-cristã, essa dimensão enraizada do comportamento conecta-se com o conceito bíblico de coração. Longe de significar apenas emoções poéticas, o coração nas Escrituras representa o centro executivo e moral do ser humano — a sede de onde fluem vontades, inclinações e padrões automatizados da vida.
O cultivo de hábitos sem discernimento espiritual entrega o controle do coração a estímulos e gatilhos caóticos do ambiente.
A formação e a manutenção de qualquer hábito obedecem a uma engrenagem invariável de três etapas fundamentais:
1. Gatilho: É o catalisador do comportamento. Pode ser interno ou externo. O gatilho avisa o cérebro que ele pode entrar em modo automático.
2. Rotina: É o comportamento em si, podendo ser uma ação física, mental ou emocional. É a resposta aprendida que o organismo executa automaticamente ao detectar o gatilho.
3. Recompensa: É o prêmio recebido pela execução da rotina. Envolve a liberação de neurotransmissores como a dopamina. A recompensa valida a eficiência do circuito, sinalizando ao cérebro para fixá-lo.
Teologicamente, Santo Agostinho observou que o coração humano é inquieto e busca incansavelmente repouso e satisfação. Quando a recompensa buscada serve apenas para anestesiar dores da alma ou preencher vazios existenciais, o mecanismo torna-se a base biológica de uma idolatria funcional.
A criação de hábitos é uma bênção da criação para a preservação de energia. Contudo, essa mesma eficiência torna-se um cativeiro quando alimentada por estímulos modernos hiper normalizados. O cérebro não possui discernimento moral próprio; ele otimiza o que é repetido. Cabe à razão iluminada pelas Escrituras exercer o papel de curadoria sobre o que é automatizado.""",

    "faixa_02.mp3": """CAPÍTULO 2. Diagnóstico Comportamental: A Mapeação dos Padrões, Ganhos Secundários e Ídolos do Coração.
Não é possível transformar o que não se compreende com exatidão. O erro mais comum nas tentativas de mudança comportamental é o combate direto à superfície do hábito, sem antes diagnosticar os elementos subterrâneos que o sustentam: o gatilho exato, o ganho secundário real e a inclinação afetiva do coração.
Nenhum comportamento indesejado persiste sem entregar uma vantagem imediata ao organismo. Na psicologia comportamental, isso é denominado ganho secundário. Mesmo hábitos que geram destruição a longo prazo oferecem um benefício no curto prazo — geralmente a redução da ansiedade, a esquiva do sentimento de incompetência ou uma sensação temporária de controle e alívio.
Na teologia bíblica, todo pecado e vício enraizado é alimentado por um ídolo do coração — algo criado em que confiamos para nos dar segurança, aceitação, alívio ou significado fora de Deus. O ganho secundário neuroquímico é a manifestação física dessa busca por refúgio em cisternas rotas.
Para mapear um comportamento indesejado de forma cirúrgica e sincera, o indivíduo deve submeter suas condutas a quatro perguntas de auditoria:
1. Gatilho Temporal e Sensorial: Qual é o momento e o contexto exatos em que a atração pelo comportamento se manifesta?
2. Gatilho Emocional e Interno: Que estado emocional específico antecede a execução da rotina?
3. O Ambiente Físico-Social: Onde a conduta ocorre e quem são as companhias ou influências presentes?
4. O Ganho Secundário Real: O que o cérebro e a alma realmente obtêm após a conclusão da ação?""",

    "faixa_03.mp3": """CAPÍTULO 3. Arquitetura de Objetivos, Intenção, Design Ambiental e a Guardaria dos Sentidos.
A motivação é um estado emocional passageiro; confiar nela para sustentar transformações duradouras é uma falha de engenharia. Pessoas que mantêm disciplina constante não possuem necessariamente mais força de vontade; elas constroem ambientes físicos e estruturas operacionais onde a necessidade de decisões conscientes é minimizada.
A maioria das tentativas de mudança falha porque permanece no nível das aspirações vagas. Para estruturar uma mudança real, é preciso avançar por três camadas de clareza: Desejo, Meta e Intenção de Implementação.
O ambiente físico e digital em que vivemos molda nossas escolhas. Se a opção mais fácil no ambiente for a mais destrutiva, eventualmente cederemos ao cansaço. A lei do atrito dita:
Para cultivar um bom hábito, diminua o atrito ao mínimo. Deixe os livros de estudo abertos, prepare as roupas de treino na véspera, coloque a Bíblia visível sobre o local de trabalho.
Para eliminar um mau hábito, aumente o atrito ao máximo. Desconecte aplicativos de redes sociais, coloque senhas complexas, guarde dispositivos longe do quarto de dormir.
Essa engenharia do ambiente ecoa com precisão os conselhos da sabedoria bíblica. O Salmo 1 adverte sobre não andar no conselho dos ímpios nem deter-se no caminho dos pecadores. Provérbios 22 declara: O prudente vê o mal e esconde-se; mas os simples passam e sofrem a pena. Modificar o ambiente para evitar a tentação é a aplicação prática da prudência ensinada por Jesus.""",

    "faixa_04.mp3": """CAPÍTULO 4. Engenharia da Transformação: A Lei da Substituição e a Teologia do Despojar-se e Vestir-se.
A neurociência comprova que os circuitos neurais de hábitos consolidados raramente são extintos por completo. Sob estresse, o cérebro recorre automaticamente às vias mais antigas e calçadas. Tentar banir um comportamento apenas reprimindo o pensamento costuma gerar o efeito rebote, levando a recaídas intempestivas.
A estratégia de maior êxito na reconfiguração comportamental consiste em manter o Gatilho original e a Recompensa desejada, enquanto se introduz uma Nova Rotina entre eles. Se o gatilho do estresse no fim da tarde exige alívio, a rotina de consumo prejudicial pode ser substituída por uma caminhada vigorosa, oração contemplativa ou chá natural.
Esse método de substituição é a exata tradução biopsicológica do ensinamento do apóstolo Paulo sobre a vida cristã em Efésios 4. Paulo explica que a santificação não consiste em um vácuo moral, mas em uma troca intencional: despojar-se do velho homem e vestir-se do novo homem.
A estrutura de transformação desdobra-se em três passos:
1. Despojar-se: Reconhecer e interromper a conduta destrutiva.
2. Renovar a Mente: Compreender as necessidades reais e alinhar os pensamentos à verdade.
3. Vestir-se: Praticar uma ação construtiva que atenda ao propósito de glorificar a Deus e edificar a vida.""",

    "faixa_05.mp3": """CAPÍTULO 5. Psicologia Interna: Força de Vontade, Neuroplasticidade e a Renovação da Mente.
A força de vontade funciona como uma reserva de energia finita: ela se desgasta à medida que é utilizada ao longo do dia. Cada decisão tomada consome glicose e energia metabólica no córtex pré-frontal, fenômeno conhecido na psicologia como Fadiga de Decisão.
O cérebro possui a capacidade notável de alterar sua estrutura e conexões ao longo de toda a vida em resposta às experiências e à repetição contínua: a neuroplasticidade. Segundo a Lei de Hebb, neurônios que disparam juntos, conectam-se juntos. A repetição de uma nova conduta cria caminhos neurais progressivamente mais fortes.
No início, praticar uma nova disciplina parece uma estrada de terra acidentada, pois exige esforço consciente e alto consumo de energia. Com a prática constante, essa via transforma-se em uma autoestrada asfaltada, tornando a ação fluida e automática.
A fragilidade da força de vontade humana confirma o ensino de Jesus: O espírito, na verdade, está pronto, mas a carne é fraca. Depender exclusivamente da força do ego humano para vencer hábitos arraigados gera esgotamento e frustração.
A verdadeira renovação da mente envolve a cooperação entre o esforço humano responsável e a ação do Espírito Santo, que produz o domínio próprio.""",

    "faixa_06.mp3": """CAPÍTULO 6. Construção e Sustentação de Rotinas Inabaláveis e a Disciplina da Constância.
A consistência supera a intensidade na construção de resultados duradouros. Um treino modesto ou uma leitura diária de vinte minutos mantidos por cinco anos geram transformações exponencialmente maiores do que maratonas extremas mantidas por poucas semanas.
Para integrar novas condutas sem sobrecarregar a rotina, utiliza-se a Técnica de Empilhamento de Hábitos, ancorando o novo comportamento em um hábito já profundamente consolidado.
Por exemplo: Logo após servir a primeira xícara de café da manhã, lerei o Salmo do dia e farei cinco minutos de oração. Outro exemplo: Assim que desligar o computador no fim do expediente, vestirei a roupa de treino e farei trinta minutos de exercício.
A Bíblia destaca a importância da constância estruturada nas rotinas de fé. O profeta Daniel mantinha o hábito inabalável de orar em seu quarto três vezes ao dia, uma rotina tão ancorada que nem mesmo decretos reais puderam desestabilizar.
Da mesma forma, a Palavra nos exorta: E não nos cansemos de fazer o bem, porque a seu tempo ceifaremos, se não houvermos desfalecido.""",

    "faixa_07.mp3": """CAPÍTULO 7. Resiliência, Gestão de Recaídas e a Teologia da Graça e Restauração.
A jornada de mudança comportamental não é uma linha reta ascendente, mas um processo marcado por oscilações, platôs e eventuais falhas. A diferença crucial entre indivíduos que consolidam transformações e aqueles que retornam aos velhos padrões está na velocidade de recuperação após um deslize.
A Regra de Ouro é: Nunca Erre Duas Vezes Seguidas.
Um único erro é um evento isolado; dois erros consecutivos representam o início de um novo hábito indesejado. O maior perigo do erro não é o impacto pontual da falha, mas a armadilha cognitiva conhecida como Efeito Certo que Se Dane, onde um pequeno desvio leva o indivíduo a abandonar todo o sistema por culpa e desespero.
O desespero após a falha advém do legalismo ou do orgulho próprio. A Bíblia oferece uma teologia libertadora de resiliência baseada na graça perdoadora de Deus. Provérbios afirma: Porque sete vezes cairá o justo, e se levantar; mas os ímpios tropeçarão no mal.
Quando ocorre um deslize, o cristão não deve capitular nem se entregar à autocondenação desmedida, mas recorrer ao arrependimento imediato, receber o perdão em Cristo e reestabelecer a rotina de execução sem demorar. A graça não é licença para o erro, mas o solo firme que permite levantar e continuar a caminhada.""",

    "faixa_08.mp3": """CAPÍTULO 8. A Base Biológica da Performance: O Corpo como Templo do Espírito Santo.
É uma ilusão tentar construir uma mente disciplinada, focada e espiritualmente madura sobre uma estrutura biológica cronicamente negligenciada. A regulação emocional, a clareza cognitiva e o controle dos impulsos dependem diretamente do estado de saúde física do organismo.
Os Três Pilares Fisiológicos da Performance são:
1. A Arquitetura do Sono: O sono adequado promove a consolidação da memória, a depuração de resíduos metabólicos e a restauração da capacidade do córtex pré-frontal. A privação crônica do sono reduz o controle executivo do cérebro e hiperativa a amígdala.
2. Nutrição e Estabilidade Glicêmica: Refeições ricas em açúcares geram picos de insulina seguidos de hipoglicemia reativa, resultando em fadiga, névoa mental e compulsão.
3. Movimento e Saúde Neuroquímica: O exercício físico regular atua como um potente fertilizante cerebral, promovendo neuroplasticidade, aprendizado e redução de ansiedade.
Nas Escrituras, o corpo não é uma prisão da alma, mas criação digna de Deus e habitáculo do Espírito Santo. Negligenciar o sono por ganância ou trabalhar sem pausas reflete uma falta de confiança na providência divina, enquanto o descanso adequado reconhece que Deus governa o mundo enquanto dormimos.""",

    "faixa_09.mp3": """CAPÍTULO 9. Produtividade Profunda, Gestão de Energia e a Redenção do Tempo.
Em uma era saturada de notificações, ruído digital e interrupções constantes, a capacidade de manter atenção sustentada em tarefas de alto valor tornou-se uma virtude rara e valiosa. O conceito de Trabalho Profundo refere-se à habilidade de focar sem distrações em uma atividade cognitivamente exigente.
A neurociência comprova que o cérebro não realiza multitarefa cognitiva em paralelo. O que chamamos de multitarefa é uma alternância rápida de foco que deixa um resíduo de atenção na tarefa anterior. Esse hábito fragmenta a inteligência, reduz drasticamente a qualidade do trabalho e gera exaustão mental prematura.
Para mitigar esse custo, recomenda-se a técnica dos Blocos Ininterruptos: períodos de sessenta a noventa minutos de foco absoluto com notificações desativadas. Essa prática conecta-se ao mandamento apostólico de Efésios 5: Portanto, vede prudentemente como andais, não como néscios, mas como sábios, remindo o tempo; porquanto os dias são maus.
Remir o tempo significa resgatá-lo da futilidade e do desperdício para dedicá-lo com excelência ao trabalho e ao reino de Deus, trabalhando como de coração ao Senhor.""",

    "faixa_10.mp3": """CAPÍTULO 10. A Dinâmica Social, Relações e a Comunidade da Fé.
Os seres humanos são criaturas sociais moldadas pelas pessoas com quem convivem. A neurociência e a sociologia comprovam o fenômeno do contágio social: padrões de saúde, níveis de ambição, vocabulário e até hábitos de consumo espalham-se por redes relacionais.
Se o seu círculo social imediato normaliza o sedentarismo, a murmuração diária e a distração contínua, manter um estilo de vida focado e disciplinado exigirá um esforço heroico contra a correnteza do grupo. A escolha de ambientes sociais não é apenas uma decisão de lazer, mas uma decisão de arquitetura comportamental.
A Escritura antecipou essa realidade há milênios: O que anda com os sábios ficará sábio, mas o companheiro dos tolos será destruído. As más conversações corrompem os bons costumes. No entanto, o cristão não deve apenas isolar-se, mas buscar ativamente a comunidade da fé para encorajamento mútuo: E consideremo-nos uns aos outros, para nos estimularmos ao amor e às boas obras.""",

    "faixa_11.mp3": """CAPÍTULO 11. O Modelo Mental de Alto Desempenho e a Mente de Cristo.
Indivíduos que sustentam alto nível de realização e maturidade ao longo de décadas compartilham modelos mentais sólidos que regem suas tomadas de decisão sob pressão.
Pessoas de alto desempenho operam sob o modelo de Lócus de Controle Interno: a convicção de que, embora não se possa controlar todas as variáveis externas, cada indivíduo é totalmente responsável por suas reações, escolhas e atitudes diante das circunstâncias. Esse modelo elimina a postura de vítima e promove o protagonismo consciente.
Teologicamente, o lócus de controle interno reflete a responsabilidade pessoal que cada ser humano possui diante de Deus. O cristão reconhece a soberania de Deus sobre a história, mas não utiliza a providência como desculpa para a preguiça ou omissão. Ele adota a Mente de Cristo — uma mentalidade caracterizada por humildade, serviço, resiliência no sofrimento e foco inabalável na missão.""",

    "faixa_12.mp3": """CAPÍTULO 12. Consolidação da Identidade e a Nova Criação em Cristo.
A transformação comportamental mais profunda e definitiva ocorre no nível da Identidade. Mudanças baseadas apenas em metas superficiais tendem a esvaziar-se quando a meta é alcançada. Mudanças enraizadas na identidade tornam-se permanentes porque expressam a autoimagem da pessoa.
Sua identidade é fortalecida pelas evidências diárias acumuladas por suas ações. Cada vez que você escolhe preparar uma refeição saudável, vota na sua identidade de pessoa saudável. Cada vez que senta para estudar ou orar no horário determinado, acumula evidências de que é alguém disciplinado e temente a Deus.
Para o cristão, essa revelação atinge seu ápice na verdade do Evangelho: nossa identidade primária não é construída pelo nosso esforço, mas nos é dada por Deus em Cristo. Assim que, se alguém está em Cristo, nova criatura é; as coisas velhas já passaram; eis que tudo se fez novo.
Os novos hábitos diários deixam de ser um fardo focado em tentar ganhar aprovação e passam a ser a expressão fluida, grata e alegre de quem já fomos feitos em Cristo. A engenharia comportamental torna-se, assim, o instrumento prático pelo qual vivemos de modo digno da nossa vocação celestial."""
}

async def generate_all():
    output_dir = os.path.join(os.path.dirname(__file__), "assets", "audiobooks", book_id)
    os.makedirs(output_dir, exist_ok=True)
    
    for filename, text in chapters.items():
        output_path = os.path.join(output_dir, filename)
        print(f"Gerando {filename}...")
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_path)
    
    print("Processamento concluído com sucesso!")

if __name__ == "__main__":
    asyncio.run(generate_all())

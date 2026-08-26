import asyncio
import edge_tts
import os

book_id = "discipulado-fem"
voice = "pt-BR-FranciscaNeural"

chapters = {
    "faixa_03.mp3": """PARTE 1. INTRODUÇÃO E PROPÓSITOS DO DISCIPULADO.
Apresentação. A presente obra, fruto da dedicação, esmero e entrega do Pastor Gilberto Penido Bertho, se constitui em um manual prático, com o objetivo fundamental de fornecer um vínculo entre discipulador e discipulando. Um material relevante e singular para ser aplicado no aperfeiçoamento dos santos, que muito contribuirá para acelerar o avanço do evangelho, na conquista de almas para o reino de Deus.
Nos últimos dias de treinamento de seus seguidores, Jesus deu ênfase à importância de se fazer discípulos. Hoje, temos o privilégio de fazer o mesmo. A maioria dos membros de nossas igrejas não faz discípulos porque não sabe como. O nosso objetivo é alcançar os que não têm muito tempo para serem treinados, mas desejam colaborar com o crescimento da Igreja.
O discipulado é um dos melhores meios para se alcançar uma pessoa para Jesus, pois ele tem por finalidade conduzir o indivíduo desde sua conversão, passando por sua completa integração à igreja e maturidade, quando estará frutificando.
A igreja deve oferecer um ambiente agradável, que demonstre amor, solidariedade e conforto. Os membros devem mostrar aos visitantes a diferença que existe naqueles que têm Cristo como Senhor de suas vidas. A nossa responsabilidade é levar o evangelho a todas as pessoas que perecem sem Cristo em nosso bairro, em nossa vizinhança e até mesmo dentro de nossas casas.
O que é um discípulo? É o aprendiz que segue o Mestre. E o que é o discipulado? É o ministério que ensina o crente a orar e a torná-lo um cristão maduro na fé. Quem deve ser um discípulo? Todo cristão comprometido com Jesus Cristo e sua igreja.""",

    "faixa_04.mp3": """PARTE 2. VISÃO GERAL DO DISCIPULADO E BASES BÍBLICAS.
Relacionamentos na igreja. Precisamos aprender a arte de viver na graça e criarmos um ambiente onde as pessoas sintam-se aceitas e amadas. O discipulador deve procurar não apenas fazer estudos bíblicos, mas também desenvolver companheirismo e cuidado.
A prioridade do discipulador. Jesus ordenou que seus apóstolos fizessem discípulos e lhes ensinassem a guardar todas as coisas que Ele tinha mandado. Ele queria que fizessem novos discípulos à sua semelhança. Nossa função no corpo de Cristo é capacitar os novos crentes para fazer a obra de Deus, sendo audaciosos no falar.
A estratégia do discipulado possui três fases: Indo, que é um método natural de ação contínua; Batizando; e Ensinando. O discipulado é permanente. Todos os dias, no templo e de casa em casa, não cessavam de ensinar e de anunciar a Jesus, o Cristo.
O discipulado bíblico nos dá várias razões para discipular: é a base inicial na formação cristã, é um mandamento de Jesus, contribui para o crescimento da Igreja, fortalece a fé do novo convertido e ajuda a compreender o propósito de Deus.
O mundo está dividido em três classes: os que fazem as coisas acontecerem, os que observam as coisas acontecerem, e os que não sabem o que está acontecendo. E há dois grupos de pessoas: as que criam problemas e as que solucionam problemas. A ordem de Jesus aos seus discípulos apresenta a única estratégia para crescimento da igreja em todos os tempos.""",

    "faixa_05.mp3": """PARTE 3. ETAPAS DO DISCIPULADO: PRÉ-EVANGELISMO.
O pré-evangelismo é o ministério de reduzir os impedimentos, a fim de que a pessoa compreenda o evangelho e receba Jesus como o seu Senhor e Salvador. Muitas pessoas têm impedimentos devido a mau testemunho, falta de interesse, falta de conhecimento da Bíblia ou porque foram criadas em outras religiões. Brigas e discussões também afastam as pessoas de Cristo.
Para reduzir os impedimentos, precisamos ganhar a amizade das pessoas e ensinar os fatos básicos do evangelho. O discipulador transforma seus contatos pessoais em oportunidades para fazer novas amizades.
Podemos realizar encontros semanais em grupos de comunhão, com mensagens rápidas e criativas de no máximo 25 minutos. As músicas devem ter um caráter espiritual e alegre. Para quebrar o gelo no início, faça dinâmicas e perguntas que estimulem o entrosamento.
A atividade principal do discipulador é fazer novas amizades, porque esta é a chave do evangelismo eficaz. Jesus fez novas amizades, Ele era chamado de amigo de publicanos e pecadores. A Bíblia diz que a igreja ganhou a amizade de todo o povo, e o Senhor lhes acrescentava dia a dia os que iam sendo salvos.
A Parábola do Semeador nos ensina que há corações como a beira do caminho, corações pedregosos, espinheiros e corações de terra boa. A nossa tarefa é preparar a terra com amizade.
No tocante aos visitantes na igreja, a regra de ouro é: as pessoas vão aonde são convidadas e ficam onde são bem tratadas. Os recepcionistas devem usar a regra dos três minutos para cumprimentar o visitante após o culto.""",

    "faixa_06.mp3": """PARTE 4. ETAPAS DO DISCIPULADO: EVANGELISMO PESSOAL.
Evangelismo pessoal. Quase todos os brasileiros creem em Deus e sabem que Jesus é Salvador, mas não sabem como ser salvos. Este método deve ser utilizado para compartilhar o evangelho em contatos pessoais.
O guia do discípulo é a sigla FIEL: Família, Interesses, Experiência Religiosa e Levantamento Espiritual. No levantamento espiritual, fazemos a pergunta: 'Se você morresse hoje, você tem certeza de que iria para o céu?' e depois perguntamos: 'Suponha que você estivesse diante de Deus e Ele perguntasse: por que deveria deixá-lo entrar no meu céu? O que você diria?'.
Depois, o discipulador compartilha seu Testemunho Pessoal. O propósito do testemunho é compartilhar a sua experiência pessoal de conversão. Ele é único, pessoal, e as pessoas gostam de ouvir histórias. Para compartilhar seu testemunho, seja breve, não pregue um sermão, use uma linguagem simples e seja positivo. O testemunho deve responder a quatro perguntas: Como era minha vida antes de receber Jesus? Como percebi que precisava aceitar Cristo? Onde e como eu aceitei Cristo? Como é minha vida hoje?
Em seguida, apresentamos o Plano de Salvação, com a explicação de versículos fundamentais como Romanos 3:23 (todos pecaram), Romanos 6:23 (o salário do pecado é a morte), e João 14:6 (Jesus é o único caminho). O objetivo é levar a pessoa à oração de entrega da sua vida a Jesus Cristo.""",

    "faixa_07.mp3": """PARTE 5. EVANGELISMO EM LIÇÕES E PÓS-EVANGELISMO.
Como Dirigir Estudo nos Lares. Ao conduzir o evangelismo em lições nas casas, a oração é a base inicial. O discipulador deve preparar-se com antecedência e não deve ser um debatedor de religião, mas um estudioso da Palavra. Evite o uso de palavras desconhecidas e não monopolize a conversa. Cada lição deve durar no máximo uma hora.
Após as lições iniciais, e uma vez que a pessoa compreenda a obra redentora de Jesus e decida aceitá-Lo, ela será orientada a dar testemunho público de sua fé através do batismo bíblico. O batismo não salva, mas é o símbolo da obediência e da nova vida em Cristo.
Pós-Evangelismo. A tarefa da Igreja é levar o novo convertido a ter maturidade cristã através da oração, leitura bíblica, cooperação nos cultos e fidelidade. A igreja precisa amar, ensinar e cuidar bem dos novos membros. A integração tem como finalidade levar o decidido a envolver-se completamente com o Reino de Deus. Os discipuladores atuarão como conselheiros imediatos para os que responderem aos apelos.
A igreja promoverá reuniões e cultos para apresentação e confraternização dos novos irmãos batizados. O cuidado deve continuar, inclusive com Visitas de Restauração para procurar as ovelhas afastadas e reintegrá-las à comunhão.
Por fim, o objetivo do discipulador é formar discípulos multiplicadores. A verdadeira liderança não apenas forma discípulos, mas ensina os discípulos a formarem outros discípulos, aplicando o princípio de 2 Timóteo 2:2. Assim, a Igreja continuará crescendo e cumprindo sua missão de fazer discípulos em todas as nações."""
}

async def generate_all():
    output_dir = os.path.join(os.path.dirname(__file__), "assets", "audiobooks", book_id)
    os.makedirs(output_dir, exist_ok=True)
    
    for filename, text in chapters.items():
        output_path = os.path.join(output_dir, filename)
        print(f"Gerando {filename}...")
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_path)
    
    print("Processamento DISCIPULADO concluído com sucesso!")

if __name__ == "__main__":
    asyncio.run(generate_all())

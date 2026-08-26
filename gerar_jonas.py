import asyncio
import edge_tts
import os

book_id = "jonas-fem"
voice = "pt-BR-FranciscaNeural"

chapters = {
    "faixa_01.mp3": """PREFÁCIO E INTRODUÇÃO.
Escrever sobre o livro de Jonas é aceitar o desafio de olhar além de uma das histórias mais conhecidas da Bíblia. Muitos conhecem Jonas como o profeta que fugiu de Deus ou como o homem que passou três dias no ventre de um grande peixe. No entanto, essas são apenas partes de uma narrativa muito maior. O verdadeiro tema deste livro é a extraordinária misericórdia de Deus.
Ao longo destas páginas, o leitor perceberá que Jonas não é apresentado como um herói perfeito, mas como um homem comum, com medos, conflitos, limitações e dificuldades semelhantes às nossas. Talvez seja justamente por isso que sua história continua tão atual.
Ao mesmo tempo, veremos um Deus que jamais desiste daqueles que chama. Um Deus que disciplina sem abandonar, corrige sem rejeitar e oferece novas oportunidades àqueles que se dispõem a ouvi-Lo.
Há livros da Bíblia que nos impressionam pelos grandes milagres. Outros nos ensinam profundas verdades doutrinárias. O livro de Jonas faz as duas coisas, mas vai além: ele confronta o nosso coração.
Ao estudar Jonas, percebi que sua maior batalha não foi contra a tempestade, nem dentro do ventre do peixe, nem diante dos habitantes de Nínive. Sua luta mais profunda aconteceu dentro do próprio coração — e é ali que Deus também deseja agir em nós.
Minha oração é que, ao concluir esta leitura, você compreenda melhor a grandeza da graça divina, ame mais as pessoas, sirva com maior dedicação e obedeça ao Senhor com alegria.""",

    "faixa_02.mp3": """CAPÍTULO 1. A Fuga de um Homem que Conhecia Demais o Coração de Deus.
Veio a palavra do Senhor a Jonas, filho de Amitai, dizendo: Levanta-te, vai à grande cidade de Nínive e clama contra ela, porque a sua malícia subiu até mim. Jonas, porém, se dispôs a fugir da presença do Senhor para Társis.
A fuga de Jonas não foi resultado de ignorância, mas de resistência. Ele não fugiu porque desconhecia Deus; fugiu porque conhecia o Seu caráter. Sabia que o Senhor é compassivo, misericordioso e pronto para perdoar aquele que se arrepende. No íntimo, temia que os habitantes de Nínive ouvissem a mensagem, se arrependessem e fossem alcançados pela graça divina.
Jonas não estava apenas rejeitando uma missão. Ele estava lutando contra a possibilidade de Deus demonstrar misericórdia aos seus inimigos. Nínive era a capital do Império Assírio, uma potência militar temida por sua extrema crueldade. Para um israelita, imaginar que Deus ofereceria perdão àquele povo parecia inadmissível.
Toda desobediência começa antes dos nossos pés. Ela nasce no coração. Antes de Jonas embarcar em um navio, ele já havia se afastado da vontade de Deus em seus pensamentos. O pecado sempre percorre esse caminho: primeiro enfraquece a convicção, depois compromete as escolhas e, por fim, produz consequências.
Jonas pagou a passagem. Fugir da vontade de Deus exige investimento. A história de Jonas nos ensina que não existe distância capaz de anular o chamado de Deus. Podemos nos afastar, mas jamais conseguiremos fugir dos olhos daquele que nos criou.""",

    "faixa_03.mp3": """CAPÍTULO 2. Três Dias na Escuridão: Quando Deus Nos Encontra no Fundo do Poço.
Na minha angústia clamei ao Senhor, e ele me respondeu; do ventre do abismo gritei, e tu ouviste a minha voz.
A fuga de Jonas parecia estar dando certo. O navio havia partido e Nínive ficava para trás. Mas há uma verdade que nenhum servo do Senhor deve esquecer: podemos fugir do lugar onde Deus nos chamou, porém jamais fugiremos do Deus que nos chamou.
Enquanto Jonas dormia profundamente, Deus preparou uma grande tempestade. Os marinheiros clamavam aos seus deuses enquanto lutavam pela sobrevivência. O capitão despertou Jonas: Como podes estar dormindo? Levanta-te e invoca o teu Deus! Um profeta precisava ser lembrado por um homem pagão de que era hora de orar.
Depois de lançarem sortes, Jonas confessou quem era e assumiu sua responsabilidade. O arrependimento começa quando deixamos de procurar culpados e reconhecemos nossa própria responsabilidade diante de Deus. Somente quando o lançaram ao mar, a tempestade cessou. E então o Senhor deparou um grande peixe para que tragasse Jonas.
O peixe não foi preparado para destruir Jonas. Foi preparado para salvá-lo. Durante três dias e três noites, no escuro, úmido e solitário ventre do peixe, Jonas voltou a orar. Quando finalmente compreendemos que o Senhor continua no controle, nossa oração deixa de ser um grito de desespero e passa a ser uma declaração de confiança.""",

    "faixa_04.mp3": """CAPÍTULO 3. O Maior Avivamento da História.
Veio a palavra do Senhor, segunda vez, a Jonas, dizendo: Levanta-te, vai à grande cidade de Nínive e proclama contra ela a mensagem que eu te digo.
Essas poucas palavras revelam o coração de Deus. O Senhor não desistiu de Jonas. O Deus da Bíblia é o Deus das segundas oportunidades. A graça de Deus não ignora o pecado, mas também não encerra a história de quem volta para Ele.
Desta vez, Jonas obedeceu. E a mensagem era curta: Ainda quarenta dias, e Nínive será subvertida. O texto bíblico registra algo extraordinário: Os ninivitas creram em Deus. Não disseram apenas que acreditavam na mensagem. Creram no próprio Deus. A transformação começou no coração.
Eles proclamaram um jejum e se vestiram de pano de saco. O rei desceu do trono e decretou que toda a população deveria abandonar a violência e se arrepender dos seus maus caminhos. O verdadeiro arrependimento nunca é apenas emocional. Ele produz mudança de comportamento.
Viu Deus o que fizeram, como se converteram do seu mau caminho; e Deus se arrependeu do mal que tinha dito lhes faria e não o fez. O juízo anunciado tinha como propósito conduzir ao arrependimento, e esse propósito foi alcançado. A justiça divina abriu espaço para a manifestação da misericórdia.""",

    "faixa_05.mp3": """CAPÍTULO 4. Quando o Profeta se Irrita com a Misericórdia de Deus.
Com isso, desgostou-se Jonas extremamente e ficou irado.
Enquanto o céu celebrava o arrependimento de Nínive, o coração do profeta se enchia de indignação. Jonas não se entristeceu porque sua pregação havia sido rejeitada. Entristeceu-se porque ela havia produzido o resultado esperado. A cidade foi poupada, e isso o incomodou profundamente.
Jonas orou ao Senhor revelando o motivo de sua fuga: Ah! Senhor! Não foi isso o que eu disse? Pois sabia que és Deus clemente, misericordioso, tardio em irar-se e grande em benignidade. Jonas não aceitava a possibilidade de Deus perdoar seus inimigos.
É possível conhecer a Deus sem possuir um coração semelhante ao dEle. Jonas era profeta, orava e servia, mas ainda carregava preconceitos e ressentimentos. Tomado pela frustração, chegou a pedir a própria morte.
Deus então preparou uma planta que fez sombra sobre o profeta, e Jonas experimentou alegria. No dia seguinte, Deus preparou um verme que secou a planta, e um vento quente que castigou Jonas, fazendo-o desejar morrer novamente.
Deus usou essas lições para perguntar: Tens compaixão da planta, que não te custou trabalho algum... e não hei de eu ter compaixão da grande cidade de Nínive, em que há mais de cento e vinte mil pessoas? O livro termina com essa pergunta, convidando o leitor a olhar para o próprio coração.""",

    "faixa_06.mp3": """CAPÍTULO 5 e 6. Nínive, A Cidade que Deus Não Desistiu de Amar, e Jonas e Jesus.
Deus enxergava além da história política. Enquanto Jonas via inimigos, Deus via pessoas. Enquanto Jonas desejava condenação, Deus oferecia uma oportunidade de salvação. Essa diferença revela um dos maiores contrastes entre a lógica humana e o coração de Deus.
O Filho do Homem veio buscar e salvar o que se havia perdido. Jesus é o cumprimento das promessas e a revelação completa da misericórdia de Deus. Ele não apenas pregou sobre a graça, Ele encarnou a graça. Não apenas anunciou o perdão, Ele conquistou o perdão na cruz.
Assim como Jonas esteve três dias e três noites no ventre do grande peixe, assim o Filho do Homem esteve no coração da terra. Jonas foi um sinal profético que encontra seu pleno significado em Cristo. Onde Jonas resistiu, Jesus Se entregou. Onde Jonas revelou as limitações humanas, Cristo revelou a perfeição do amor divino.
Toda a Bíblia aponta para Jesus. Ao estudarmos Jonas, devemos seguir até a cruz, onde a justiça e a misericórdia de Deus se encontram perfeitamente. Conhecer Jonas é importante, mas conhecer Jesus é indispensável.""",

    "faixa_07.mp3": """CAPÍTULO 7 e CONCLUSÃO. Jonas e a Igreja de Hoje: O Deus que Continua Chamando.
Ide por todo o mundo e pregai o evangelho a toda criatura. O mesmo Deus que chamou um profeta para anunciar Sua mensagem continua chamando Sua Igreja para cumprir a missão. O coração humano continua necessitando da mesma graça que alcançou os habitantes de Nínive.
O Evangelho é uma mensagem em movimento. Nossa responsabilidade é anunciar, pois o Espírito Santo é quem convence, transforma e salva. A transformação pertence a Deus. A missão que começou com Jonas continua nas mãos da Igreja.
Ao chegarmos ao final desta caminhada, percebemos que este livro nunca foi apenas sobre Jonas. É sobre um Deus soberano, que chama, corrige, restaura e concede novas oportunidades. A mesma voz continua chamando hoje. A pergunta que Deus ainda faz é: O seu coração está em harmonia com o Meu?
Que a nossa resposta seja simples, sincera e definitiva: Eis-me aqui. Envia-me. Que Deus encontre em nossa geração homens e mulheres dispostos a obedecer, amar e servir com o mesmo coração de Cristo."""
}

async def generate_all():
    output_dir = os.path.join(os.path.dirname(__file__), "assets", "audiobooks", book_id)
    os.makedirs(output_dir, exist_ok=True)
    
    for filename, text in chapters.items():
        output_path = os.path.join(output_dir, filename)
        print(f"Gerando {filename}...")
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_path)
    
    print("Processamento JONAS concluído com sucesso!")

if __name__ == "__main__":
    asyncio.run(generate_all())

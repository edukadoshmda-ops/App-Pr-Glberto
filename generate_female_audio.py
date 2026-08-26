# -*- coding: utf-8 -*-
import asyncio
import os
import edge_tts

VOICE = "pt-BR-FranciscaNeural"
OUTPUT_DIR = os.path.join("assets", "audiobooks", "discipulado-fem")

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
    }
]

async def generate_audio(track):
    output_path = os.path.join(OUTPUT_DIR, track["filename"])
    print(f"Gerando {track['filename']}...")
    communicate = edge_tts.Communicate(track["text"], VOICE, rate="+0%", pitch="+0Hz")
    await communicate.save(output_path)

async def main():
    print(f"Iniciando conversao TTS com voz: {VOICE}")
    for track in TRACKS:
        await generate_audio(track)

if __name__ == "__main__":
    asyncio.run(main())

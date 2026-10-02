# -*- coding: utf-8 -*-
"""
biblical_tts_normalizer.py
Normalizador fonético bíblico e de pontuação de oratória para síntese de voz (TTS).
Converte referências bíblicas, capítulos, versículos, numerais de livros e abreviações
em português falado natural com pausas e ritmo adequados.
"""

import re

# Mapeamento de abreviações e nomes de livros para pronúncia falada formal e reverente
BIBLE_BOOKS_MAP = {
    # Antigo Testamento
    r'\bGn\b': 'Gênesis',
    r'\bÊx\b': 'Êxodo',
    r'\bEx\b': 'Êxodo',
    r'\bLv\b': 'Levítico',
    r'\bNm\b': 'Números',
    r'\bDt\b': 'Deuteronômio',
    r'\bJs\b': 'Josué',
    r'\bJz\b': 'Juízes',
    r'\bRt\b': 'Rute',
    r'\b1\s*Sm\b': 'Primeiro livro de Samuel',
    r'\b2\s*Sm\b': 'Segundo livro de Samuel',
    r'\b1\s*Samuel\b': 'Primeiro Samuel',
    r'\b2\s*Samuel\b': 'Segundo Samuel',
    r'\b1\s*Rs\b': 'Primeiro livro dos Reis',
    r'\b2\s*Rs\b': 'Segundo livro dos Reis',
    r'\b1\s*Reis\b': 'Primeiro Reis',
    r'\b2\s*Reis\b': 'Segundo Reis',
    r'\b1\s*Cr\b': 'Primeiro livro das Crônicas',
    r'\b2\s*Cr\b': 'Segundo livro das Crônicas',
    r'\b1\s*Crônicas\b': 'Primeiro Crônicas',
    r'\b2\s*Crônicas\b': 'Segundo Crônicas',
    r'\bEd\b': 'Esdras',
    r'\bNe\b': 'Neemias',
    r'\bEt\b': 'Ester',
    r'\bSl\b': 'Salmo',
    r'\bSalmos\b': 'Salmos',
    r'\bPv\b': 'Provérbios',
    r'\bEc\b': 'Eclesiastes',
    r'\bCt\b': 'Cânticos',
    r'\bIs\b': 'Isaías',
    r'\bJr\b': 'Jeremias',
    r'\bLm\b': 'Lamentações',
    r'\bEz\b': 'Ezequiel',
    r'\bDn\b': 'Daniel',
    r'\bOs\b': 'Oseias',
    r'\bJl\b': 'Joel',
    r'\bAm\b': 'Amós',
    r'\bOb\b': 'Obadias',
    r'\bJn\b': 'Jonas',
    r'\bMq\b': 'Miqueias',
    r'\bNa\b': 'Naum',
    r'\bHc\b': 'Habacuque',
    r'\bSf\b': 'Sofonias',
    r'\bAg\b': 'Ageu',
    r'\bZc\b': 'Zacarias',
    r'\bMl\b': 'Malaquias',
    
    # Novo Testamento
    r'\bMt\b': 'Mateus',
    r'\bMc\b': 'Marcos',
    r'\bLc\b': 'Lucas',
    r'\bJo\b': 'João',
    r'\bAt\b': 'Atos dos Apóstolos',
    r'\bAtos\b': 'Atos',
    r'\bRm\b': 'Romanos',
    r'\b1\s*Co\b': 'Primeira carta aos Coríntios',
    r'\b2\s*Co\b': 'Segunda carta aos Coríntios',
    r'\b1\s*Coríntios\b': 'Primeira carta aos Coríntios',
    r'\b2\s*Coríntios\b': 'Segunda carta aos Coríntios',
    r'\bGl\b': 'Gálatas',
    r'\bEf\b': 'Efésios',
    r'\bFp\b': 'Filipenses',
    r'\bCl\b': 'Colossenses',
    r'\b1\s*Ts\b': 'Primeira carta aos Tessalonicenses',
    r'\b2\s*Ts\b': 'Segunda carta aos Tessalonicenses',
    r'\b1\s*Tessalonicenses\b': 'Primeira carta aos Tessalonicenses',
    r'\b2\s*Tessalonicenses\b': 'Segunda carta aos Tessalonicenses',
    r'\b1\s*Tm\b': 'Primeira carta a Timóteo',
    r'\b2\s*Tm\b': 'Segunda carta a Timóteo',
    r'\b1\s*Timóteo\b': 'Primeira carta a Timóteo',
    r'\b2\s*Timóteo\b': 'Segunda carta a Timóteo',
    r'\bTt\b': 'Tito',
    r'\bFm\b': 'Filemom',
    r'\bHb\b': 'Hebreus',
    r'\bTg\b': 'Tiago',
    r'\b1\s*Pe\b': 'Primeira carta de Pedro',
    r'\b2\s*Pe\b': 'Segunda carta de Pedro',
    r'\b1\s*Pedro\b': 'Primeira carta de Pedro',
    r'\b2\s*Pedro\b': 'Segunda carta de Pedro',
    r'\b1\s*Jo\b': 'Primeira carta de João',
    r'\b2\s*Jo\b': 'Segunda carta de João',
    r'\b3\s*Jo\b': 'Terceira carta de João',
    r'\b1\s*João\b': 'Primeira carta de João',
    r'\b2\s*João\b': 'Segunda carta de João',
    r'\b3\s*João\b': 'Terceira carta de João',
    r'\bJd\b': 'Judas',
    r'\bAp\b': 'Apocalipse',
}

# Lista ordenada de nomes canônicos para detecção em regex
BOOK_NAMES = [
    'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio',
    'Josué', 'Juízes', 'Rute', 'Primeiro Samuel', 'Segundo Samuel', '1 Samuel', '2 Samuel',
    'Primeiro Reis', 'Segundo Reis', '1 Reis', '2 Reis',
    'Primeiro Crônicas', 'Segundo Crônicas', '1 Crônicas', '2 Crônicas',
    'Esdras', 'Neemias', 'Ester', 'Jó', 'Salmos', 'Salmo', 'Provérbios',
    'Eclesiastes', 'Cânticos', 'Isaías', 'Jeremias', 'Lamentações',
    'Ezequiel', 'Daniel', 'Oseias', 'Joel', 'Amós', 'Obadias',
    'Jonas', 'Miqueias', 'Naum', 'Habacuque', 'Sofonias', 'Ageu',
    'Zacarias', 'Malaquias',
    'Mateus', 'Marcos', 'Lucas', 'João', 'Atos', 'Romanos',
    'Primeira carta aos Coríntios', 'Segunda carta aos Coríntios', '1 Coríntios', '2 Coríntios',
    'Gálatas', 'Efésios', 'Filipenses', 'Colossenses',
    'Primeira carta aos Tessalonicenses', 'Segunda carta aos Tessalonicenses', '1 Tessalonicenses', '2 Tessalonicenses',
    'Primeira carta a Timóteo', 'Segunda carta a Timóteo', '1 Timóteo', '2 Timóteo',
    'Tito', 'Filemom', 'Hebreus', 'Tiago',
    'Primeira carta de Pedro', 'Segunda carta de Pedro', '1 Pedro', '2 Pedro',
    'Primeira carta de João', 'Segunda carta de João', 'Terceira carta de João', '1 João', '2 João', '3 João',
    'Judas', 'Apocalipse'
]

def normalize_biblical_references(text: str) -> str:
    """
    Substitui padrões bíblicos de capítulo e versículo por pronúncia por extenso com vírgulas e pausas.
    Ex: 'Romanos 3:23' -> 'Romanos, capítulo 3, versículo 23'
    Ex: 'Mateus 28:19-20' -> 'Mateus, capítulo 28, versículos 19 ao 20'
    Ex: 'Romanos 10:9, 10' -> 'Romanos, capítulo 10, versículos 9 e 10'
    Ex: '2 Timóteo 2:2' -> 'Segunda carta a Timóteo, capítulo 2, versículo 2'
    """
    # 1. Primeiro expande abreviações seguidas de números de capítulo e versículo
    # Ex: Rm 3:23 -> Romanos 3:23, 2 Tm 2:2 -> 2 Timóteo 2:2, Sl 23:1 -> Salmo 23:1
    for pattern, replacement in BIBLE_BOOKS_MAP.items():
        text = re.sub(pattern + r'(?=\s+\d+[:\.]\d+)', replacement, text)

    # 2. Cria padrão de livros bíblicos
    escaped_books = [re.escape(b) for b in sorted(BOOK_NAMES, key=len, reverse=True)]
    books_regex = r'(' + '|'.join(escaped_books) + r')'

    # Padrão: Livro Cap:V1-V2 (ex: Mateus 28:19-20 ou Mateus 28:19 - 20)
    def repl_range(m):
        book = m.group(1).strip()
        cap = m.group(2).strip()
        v1 = m.group(3).strip()
        v2 = m.group(4).strip()
        book_clean = clean_book_name(book)
        return f"{book_clean}, capítulo {cap}, versículos {v1} ao {v2}"

    pattern_range = re.compile(books_regex + r'\s+(\d+)[:\.]\s*(\d+)\s*[-–—]\s*(\d+)', re.IGNORECASE)
    text = pattern_range.sub(repl_range, text)

    # Padrão: Livro Cap:V1, V2 (ex: Romanos 10:9, 10)
    def repl_multi(m):
        book = m.group(1).strip()
        cap = m.group(2).strip()
        v1 = m.group(3).strip()
        v2 = m.group(4).strip()
        book_clean = clean_book_name(book)
        return f"{book_clean}, capítulo {cap}, versículos {v1} e {v2}"

    pattern_multi = re.compile(books_regex + r'\s+(\d+)[:\.]\s*(\d+)\s*,\s*(\d+)', re.IGNORECASE)
    text = pattern_multi.sub(repl_multi, text)

    # Padrão: Livro Cap:V (ex: João 3:16 ou João 3.16 ou Êxodo 3:14)
    def repl_single(m):
        book = m.group(1).strip()
        cap = m.group(2).strip()
        v = m.group(3).strip()
        book_clean = clean_book_name(book)
        return f"{book_clean}, capítulo {cap}, versículo {v}"

    pattern_single = re.compile(books_regex + r'\s+(\d+)[:\.]\s*(\d+)', re.IGNORECASE)
    text = pattern_single.sub(repl_single, text)

    # Padrão: Livro Cap (quando seguido de parênteses ou vírgula, ex: Filipenses 2, Efésios 4)
    # Somente se seguido de vírgula ou parêntese ou final de frase, sem versículo
    def repl_cap_only(m):
        book = m.group(1).strip()
        cap = m.group(2).strip()
        book_clean = clean_book_name(book)
        return f"{book_clean}, capítulo {cap}"

    pattern_cap_only = re.compile(books_regex + r'\s+(\d+)(?=[,\.\;\)]|\s+o\s+apóstolo|\s+o\s+profeta|\s+o\s+evangelista)', re.IGNORECASE)
    text = pattern_cap_only.sub(repl_cap_only, text)

    # Normalizar qualquer ordinal restante
    text = re.sub(r'\b1\s*Timóteo\b', 'Primeira carta a Timóteo', text, flags=re.IGNORECASE)
    text = re.sub(r'\b2\s*Timóteo\b', 'Segunda carta a Timóteo', text, flags=re.IGNORECASE)
    text = re.sub(r'\b1\s*Coríntios\b', 'Primeira carta aos Coríntios', text, flags=re.IGNORECASE)
    text = re.sub(r'\b2\s*Coríntios\b', 'Segunda carta aos Coríntios', text, flags=re.IGNORECASE)
    text = re.sub(r'\b1\s*Tessalonicenses\b', 'Primeira carta aos Tessalonicenses', text, flags=re.IGNORECASE)
    text = re.sub(r'\b2\s*Tessalonicenses\b', 'Segunda carta aos Tessalonicenses', text, flags=re.IGNORECASE)
    text = re.sub(r'\b1\s*Pedro\b', 'Primeira carta de Pedro', text, flags=re.IGNORECASE)
    text = re.sub(r'\b2\s*Pedro\b', 'Segunda carta de Pedro', text, flags=re.IGNORECASE)
    text = re.sub(r'\b1\s*João\b', 'Primeira carta de João', text, flags=re.IGNORECASE)
    text = re.sub(r'\b2\s*João\b', 'Segunda carta de João', text, flags=re.IGNORECASE)
    text = re.sub(r'\b3\s*João\b', 'Terceira carta de João', text, flags=re.IGNORECASE)
    text = re.sub(r'\b1\s*Samuel\b', 'Primeiro livro de Samuel', text, flags=re.IGNORECASE)
    text = re.sub(r'\b2\s*Samuel\b', 'Segundo livro de Samuel', text, flags=re.IGNORECASE)
    text = re.sub(r'\b1\s*Reis\b', 'Primeiro livro dos Reis', text, flags=re.IGNORECASE)
    text = re.sub(r'\b2\s*Reis\b', 'Segundo livro dos Reis', text, flags=re.IGNORECASE)
    text = re.sub(r'\b1\s*Crônicas\b', 'Primeiro livro das Crônicas', text, flags=re.IGNORECASE)
    text = re.sub(r'\b2\s*Crônicas\b', 'Segundo livro das Crônicas', text, flags=re.IGNORECASE)

    return text

def clean_book_name(name: str) -> str:
    """Padroniza nome do livro para pronúncia pastoral clara."""
    mapping = {
        '1 Timóteo': 'Primeira carta a Timóteo',
        '2 Timóteo': 'Segunda carta a Timóteo',
        '1 Coríntios': 'Primeira carta aos Coríntios',
        '2 Coríntios': 'Segunda carta aos Coríntios',
        '1 Tessalonicenses': 'Primeira carta aos Tessalonicenses',
        '2 Tessalonicenses': 'Segunda carta aos Tessalonicenses',
        '1 Pedro': 'Primeira carta de Pedro',
        '2 Pedro': 'Segunda carta de Pedro',
        '1 João': 'Primeira carta de João',
        '2 João': 'Segunda carta de João',
        '3 João': 'Terceira carta de João',
        '1 Samuel': 'Primeiro livro de Samuel',
        '2 Samuel': 'Segundo livro de Samuel',
        '1 Reis': 'Primeiro livro dos Reis',
        '2 Reis': 'Segundo livro dos Reis',
        '1 Crônicas': 'Primeiro livro das Crônicas',
        '2 Crônicas': 'Segundo livro das Crônicas',
    }
    return mapping.get(name, name)

def refine_punctuation_and_cadence(text: str) -> str:
    """
    Refina a pontuação para que o narrador TTS faça as pausas corretas:
    - Transforma títulos ALL-CAPS em frases normais pontuadas.
    - Insere vírgulas e pontos em cabeçalhos de tópicos e listas.
    - Remove pontuações duplas acidentais geradas pela normalização (ex: '..', ',.').
    - Insere pausas após citações bíblicas.
    """
    lines = text.split('\n')
    processed_lines = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        # Transforma títulos completamente em caixa alta
        if stripped.isupper() and len(stripped) > 3:
            # Mantém "EU SOU" em destaque mas em minúsculas o resto
            words = stripped.split()
            norm_words = []
            for w in words:
                if w in ('EU', 'SOU'):
                    norm_words.append('Eu Sou')
                else:
                    norm_words.append(w.capitalize())
            stripped = ' '.join(norm_words)

        # Ajusta "CAPÍTULO X." para "Capítulo X."
        stripped = re.sub(r'^(capítulo|capitulo)\s+(\d+)', lambda m: f"Capítulo {m.group(2)}", stripped, flags=re.IGNORECASE)
        stripped = re.sub(r'^(parte)\s+(\d+)', lambda m: f"Parte {m.group(2)}", stripped, flags=re.IGNORECASE)
        stripped = re.sub(r'^(prefácio|apresentação|introdução|conclusão|epílogo)', lambda m: m.group(1).capitalize(), stripped, flags=re.IGNORECASE)

        # Se a linha termina sem pontuação, adiciona ponto final para forçar pausa no TTS
        if stripped and stripped[-1] not in ('.', '!', '?', ':', ';', '…'):
            stripped += '.'

        processed_lines.append(stripped)

    full_text = ' '.join(processed_lines)

    # Limpeza de pontuação duplicada
    full_text = re.sub(r'\.\s*\.', '.', full_text)
    full_text = re.sub(r',\s*\.', '.', full_text)
    full_text = re.sub(r':\s*\.', ':', full_text)
    full_text = re.sub(r'\s+', ' ', full_text)

    # Ajuste de parênteses com referências bíblicas: substituir por vírgulas de respiro
    # Ex: "(Romanos 3:23)" -> ", conforme Romanos, capítulo 3, versículo 23,"
    full_text = re.sub(r'\(([A-Za-zÀ-ÿ]+,\s*capítulo\s*\d+[^)]*)\)', r', conforme \1,', full_text)
    full_text = re.sub(r'\(([^)]+)\)', r', \1,', full_text)

    # Limpa vírgulas duplicadas, pontuações coladas ou espaços antes de pontuação
    full_text = re.sub(r'\s+,', ',', full_text)
    full_text = re.sub(r'\s+\.', '.', full_text)
    full_text = re.sub(r',\s*,', ',', full_text)
    full_text = re.sub(r',\s*\.', '.', full_text)
    full_text = re.sub(r'\s+', ' ', full_text).strip()

    return full_text

def normalize_text_for_tts(raw_text: str) -> str:
    """Executa o pipeline completo de preparação fonética bíblica e oratória."""
    step1 = normalize_biblical_references(raw_text)
    step2 = refine_punctuation_and_cadence(step1)
    return step2

if __name__ == "__main__":
    # Teste rápido
    sample = """
    PARTE 1. INTRODUÇÃO E PROPÓSITOS DO DISCIPULADO.
    Em Mt 28:19-20, Jesus ordenou que fossem por todo o mundo.
    Como diz Romanos 3:23 (todos pecaram) e Romanos 6:23 (o salário do pecado).
    Em 2 Tm 2:2 lemos sobre a multiplicação.
    O profeta em Jn 3:1-4 obedeceu ao Senhor.
    Leia também 1 Co 13:4-7 e Sl 23:1.
    """
    result = normalize_text_for_tts(sample)
    print("=== RESULTADO DO TESTE ===")
    print(result)

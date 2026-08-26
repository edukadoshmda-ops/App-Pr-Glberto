# -*- coding: utf-8 -*-
import asyncio
import sys
import os
import edge_tts

async def generate(text_file, voice, output_path):
    with open(text_file, 'r', encoding='utf-8') as f:
        text = f.read().strip()
    
    if not text:
        print("Texto vazio!")
        sys.exit(1)
        
    print(f"Gerando voz {voice} para {output_path}...")
    communicate = edge_tts.Communicate(text, voice, rate="+0%", pitch="+0Hz")
    await communicate.save(output_path)
    print("Salvo com sucesso!")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Uso: python tts_generator.py <text_file_path> <voice> <output_path>")
        sys.exit(1)
        
    text_file = sys.argv[1]
    voice = sys.argv[2]
    output_path = sys.argv[3]
    
    asyncio.run(generate(text_file, voice, output_path))

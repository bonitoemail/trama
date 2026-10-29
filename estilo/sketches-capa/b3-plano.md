# Rodada 3 · B3 "menos" — plano

Feito com as skills frontend-design (Anthropic) e design-skills (design-critique, design-elevation).

## Brief
- **Assunto:** simulação do Brasil até 2030 que começa na última notícia real.
- **Público:** gente comum, no celular, que não joga jogos.
- **Trabalho da capa:** em 5 segundos a pessoa entende "é uma simulação, começa nesta notícia, eu decido daqui" e toca no botão.
- **Fixo (escolha do usuário):** fundo escuro, título TRAMA em Unbounded com a luz verde e amarela, o "Agora" com a última notícia e o "?".

## Crítica da B2 (5 segundos, Nielsen H8, Krug)
- 14 elementos antes do primeiro toque; o foco se divide entre título, régua e cartão.
- Duas animações sem ação do usuário (luz no título e halo na régua).
- Três famílias de letra; o mono em caixa-alta em rótulos, datas e régua é o "ar técnico" que assusta.
- Kit de cartões: régua, Agora, fatos, portas e passos com a mesma borda e o mesmo raio, todos com o mesmo peso.
- Repetição: régua e cartão dizem "estamos aqui"; "Como funciona" e "Para que serve" explicam quase o mesmo.
- Marcas de página genérica (frontend-design): rótulo em caixa-alta em cima de tudo, "A · B", mono para dados, "→" nos botões, 01/02 em conteúdo que não é sequência.

## Tokens
- Cor (5): fundo `#111314`, texto `#ECE8DF`, texto-2 `#9D9A93`, linha `#26292B`, luz do título (verde `#2FAE5B`, amarelo `#F7D23E`). Sem laranja na capa: a única cor é a do título.
- Letra (2): Source Serif 4 para manchete e leitura; IBM Plex Sans para interface. Sem mono, sem caixa-alta fora do título. Datas com `tabular-nums`.
- Escala: 13 / 15 / 17 / 28 / título.
- Raio: só o botão (12px). Sem cartões; o espaço separa.

## Layout (uma coluna, igual no celular e no PC, PC só mais largo e arejado)
```
            TRAMA
  Simulação preditiva do Brasil até 2030

  Agora, 28 de outubro              (?)
  A carta muda: "líder do Brasil"
  congressoemfoco.com.br

  [  Continuar partida              ]
     Capítulo 1, A carta
     Começar outra partida

  Pela frente: eleição nos EUA em 3 nov.
  Faltam 3 anos e 11 meses para a eleição de 2030.
  ────────────────────────────────────
  O que já aconteceu            5  ▾
  Para que serve o Trama           ›
  Como fazemos as previsões        ›
  aviso
```
Alinhamento: título centralizado (regra do projeto); todo o resto à esquerda.

## Princípios
1. Ousadia num lugar só: o título. Todo o resto quieto.
2. A primeira tela tem 4 coisas: título, notícia, botão, e a linha do que vem.
3. A régua vira uma frase. A informação continua; o desenho sai.
4. O que é aprofundamento fica atrás de um toque (fatos, propósito, método).
5. "Como funciona" vai para "Para que serve", onde a pessoa já quis entender.
6. Única animação sem toque: a luz do título. O resto só responde a ação.

## Revisão contra o padrão genérico
- Fundo quase preto + um acento: é o padrão nº 2, mas foi pinado pelo usuário. Mantido, e o laranja sai para não somar um segundo acento.
- Removido: rótulos em caixa-alta, mono, "→" nos botões, cartões iguais, números em conteúdo que não é sequência (lentes). Mantidos números só nas etapas do método e nos passos (são sequência).
- Removido o "·" do subtítulo: vira frase.

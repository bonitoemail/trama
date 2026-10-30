# Revisão de cobertura das escolhas

- Etapa: Revisão
- Rodado em: 2026-10-29 (noite), no capítulo 3 (`<CAP>` = content/capitulos/cap03-a-posse.yaml; `<PESQUISA>` = pesquisa/11-cap03-posse-mesas.md e pesquisa/09-cap02-stf-senado.md). Resumo em `pesquisa/RODADAS.md`. Antes, era a versão fixa da auditoria só de leitura de 29/10/2026 (a primeira achou "quem fala pela direita" sem Tarcísio).
- Modelo: subagente do Claude Code
- Produziu: a resposta vai na conversa; o resumo entra em `pesquisa/RODADAS.md`

Roda no fim de cada lote de cenas novas e sempre que a pesquisa mudar. Troque `<CAP>` pelo arquivo do capítulo e `<PESQUISA>` pelos arquivos de pesquisa daquele capítulo.

````text
Revisão SÓ DE LEITURA do jogo Trama. Não edite, crie nem apague nenhum arquivo. Responda em português do Brasil. Os caminhos são relativos à raiz do repositório.

Trama é uma história ramificada sobre a política brasileira de out/2026 a 2030. Cada nó de decisão tem escolhas (`escolhas`, com `rotulo`). Sua tarefa é conferir se as escolhas de cada nó cobrem o que a pesquisa e o painel apontam.

Leia:
- o capítulo: <CAP>;
- a pesquisa: pesquisa/00-sintese.md, <PESQUISA> e pesquisa/RODADAS.md (fatos mais recentes);
- o painel: roteiro/painel/00-agregado.md e, se precisar, as lentes em roteiro/painel/;
- as regras: DESIGN.md seções 8 e 8.1.

O critério do projeto: liberdade do jogador vem antes de probabilidade. Cobertura quer dizer SOMAR o desfecho provável que falta, nunca TIRAR uma escolha improvável que as pessoas querem ver acontecer. Uma escolha improvável fica, desde que nenhum fato a desminta e o texto não afirme como fato o que é simulação.

Para CADA nó com escolhas:
1. Falta algum desfecho que a pesquisa trata como plausível (média ou alta) ou que o painel deu como consenso? Falta algum ator de peso, de qualquer campo? Quase sempre o que falta é o meio-termo ou o adiamento.
2. Algum fato da pesquisa ou de RODADAS desmente o texto, uma escolha ou o enquadramento do nó?
3. O texto afirma como fato algo que é só simulação, ou que a pesquisa não sustenta?
4. Duas escolhas quase se repetem?
Não aponte uma escolha como problema só por ser improvável. Não julgue estilo nem tom.

Cite o arquivo e a seção (ou a linha) que sustentam cada achado. Não invente nada; se a pesquisa não diz, diga que não diz.

Entregue uma tabela: nó | escolhas atuais | problema | gravidade (alta/média/baixa/nenhum) | evidência | sugestão (só a ideia). Inclua todos os nós de decisão. No fim, até 5 linhas com os achados mais graves.
````

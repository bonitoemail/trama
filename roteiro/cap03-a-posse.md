# Capítulo 3 — A posse (esqueleto e planilha)

> **Escrito em 29/10/2026** em `content/capitulos/cap03-a-posse.yaml`, como `rascunho: true`. Junta os caps. 3 ("A posse") e 4 ("As mesas") do esboço do painel (`painel/00-agregado.md`, Ato I): o cap. 2 já cobre o "Congresso que sai", e o que falta para fechar o Ato I é a posse (5/01) e as mesas (1º/02). Este arquivo fica como registro do desenho; a fonte de verdade é o YAML.

> Período: 5 de janeiro a 1º de fevereiro de 2027.
> Base: `pesquisa/11-cap03-posse-mesas.md`, `09-cap02-stf-senado.md`, painel P2, P16 e "a ironia do foro".

## A pergunta do capítulo

No último mandato de Lula, **quem ele começa a escolher para 2030** (a Fazenda), **quanto custa a base** (o Centrão) e **quem comanda o Congresso até 2029** (as mesas). No meio, Flávio perde o mandato e os casos dele podem sair do Supremo.

## Espinha (todo caminho passa por cinco decisões)

1. **abertura** (5/01, a posse). Fatos: EC 111/2021 (primeira posse em 5/01), art. 14, §5º (Lula não concorre em 2030), Alcolumbre e Motta na rampa a quatro semanas da própria eleição. Eco: a posse do "governo no exílio" em Miami (`governo_exilio`).
2. **a_fazenda** (P16, divergência do painel). Fonteles · Alckmin · Haddad · Durigan fica (o adiamento). Cada uma com cena própria: `o_herdeiro`, `o_vice_no_cofre`, `a_volta_de_haddad`, `o_tecnico`.
3. **o_ministerio** (o preço do Centrão; pendência dos leitores: "custo para o Centrão"). Cargos com cobrança de voto · cargos sem cobrança · parte guardada para depois de fevereiro (o meio-termo) · Centrão fora do núcleo.
4. **o_foro** (31/01; "a ironia do foro", painel 50%, atualizada pela baliza eleitoral de 22/05/2026). Tudo fica no Supremo · os casos de campanha descem · o Supremo só decide depois de fevereiro (o mais provável: prazos suspensos até 31/01).
5. **a_camara** (1º/02; fato novo de 29/10: o PL quer o bloco de Motta e o PT ameaça sair). PL entra e PT sai · PL fica fora · os dois no mesmo bloco, como em 2023 · troca Câmara por Senado (só quando há disputa no Senado).
6. **o_senado** (1º/02). Folga · apertado · a oposição vence (Tereza Cristina ou Marinho, conforme o cap. 2; só nos caminhos com disputa: `guerra_fevereiro`, `tereza_recusa`, `pl_rachado`).

## Finais (três)

- **o_ultimo_mandato**: Alcolumbre com folga. Planta o relógio de 2029 (agregado, 4.4: "em 2029, a cadeira não pode ser dele").
- **a_vitoria_apertada**: ganha devendo; a conta da traição cai no Centrão, conforme o preço pago em `o_ministerio`.
- **o_senado_da_oposicao**: a primeira derrota do quarto mandato; os pedidos de impeachment de ministros do Supremo passam a depender da oposição.

## Planilha (DESIGN 8.1, regra 16)

Campos: **Gov**, **PT** (base e bancada), **Centrão**, **Dir. mod.**, **Bolso.**, **STF**, **Alcol./Motta**.

| Nó / escolha | Ganha | Perde | Custo escondido |
|---|---|---|---|
| a_fazenda / fonteles | PT (herdeiro de casa) | outros pretendentes do PT; o Piauí troca de governador | "ministro que faz ajuste raramente vira presidente" (Ele) |
| a_fazenda / alckmin | mercado, centro | PT (perde a chave da sucessão) | a conta da economia cai na chapa inteira |
| a_fazenda / haddad | mercado (conhecido), parte do PT | quem esperava a vez | o mesmo nome de novo; prêmio para quem perdeu |
| a_fazenda / durigan | Gov (adia), mercado (continuidade) | ninguém sai na frente | cada ministro faz campanha da própria pasta |
| o_ministerio / cobra | Gov (base fiel) | Centrão (liberdade), base menor | partidos rachados no plenário |
| o_ministerio / livre | Centrão | Gov (derrotas no plenário), base do PT | cargo sem voto |
| o_ministerio / guarda | Gov (moeda para fevereiro) | Centrão espera | o Centrão usa a Mesa como moeda |
| o_ministerio / fora | base do PT | Centrão (sem cargos), Gov (minoria) | o Centrão vota as mesas contra o Planalto |
| o_foro / fica | quem acusa | defesa | a narrativa de perseguição continua |
| o_foro / divide | defesa (juiz comum, mais lento) | quem acusa | os lados do discurso se invertem |
| o_foro / espera | STF (tempo) | os dois lados esperam | a decisão cai no Supremo já com o Congresso novo |
| a_camara / pt_sai | PL (comissões), Motta | PT (isolado nas comissões) | a base do PL chama de adesão |
| a_camara / pl_fora | PT, Motta | PL (maior bancada, piores comissões) | o PL obstrui em 2027 |
| a_camara / juntos | Motta | as duas bases | PT engole o PL; o PL, o PT |
| a_camara / troca | PL (cobra no Senado) | Gov | o Centrão pode não pagar |
| o_senado / folga | Alcol., Gov | oposição | dois anos de Senado previsível com prazo |
| o_senado / apertado | Alcol. (devendo) | Gov (traições), Centrão (vira suspeito) | ninguém sabe quem traiu |
| o_senado / oposição | Bolso., Dir. mod. | Gov, Alcol., STF | o governo negocia cada votação |

## Checagem

- **Gov** perde em todas as decisões em pelo menos uma saída; nenhuma escolha sem custo para ele.
- **Centrão** perde em `cobra`, `fora` e no `apertado` (vira suspeito): responde à pendência dos leitores.
- **PT** perde na Fazenda com Alckmin, nos ministérios com o Centrão livre e no `pt_sai` da Câmara.
- **Bolsonarismo** ganha no foro dividido, na troca e na vitória da oposição; perde no `pl_fora` e na folga.
- **STF** perde no Senado da oposição e paga a espera.

## Ficou para depois

- Trilho "o fim da imunidade": Flávio no Brasil, solto e sem mandato, pode ser preso sem o Senado votar. Hoje fica em `lados` de `o_foro`.
- A Casa Civil (Camilo) e a SRI (Silvio Costa Filho) como cenas próprias.
- As audiências da Câmara democrata nos EUA (`eua_dem_camara`).
- Governadores na posse de 6/01 (Tarcísio).

## Candidatos a trava

| Nó | O que trava | Quando |
|---|---|---|
| a_fazenda | anúncio do ministro da Fazenda | fim de novembro (CNN) |
| o_ministerio | partidos do Centrão no ministério | fim de novembro a janeiro |
| a_camara | o PL no bloco de Motta | novembro a 1º/02 |
| o_senado | eleição da Mesa | 1º/02/2027 |
| o_foro | decisão sobre os inquéritos | fevereiro |

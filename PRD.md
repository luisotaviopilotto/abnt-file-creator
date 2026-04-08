# PRD: Sistema de Automação de Documentos ABNT (Live Preview)

## 1. Visão Geral
Este documento define os requisitos para um sistema web baseado em **NextJS** voltado à criação modular de trabalhos acadêmicos. O sistema deve automatizar a formatação conforme as normas **ABNT (Associação Brasileira de Normas Técnicas)**, utilizando um painel de configuração à esquerda e um preview em tempo real à direita que simula fielmente a folha A4.

## 2. Requisitos Funcionais (Módulos da Sidebar)

### RF01: Configuração de Capa
*   **Campos:** Instituição, Curso, Autor, Título, Subtítulo, Cidade e Ano.
*   **Regras de Formatação:**
    *   **Instituição e Curso:** Topo da página, centralizados, em negrito e maiúsculas.
    *   **Autor:** 3 linhas abaixo da instituição, centralizado, em maiúsculas e sem negrito.
    *   **Título:** 5 linhas abaixo do autor, centralizado, em negrito e maiúsculas.
    *   **Subtítulo:** Logo abaixo do título, sem negrito.
    *   **Local e Ano:** Cidade na penúltima linha e Ano na última linha da folha, ambos centralizados.

### RF02: Configuração de Folha de Rosto (Contracapa)
*   **Campos:** Nome do Autor, Título/Subtítulo, Objetivo do Trabalho, Nome do Orientador, Local e Ano.
*   **Regras de Formatação:**
    *   **Autor:** Topo da folha, centralizado e em maiúsculas.
    *   **Título:** 5 linhas abaixo do autor, em negrito e centralizado.
    *   **Objetivo (Natureza):** 5 linhas abaixo do título. Deve ser um texto justificado com **recuo de 7,5 cm em relação à margem esquerda** (ocupando a metade direita da folha).
    *   **Orientador:** 1 linha abaixo do texto de objetivo.

### RF03: Configuração de Resumo
*   **Campos:** Texto do Resumo e Palavras-chave.
*   **Regras de Formatação:**
    *   **Título:** "RESUMO" centralizado, em negrito e maiúsculas.
    *   **Corpo:** Bloco maciço de texto (sem parágrafos), justificado, entre 100 e 500 palavras, escrito na 3ª pessoa do singular.
    *   **Palavras-chave:** 1 linha abaixo do resumo; termo "Palavras-chave" em negrito, seguido de 3 a 5 palavras separadas por ponto e vírgula.

### RF04: Gerador de Sumário
*   **Lógica:** O sistema deve mapear automaticamente os títulos a partir da Introdução.
*   **Regras de Exclusão:** Não deve listar Capa, Folha de Rosto ou Resumo.
*   **Formatação:** Títulos primários em negrito e maiúsculas. Numeração de página alinhada à direita com preenchimento de pontos.

### RF05: Editor de Conteúdo (Introdução, Desenvolvimento e Conclusão)
*   **Títulos Primários:** Numerados (1, 2, 3), negrito, maiúsculas, alinhados à esquerda e com 1 linha de distância para o início do texto.
*   **Subdivisões do Desenvolvimento:**
    *   **Assuntos (2.1):** Maiúsculas, sem negrito, alinhados à esquerda.
    *   **Tópicos (2.1.1):** Apenas primeira letra maiúscula, em negrito, alinhados à esquerda.
*   **Regras da Conclusão:** Focar no senso crítico do autor; proibido apresentar novos argumentos ou referências externas.

### RF06: Motor de Citações e Referências
*   **Citação Direta Curta (até 3 linhas):** Inserida no texto entre aspas duplas, seguida de `(SOBRENOME, ano, página)`.
*   **Citação Direta Longa (> 3 linhas):** Recuo de **4 cm da margem esquerda**, fonte **tamanho 10**, espaçamento **simples (1,0)**, sem aspas e com 1 linha de distância acima e abaixo.
*   **Referências:** Listar ao final como item obrigatório, sem número na frente do título "REFERÊNCIAS". Devem seguir a ordem exata de utilização no trabalho.

## 3. Requisitos Não Funcionais (Configurações Técnicas)

### RNF01: Layout e Margens
*   **Margens da Página:** Superior e Esquerda: **3 cm**; Inferior e Direita: **2 cm**.
*   **Fonte:** Arial ou Times New Roman (uma única escolha para todo o trabalho), tamanho **12** para o texto geral.
*   **Espaçamento entre Linhas:** **1,5** para o texto comum e **1,0 (simples)** para citações longas.
*   **Parágrafos:** Recuo de **1,25 cm** na primeira linha de cada parágrafo.

### RNF02: Lógica de Paginação e Numeração
*   **Contagem:** Inicia na folha de rosto (que é a página 2), mas os números não aparecem nas páginas pré-textuais.
*   **Exibição:** A numeração só se torna visível a partir da **Introdução**.
*   **Formatação do Número:** No cabeçalho (margem superior), alinhado à direita, a **2 cm da borda**, em fonte **Arial tamanho 10**.

## 4. Guia de Implementação (Configurações Base)

| Elemento | Fonte | Tamanho | Estilo | Espaçamento | Alinhamento | Recuo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Texto Geral** | Arial/Times | 12 | Normal | 1.5 | Justificado | 1.25 cm (1ª linha) |
| **Títulos Primários**| Arial/Times | 12 | Negrito/MAIÚSC. | 1.5 | Esquerda | N/A |
| **Citações Longas** | Arial/Times | 10 | Normal | 1.0 | Justificado | 4 cm (Esq.) |
| **Página (Número)** | Arial | 10 | Normal | N/A | Dir. (Superior)| 2 cm da borda |
| **Objetivo (Rosto)** | Arial/Times | 12 | Normal | 1.0 | Justificado | 7.5 cm (Esq.) |

## 5. Fluxo de Exportação
O sistema deve gerar um arquivo final (PDF ou DOCX) que mantenha a integridade das margens (3-3-2-2) e garanta que cada seção principal (Introdução, Desenvolvimento, Conclusão, Referências) comece em uma nova página.
```
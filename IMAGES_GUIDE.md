# Guia das Imagens — Limpô Rio Preto

As imagens reais já estão integradas ao site. Elas ficam em:

```
public/Images/
```

## Arquivos presentes (nomes e extensões reais)

| Arquivo | Uso no site |
| :--- | :--- |
| `Logo.png` | Logotipo oficial — cabeçalho e rodapé |
| `hero-sofa.png` | Fotografia de fundo do Hero |
| `sofa-antes.jpg` | Comparador — estado **Antes** |
| `sofa-depois.jpg` | Comparador — estado **Depois** |
| `higienizacao-sofas.jpg` | Card de serviço + Galeria |
| `higienizacao-colchoes.jpg` | Card de serviço + Galeria |
| `higienizacao-tapetes.jpg` | Card de serviço + Galeria |
| `impermeabilizacao-sofa.jpg` | Card de serviço + Galeria |

## Observações
- Os caminhos são relativos à raiz do projeto (onde está o `index.html`), por exemplo: `public/Images/hero-sofa.png`.
- Não crie pastas duplicadas de imagens. Todos os arquivos permanecem em `public/Images/`.
- As referências centrais também estão em `config.js` (objeto `images`).
- A galeria usa 6 imagens distintas, em layout assimétrico. Ao trocar qualquer foto, preserve o nome do arquivo para não quebrar as referências.

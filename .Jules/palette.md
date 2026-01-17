## 2026-01-17 - Acessibilidade em Wizard Steps
**Learning:** Indicadores visuais de progresso (como steps numéricos) frequentemente são implementados apenas com `div`s, tornando-os invisíveis para leitores de tela.
**Action:** Sempre envolver indicadores de passos em `<nav>` com `<ol>`, usar `aria-current="step"` no passo atual e incluir texto oculto (`sr-only`) que descreva o estado (Concluído/Atual/Pendente) junto com o número do passo.

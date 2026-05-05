<!-- canonical: README.md § How this compares — keep in sync -->

## Cómo se compara

Algunos llegan acá preguntando: ¿esto es un fork de [Everything Claude Code](https://github.com/affaan-m/everything-claude-code), o es otra plantilla starter? Ninguna de las dos.

Las tres opciones de abajo son las que un visitante nuevo suele comparar. Se pisan en algunos puntos, pero cada una apunta a un tipo de trabajo distinto. La tabla es un mapa, no un ranking — agarrá la columna que coincide con cómo pasás la semana en serio.

Qué es cada columna:

- **Solo Stack** es este repo. Una instalación de 6 componentes con el workflow, el cookbook y los case studies envueltos alrededor.
- **Everything Claude Code** es la librería upstream de skills + agents de la que depende este repo. La construye y mantiene [@affaan-m](https://github.com/affaan-m).
- **Plantillas starter** es el balde para `create-next-app`, Vite + Tailwind vainilla, T3 stack y demás scaffolds de un solo framework.

| Dimensión | Solo Stack | Everything Claude Code | Plantillas starter |
|-----------|------------|------------------------|--------------------|
| Audiencia | Fundador solo con 2+ productos al mismo tiempo | Ingenieros y equipos de AI dev | Quienes recién arrancan con web apps y prototipos rápidos |
| Voz | Operator-first — el workflow antes que el código | Engineer-first — profundidad por ecosistema | Framework-first — el framework define la forma |
| Alcance del stack | Set curado de 6 componentes con una sola ruta de instalación opinada | 182 skills + 48 agents en 12+ ecosistemas de lenguaje | Un framework + starter de auth/db |
| Soporte multi-runtime | Solo Claude Code | Claude Code, Cursor, Codex, OpenCode, Gemini, Antigravity | Atado al framework |
| Productos realmente lanzados | 4 case studies anonimizados de productos de un operador | Producto propio del autor (`zenith.chat`) y configs de plantilla | Ninguno — está pensado como punto de partida |
| Aportes propios | Workflows, cookbook con 12 recetas, 6 hooks, 5–7 skills propias | Catálogo amplio de skills + agents, dos paquetes npm | Scaffold + boilerplate |

En corto, por audiencia:

- Agarrá **Solo Stack** si llevás varios productos en paralelo y querés un workflow además del config.
- Agarrá **Everything Claude Code** si querés un catálogo amplio de skills + agents y soporte multi-runtime.
- Agarrá una **plantilla starter** si estás arrancando tu primera web app y querés el happy path de un framework solo.

Solo Stack y Everything Claude Code están pensados para coexistir — buena parte de los lectores acá va a instalar los dos. Las recetas del cookbook, los profiles y los case studies de este repo asumen que el catálogo de skills de ECC está instalado al lado; los workflows describen cómo ese catálogo se usa de verdad en 2+ productos en paralelo.

Si venís de una plantilla starter y terminaste con 3 abiertas en 3 carpetas distintas, la parte que Solo Stack intenta cubrir está *arriba* de la plantilla: el workflow, el cookbook, la ruta de instalación por perfil y los case studies que muestran qué pasó en productos reales.

Si venís de Everything Claude Code y querés un ejemplo concreto de cómo un operador corre el catálogo sobre una lista de productos en vez de un solo repo, los case studies y los workflows de acá están pensados justamente como ese ejemplo concreto.

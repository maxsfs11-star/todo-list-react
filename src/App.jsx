import { useState, useEffect } from "react";




function App() {

  const [confirmarLimpar, setConfirmarLimpar] = useState(false);

  const [temaEscuro, setTemaEscuro] = useState(() => {
    const temaSalvo = localStorage.getItem("tema");
    return temaSalvo === "dark";
  });
  const [tarefa, setTarefa] = useState("");
  const [listaTarefas, setListaTarefas] = useState(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");
    return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
  });
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(listaTarefas));
  }, [listaTarefas]);

  useEffect(() => {
    localStorage.setItem("tema", temaEscuro ? "dark" : "light");
  }, [temaEscuro]);

  function adicionarTarefa() {
    if (tarefa.trim() !== "") {
      const novaTarefa = {
        id: Date.now(),
        texto: tarefa,
        concluida: false,
        editando: false,
      };

      setListaTarefas([...listaTarefas, novaTarefa]);
      setTarefa("");
    }
  }

  

  function limparTarefas() {
  setConfirmarLimpar(true);
}

function confirmarLimpeza() {
  setListaTarefas([]);
  setConfirmarLimpar(false);
}

function cancelarLimpeza() {
  setConfirmarLimpar(false);
}

  function removerTarefa(idRemover) {
    const novaLista = listaTarefas.filter((item) => item.id !== idRemover);
    setListaTarefas(novaLista);
  }

  function toggleConcluida(idSelecionado) {
    const novaLista = listaTarefas.map((item) => {
      if (item.id === idSelecionado) {
        return {
          ...item,
          concluida: !item.concluida,
        };
      }

      return item;
    });

    setListaTarefas(novaLista);
  }

  function editarTarefa(idSelecionado) {
    const novaLista = listaTarefas.map((item) => {
      if (item.id === idSelecionado) {
        return {
          ...item,
          editando: true,
        };
      }

      return item;
    });

    setListaTarefas(novaLista);
  }

  function salvarEdicao(idSelecionado, novoTexto) {
    const novaLista = listaTarefas.map((item) => {
      if (item.id === idSelecionado) {
        return {
          ...item,
          texto: novoTexto,
          editando: false,
        };
      }

      return item;
    });

    setListaTarefas(novaLista);
  }

  function alterarTextoEdicao(idSelecionado, novoTexto) {
    const novaLista = listaTarefas.map((item) => {
      if (item.id === idSelecionado) {
        return {
          ...item,
          texto: novoTexto,
        };
      }

      return item;
    });

    setListaTarefas(novaLista);
  }

  

  const tarefasFiltradas = listaTarefas.filter((item) => {
    if (filtro === "pendentes") {
      return item.concluida === false;
    }

    if (filtro === "concluidas") {
      return item.concluida === true;
    }

    return true;
  });

  

  return (

    

    <div className={temaEscuro ? "container dark" : "container"}>
      <div className="card">
        <button
          onClick={() => setTemaEscuro(!temaEscuro)}
          className="botao-tema"
        >
      {temaEscuro ? "Modo Claro" : "Modo Escuro"}
    </button>
        <h1 className="titulo">Todo List</h1>

        <div className="input-area">
          <input
            type="text"
            value={tarefa}
            onChange={(e) => setTarefa(e.target.value)}
            placeholder="Digite uma tarefa"
            className="input-tarefa"
          />

          <button onClick={adicionarTarefa} className="botao-adicionar">
            Adicionar
          </button>
        </div>

        <div className="filtros">
          <button
            onClick={() => setFiltro("todas")}
            className={filtro === "todas" ? "filtro ativo" : "filtro"}
          >
            Todas
          </button>

          <button
            onClick={() => setFiltro("pendentes")}
            className={filtro === "pendentes" ? "filtro ativo" : "filtro"}
          >
            Pendentes
          </button>

          <button
            onClick={() => setFiltro("concluidas")}
            className={filtro === "concluidas" ? "filtro ativo" : "filtro"}
          >
            Concluídas
          </button>
        </div>

        <div className="acoes-gerais">
          <button onClick={limparTarefas} className="botao-limpar">
            Limpar Tudo
          </button>

          {confirmarLimpar && (
            <div className="confirmacao">
              <p>Tem certeza que deseja apagar todas as tarefas?</p>

              <div className="botoes-confirmacao">
                <button onClick={confirmarLimpeza} className="botao-confirmar">
                  Confirmar
                </button>

                <button onClick={cancelarLimpeza} className="botao-cancelar">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        <ul className="lista">
          {tarefasFiltradas.map((item) => (
            <li key={item.id} className="item-tarefa">
              {item.editando ? (
                <div className="editar-area">
                  <input
                    type="text"
                    value={item.texto}
                    onChange={(e) =>
                      alterarTextoEdicao(item.id, e.target.value)
                    }
                    className="input-editar"
                  />

                  <button
                    onClick={() => salvarEdicao(item.id, item.texto)}
                    className="botao-salvar"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <>
                  <div className="lado-esquerdo">
                    <input
                      type="checkbox"
                      checked={item.concluida}
                      onChange={() => toggleConcluida(item.id)}
                    />

                    <span
                      className={item.concluida ? "texto concluida" : "texto"}
                    >
                      {item.texto}
                    </span>
                  </div>

                  <div className="acoes">
                    <button
                      onClick={() => editarTarefa(item.id)}
                      className="botao-editar"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => removerTarefa(item.id)}
                      className="botao-remover"
                    >
                      Remover
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
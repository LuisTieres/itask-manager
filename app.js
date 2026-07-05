class Tarefa {
	static proximoId = 1;

	constructor(titulo, descricao) {
		this.id = Tarefa.proximoId++;
		this.titulo = titulo;
		this.descricao = descricao;
		this.criadaEm = new Date();
		this.concluida = false;
	}

	alternarStatus() {
		this.concluida = !this.concluida;
	}

	formatarDataHora() {
		const data = this.criadaEm.toLocaleDateString('pt-BR');
		const hora = this.criadaEm.toLocaleTimeString('pt-BR', {
			hour: '2-digit',
			minute: '2-digit',
		});
		return `${data} às ${hora}`;
	}

	renderizar(aoAlternar, aoRemover) {
		const li = document.createElement('li');
		li.className = 'task-card';
		li.dataset.id = String(this.id);
		if (this.concluida) {
			li.classList.add('concluida');
		}

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.className = 'task-checkbox';
		checkbox.checked = this.concluida;
		checkbox.setAttribute('aria-label', `Marcar "${this.titulo}" como concluída`);
		checkbox.addEventListener('change', () => aoAlternar(this.id));

		const body = document.createElement('div');
		body.className = 'task-body';

		const titleEl = document.createElement('p');
		titleEl.className = 'task-title';
		titleEl.textContent = this.titulo;
		body.appendChild(titleEl);

		if (this.descricao.trim().length > 0) {
			const descEl = document.createElement('p');
			descEl.className = 'task-desc';
			descEl.textContent = this.descricao;
			body.appendChild(descEl);
		}

		const metaEl = document.createElement('span');
		metaEl.className = 'task-meta';
		metaEl.textContent = this.concluida
			? `✓ concluída · criada em ${this.formatarDataHora()}`
			: `criada em ${this.formatarDataHora()}`;
		body.appendChild(metaEl);

		const removeBtn = document.createElement('button');
		removeBtn.type = 'button';
		removeBtn.className = 'delete-btn';
		removeBtn.textContent = '×';
		removeBtn.setAttribute('aria-label', `Remover tarefa "${this.titulo}"`);
		removeBtn.addEventListener('click', () => aoRemover(this.id));

		li.appendChild(checkbox);
		li.appendChild(body);
		li.appendChild(removeBtn);

		return li;
	}
}

class App {
	constructor() {
		this.tarefas = [];

		this.form = document.getElementById('taskForm');
		this.tituloInput = document.getElementById('tituloInput');
		this.descricaoInput = document.getElementById('descricaoInput');
		this.lista = document.getElementById('lista');
		this.emptyState = document.getElementById('emptyState');
		this.taskCount = document.getElementById('taskCount');

		this.form.addEventListener('submit', (evento) => this.aoEnviarFormulario(evento));

		this.renderizarLista();
	}

	aoEnviarFormulario(evento) {
		evento.preventDefault();

		const titulo = this.tituloInput.value.trim();
		const descricao = this.descricaoInput.value.trim();

		if (titulo.length === 0) {
			this.tituloInput.focus();
			return;
		}

		const novaTarefa = new Tarefa(titulo, descricao);
		this.tarefas.push(novaTarefa);

		this.form.reset();
		this.tituloInput.focus();

		this.renderizarLista();
	}

	alternarTarefa(id) {
		const tarefa = this.tarefas.find((t) => t.id === id);
		if (tarefa) {
			tarefa.alternarStatus();
			this.renderizarLista();
		}
	}

	removerTarefa(id) {
		this.tarefas = this.tarefas.filter((t) => t.id !== id);
		this.renderizarLista();
	}

	renderizarLista() {
		this.lista.innerHTML = '';

		this.tarefas.forEach((tarefa) => {
			const card = tarefa.renderizar(
				(id) => this.alternarTarefa(id),
				(id) => this.removerTarefa(id),
			);
			this.lista.appendChild(card);
		});

		this.emptyState.classList.toggle('hidden', this.tarefas.length > 0);
		this.atualizarContador();
	}

	atualizarContador() {
		const total = this.tarefas.length;
		const concluidas = this.tarefas.filter((t) => t.concluida).length;
		const rotulo = total === 1 ? 'item' : 'itens';
		this.taskCount.textContent = `${total} ${rotulo} · ${concluidas} concluída(s)`;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new App();
});

//# sourceMappingURL=app.js.map
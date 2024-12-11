import anime from "./animejs/lib/anime.es.js";

export const createForm = <T extends HTMLElement>(
	id: number,
	container: T,
): void => {
	if (container) {
		const newForm = document.createElement("div");
		newForm.className = `addForm formReal`;
		newForm.id = `add${id}`;
		newForm.innerHTML = `<div>
              <label for="title" class="text-2xl text-greytwo">Title</label>
              <input type="text" name="title" class="input-s formInput" id="nameInput">
            </div>
            <div>
              <label for="dcrp" class="text-2xl text-greytwo">Description</label>
              <input type="text" name="dcrp" class="input-s max-w-xl formInput" id="dcrpInput">
            </div>
            <div>
              <label for="date" class="text-2xl text-greytwo">Date</label>
              <input type="date" name="date" class="input-s formInput" min="2020-01-01" id="dateInput">
            </div>
            <div>
              <label for="status" class="text-2xl text-greytwo">Status</label>
              <select name="status" class="input-s formInput" id="statusInput">
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label for="priority" class="text-2xl text-greytwo">Priority</label>
              <select name="priority" class="input-s formInput" id="prioInput">
                <option value="P3">P3</option>
                <option value="P2">P2</option>
                <option value="P1">P1</option>
              </select>
            </div>`;
		anime.set(newForm, {
			translateY: -50,
			opacity: 0,
		});
		container.appendChild(newForm);
        anime({
			targets: newForm,
			translateY: 0,
			opacity: 1,
			duration: 250,
			easing: 'linear',
		});
	}
};

export const removeForm = <T extends HTMLElement>(form: T): void => {
		if (form){
            anime({
                targets: form,
                translateY: -50,
                opacity: 0,
                duration: 250,
                easing: 'linear',
                complete: () => {
                    form.remove();
                },
            });
        } else {
            console.log('Unexpected error');
            
        }
}

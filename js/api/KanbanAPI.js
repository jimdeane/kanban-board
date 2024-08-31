import Column from "../view/Column.js";
export default class KanbanAPI {
	static getItems(columnId) {
		const column = read().find(column => column.id == columnId);

		if (!column) {
			return [];
		}

		return column.items;
	}

	static addColumn() {
		const data = read();
		const panel = document.getElementById("kanban-panel");
		// Select all divs with the class 'kanban__column'
		const kanbanColumns = document.querySelectorAll('.kanban__column');

		// Loop through each column and extract its data-id value
		const pos = kanbanColumns.length;
		const title = 'new column';
		const columnView = new Column(pos, title);
		data.push({id: pos, items: []});
		panel.appendChild(columnView.elements.root);
		console.log(panel);
		save(data);
	}
	static deleteCol(event) {
		const data = read();
		// Get the element that triggered the event
		const clickedElement = event.target;

		// Traverse to the parent element (the div with class 'kanban__column')
		const parentDiv = clickedElement.closest('.kanban__column');

		// Retrieve the data-id attribute from the parent div
		const dataId = parentDiv ? parentDiv.getAttribute('data-id') : null;

		// Log or use the data-id
		console.log(dataId);  // Outputs: "3"

		data.splice(dataId-1, 1);
		data.save();
		console.log(data);
	}
	static insertItem(columnId, content) {
		const data = read();
		const column = data.find(column => column.id == columnId);
		const item = {
			id: Math.floor(Math.random() * 100000),
			content
		};

		if (!column) {
			throw new Error("Column does not exist.");
		}

		column.items.push(item);
		save(data);

		return item;
	}

	static updateItem(itemId, newProps) {
		const data = read();
		const [item, currentColumn] = (() => {
			for (const column of data) {
				const item = column.items.find(item => item.id == itemId);

				if (item) {
					return [item, column];
				}
			}
		})();

		if (!item) {
			throw new Error("Item not found.");
		}

		item.content = newProps.content === undefined ? item.content : newProps.content;

		// Update column and position
		if (
			newProps.columnId !== undefined
			&& newProps.position !== undefined
		) {
			const targetColumn = data.find(column => column.id == newProps.columnId);

			if (!targetColumn) {
				throw new Error("Target column not found.");
			}

			// Delete the item from it's current column
			currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

			// Move item into it's new column and position
			targetColumn.items.splice(newProps.position, 0, item);
		}

		save(data);
	}

	static deleteItem(itemId) {
		const data = read();

		for (const column of data) {
			const item = column.items.find(item => item.id == itemId);

			if (item) {
				column.items.splice(column.items.indexOf(item), 1);
			}
		}

		save(data);
	}
}

function read() {
	const json = localStorage.getItem("kanban-data");

	if (!json) {
		return [
			{
				id: 1,
				items: []
			},
			{
				id: 2,
				items: []
			},
			{
				id: 3,
				items: []
			},
		];
	}

	return JSON.parse(json);
}

function save(data) {
	localStorage.setItem("kanban-data", JSON.stringify(data));
}

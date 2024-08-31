import Kanban from "./view/Kanban.js";
import KanbanApi from "./api/KanbanAPI.js";

new Kanban(
	document.querySelector(".kanban")
);


window.addColumn = KanbanApi.addColumn;
window.deleteCol = KanbanApi.deleteCol;
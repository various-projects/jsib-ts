import * as Routing from "./routing/routing.js";

Routing.go();

window.addEventListener("hashchange", () => Routing.go());
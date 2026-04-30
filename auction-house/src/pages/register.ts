import { setupNav } from "../index";
import { redirectIfLoggedIn } from "../utils/authGuard";
import { setupRegisterForm } from "../events/registerEvents";

redirectIfLoggedIn();
setupNav();
setupRegisterForm();

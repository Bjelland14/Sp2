import { setupNav } from "../index";
import { redirectIfLoggedIn } from "../utils/authGuard";
import { setupLoginForm } from "../events/loginEvents";

redirectIfLoggedIn();
setupNav();
setupLoginForm();

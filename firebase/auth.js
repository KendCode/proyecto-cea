import { getAuth }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import { app }
from "./firebase-config.js";

export const auth = getAuth(app);
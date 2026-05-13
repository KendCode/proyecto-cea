import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { app }
from "./firebase-config.js";

export const db = getFirestore(app);
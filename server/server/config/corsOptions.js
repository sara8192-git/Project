const corsOptions = {
    // origin: (origin, callback) => {
    //     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
    //         callback(null, true);
    //     } else {
    //         console.log("לא מורשה לגישה ממקור: ", origin);  // הוספת פלט לטרייסינג של הבעיה
    //         callback(new Error('Not allowed by CORS'));
    //     }
    // },
    // credentials: true,
    // optionsSuccessStatus: 200
    origin: 'http://localhost:3000', // או כל דומיין אחר שאתה רוצה לאפשר
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

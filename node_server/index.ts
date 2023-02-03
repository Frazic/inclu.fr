require('dotenv').config();
const logger = require("./winston.ts");

// EXPRESS
const express = require('express');
const app = express();
app.listen(process.env.PORT,

    () => { logger.info(`Inclure.net server running on port ${process.env.PORT}`) });

// CORS
const cors = require("cors");
app.use(cors({
    origin: true
}))

// SUPABASE
const supabase = require("./supabase.ts");

// STRIPE
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

type UserInfo = {
    name: string,
    email: string,
    donated?: boolean
}

// ENDPOINTS
app.get('/', (req, res) => {
    logger.info("Hello from App Engine!")
    res.send('Hello from App Engine!');
});

app.post("/join", express.json(), async (req, res) => {
    const requestBody = req.body;

    logger.info("Request to /join received");
    logger.debug(req.headers);
    logger.debug(req.body);


    const userInfo: UserInfo = requestBody.user_info;
    if (!userInfo) {
        const msg = "Les données utilisateur sont absentes ou au mauvais format"
        logger.warn(msg)
        res.status(400).json({ error: msg });
        return;
    };

    logger.info(`Request for: ${stringifyUserInfo(userInfo)}`);

    let code, errorMessage;

    // Make sure email doesn't already exist in supabase
    ; ({ code, errorMessage } = await checkUniqueEmail(userInfo));

    // Something went wrong
    if (code || errorMessage) {
        logger.warn(`${stringifyUserInfo(userInfo)}: { Code: ${code}, Error: ${errorMessage} }`);
        res.status(code)
            .json({ error: errorMessage });
        return;
    };

    // If user wants to donate, process payment
    if (userInfo.donated) {
        logger.info(`${stringifyUserInfo(userInfo)}: Donated, going to Stripe`)
        try {
            // Stripe session
            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                payment_method_types: ["card"],
                line_items: [
                    {
                        price: process.env.STRIPE_DONATION_PRODUCT_ID,
                        quantity: 1
                    }
                ],
                success_url: `${process.env.CLIENT_URL}/success`,
                cancel_url: `${process.env.CLIENT_URL}/`,
                metadata: {
                    name: userInfo.name,
                    email: userInfo.email
                }
            })
            logger.info(`${stringifyUserInfo(userInfo)}: Session creation OK, sending checkout URL`);
            res.status(200)
                .json({ url: session.url });
            return;
        } catch (error) {
            logger.error(`${stringifyUserInfo(userInfo)}: Session creation failed: ${error}`);
            res.status(500)
                .json({ error: error.message });
        }
    };

    // If all is good then add user to waitlist
    ; ({ code, errorMessage } = await insertNewUser(userInfo));

    if (code || errorMessage) {
        logger.warn(`${stringifyUserInfo(userInfo)}: Insert user failed: { Code: ${code}, Error: ${errorMessage} }`);
        res.status(code)
            .json({ error: errorMessage });
        return;
    };

    logger.info(`${stringifyUserInfo(userInfo)}: Successfully added to waitlist`);
    res.status(201)
        .json({});
})

app.post("/webhook", express.raw({ type: 'application/json' }), async (request, response) => {
    logger.info("Request to /webhook received");
    logger.debug(request.headers);

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        logger.error(err.message);

        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const metadata = event.data.object.metadata;
            const { errorMessage } = await insertNewUser({ name: metadata.name, email: metadata.email, donated: true });
            if (errorMessage) {
                logger.error(`CRITICAL: ${metadata} completed checkout but was not added to Supabase: ${errorMessage}`);
            }
            break;
        // ... handle other event types
        default:
            logger.debug(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    logger.info(`Request handled gracefully`)
    response.send();
});

// UTIL FUNCTIONS

async function checkUniqueEmail(userInfo: UserInfo): Promise<{ code?: number, errorMessage?: string }> {
    logger.info(`Checking if email is unique: ${stringifyUserInfo(userInfo)}`);

    const { data, error } = await supabase
        .from("waitlist")
        .select("email")
        .eq("email", userInfo.email);

    if (error) {
        logger.error(`${stringifyUserInfo(userInfo)}: Select to Supabase failed: ${error}`);
        return { code: 500, errorMessage: error.message };
    }

    if (!(data.length === 0)) {
        logger.warn(`${stringifyUserInfo(userInfo)}: Email already registered`)
        return { code: 409, errorMessage: "Email déjà enregistré :c" };
    }

    return {};
}

async function insertNewUser(userInfo: UserInfo): Promise<{ code?: number, errorMessage?: string }> {
    logger.info(`${stringifyUserInfo(userInfo)}: Inserting into Supabase waitlist`);

    const { error } = await supabase
        .from("waitlist")
        .insert([{
            name: userInfo.name,
            email: userInfo.email,
            paid: userInfo.donated
        }]);

    if (error) logger.error(`${stringifyUserInfo(userInfo)}: CRITICAL Couldn't insert into supabase`);



    const nodemailer = require("nodemailer");

    var transporter = nodemailer.createTransport({
        host: process.env.SENDINBLUE_HOST,
        port: process.env.SENDINBLUE_PORT,
        auth: {
            user: process.env.SENDINBLUE_USER,
            pass: process.env.SENDINBLUE_PASSWORD
        }
    });

    const text = error
        // ERROR TEXT
        ? `Bonjour ${userInfo.name}, merci d'avoir rejoint la liste d'attente Inclure.net :)\n
        Malheureusement de notre côté il y a eu comme une erreur. Ne vous en faites pas nous sommes au courant et vous serez informés dès que c'est résolu!\n\n
        Accrochez-vous nous allons y arriver,\n
        Inclure.net`
        // ? `Hi there ${userInfo.name}, thanks for joining the Inclure.net waitlist :)\n
        // Unfortunately on our end there was some kind of error. Don't worry we've been notified of this and will get back to you as soon as it has been resolved.\n\n
        // Here are the error details if you're curious: ${JSON.stringify(error)}\n\n
        // Sit tight!\n\n
        // Inclure.net`
        : userInfo.donated
            // USER HAS DONATED TEXT
            ? `Hi there ${userInfo.name}, thanks for joining the Inclure.net waitlist :)\n
        Not only did you do that, but you also made the kind decision to support us with a donation. This helps us in bringing the project to life, but also gives you 3 months of Pro membership when Inclure.net launches, how cool!\n
        We'll be sure to update you as soon as the project launches!\n\n
        In the meantime if you have any questions you can always contact us here:\n
        inclure.net@gmail.com\n\n
        Have a good one,\n
        Inclure.net`
            // USER HAS NOT DONATED TEXT
            : `Bonjour ${userInfo.name}, merci d'avoir rejoint la liste d'attente Inclure.net :)\n
            Vous serez tenu·e·s au courant de la progression du projet, promis!\n\n
            En attendant si vous avez des questions n'hésitez pas à nous contacter: inclure.net@gmail.com\n\n
            Vous êtes une bonne personne,\n
            Inclure.net`
    //     : `Hi there ${userInfo.name}, thanks for joining the Inclure.net waitlist :)\n
    // We'll be sure to update you as soon as the project launches!\n\n
    // In the meantime if you have any questions you can always contact us here:\n
    // inclure.net@gmail.com\n\n
    // Have a good one,\n
    // Inclure.net`

    var mailOptions = {
        from: 'Inclure.net <inclure.net@gmail.com>',
        to: userInfo.email,
        bcc: "frazic.dev@gmail.com",
        subject: "Merci d'avoir rejoint la liste d'attente Inclure.net!",
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            logger.error(`${stringifyUserInfo(userInfo)}: Error sending email: ${error}`);
        } else {
            logger.info(`${stringifyUserInfo(userInfo)}: Email sent: ${info.response}`);
        }
    });

    if (error) {
        if (error.code === "23505") return { code: 409, errorMessage: "Email déjà enregistré :c" };
        return { code: 500, errorMessage: error.message };
    }

    return {};
}

function stringifyUserInfo(userInfo: Object) {
    return JSON.stringify(userInfo).replace(/["']/g, "'");
}
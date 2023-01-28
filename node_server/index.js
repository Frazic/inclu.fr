var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
require('dotenv').config();
var logger = require("./winston.ts");
// EXPRESS
var express = require('express');
var app = express();
app.listen(process.env.APP_PORT, function () { logger.info("Server running on port ".concat(process.env.APP_PORT)); });
// CORS
var cors = require("cors");
app.use(cors({
    origin: true
}));
// SUPABASE
var supabase = require("./supabase.ts");
// STRIPE
var stripe = require('stripe')(process.env.APP_STRIPE_SECRET_KEY);
// ENDPOINTS
app.post("/join", express.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var requestBody, userInfo, msg, code, errorMessage, session, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                requestBody = req.body;
                logger.info("Request to /join received");
                logger.debug(req.headers);
                logger.debug(req.body);
                userInfo = requestBody.user_info;
                if (!userInfo) {
                    msg = "Les données utilisateur sont absentes ou au mauvais format";
                    logger.warn(msg);
                    res.status(400).json({ error: msg });
                    return [2 /*return*/];
                }
                ;
                logger.info("Request for: ".concat(stringifyUserInfo(userInfo)));
                // Make sure email doesn't already exist in supabase
                ;
                return [4 /*yield*/, checkUniqueEmail(userInfo)];
            case 1:
                (_a = _c.sent(), code = _a.code, errorMessage = _a.errorMessage);
                // Something went wrong
                if (code || errorMessage) {
                    logger.warn("".concat(stringifyUserInfo(userInfo), ": { Code: ").concat(code, ", Error: ").concat(errorMessage, " }"));
                    res.status(code)
                        .json({ error: errorMessage });
                    return [2 /*return*/];
                }
                ;
                if (!userInfo.donated) return [3 /*break*/, 5];
                logger.info("".concat(stringifyUserInfo(userInfo), ": Donated, going to Stripe"));
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, stripe.checkout.sessions.create({
                        mode: "payment",
                        payment_method_types: ["card"],
                        line_items: [
                            {
                                price: process.env.APP_STRIPE_DONATION_PRODUCT_ID,
                                quantity: 1
                            }
                        ],
                        success_url: "".concat(process.env.APP_CLIENT_URL, "/success"),
                        cancel_url: "".concat(process.env.APP_CLIENT_URL, "/"),
                        metadata: {
                            name: userInfo.name,
                            email: userInfo.email
                        }
                    })];
            case 3:
                session = _c.sent();
                logger.info("".concat(stringifyUserInfo(userInfo), ": Session creation OK, sending checkout URL"));
                res.status(200)
                    .json({ url: session.url });
                return [2 /*return*/];
            case 4:
                error_1 = _c.sent();
                logger.error("".concat(stringifyUserInfo(userInfo), ": Session creation failed: ").concat(error_1));
                res.status(500)
                    .json({ error: error_1.message });
                return [3 /*break*/, 5];
            case 5:
                ;
                // If all is good then add user to waitlist
                ;
                return [4 /*yield*/, insertNewUser(userInfo)];
            case 6:
                (_b = _c.sent(), code = _b.code, errorMessage = _b.errorMessage);
                if (code || errorMessage) {
                    logger.warn("".concat(stringifyUserInfo(userInfo), ": Insert user failed: { Code: ").concat(code, ", Error: ").concat(errorMessage, " }"));
                    res.status(code)
                        .json({ error: errorMessage });
                    return [2 /*return*/];
                }
                ;
                logger.info("".concat(stringifyUserInfo(userInfo), ": Successfully added to waitlist"));
                res.status(201)
                    .json({});
                return [2 /*return*/];
        }
    });
}); });
app.post("/webhook", express.raw({ type: 'application/json' }), function (request, response) { return __awaiter(_this, void 0, void 0, function () {
    var endpointSecret, sig, event, _a, metadata, errorMessage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                logger.info("Request to /webhook received");
                logger.debug(request.headers);
                endpointSecret = process.env.APP_STRIPE_WEBHOOK_SECRET;
                sig = request.headers['stripe-signature'];
                try {
                    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
                }
                catch (err) {
                    logger.error(err.message);
                    response.status(400).send("Webhook Error: ".concat(err.message));
                    return [2 /*return*/];
                }
                _a = event.type;
                switch (_a) {
                    case 'checkout.session.completed': return [3 /*break*/, 1];
                }
                return [3 /*break*/, 3];
            case 1:
                metadata = event.data.object.metadata;
                return [4 /*yield*/, insertNewUser({ name: metadata.name, email: metadata.email, donated: true })];
            case 2:
                errorMessage = (_b.sent()).errorMessage;
                if (errorMessage) {
                    logger.error("CRITICAL: ".concat(metadata, " completed checkout but was not added to Supabase: ").concat(errorMessage));
                }
                return [3 /*break*/, 4];
            case 3:
                logger.debug("Unhandled event type ".concat(event.type));
                _b.label = 4;
            case 4:
                // Return a 200 response to acknowledge receipt of the event
                logger.info("Request handled gracefully");
                response.send();
                return [2 /*return*/];
        }
    });
}); });
// UTIL FUNCTIONS
function checkUniqueEmail(userInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger.info("Checking if email is unique: ".concat(stringifyUserInfo(userInfo)));
                    return [4 /*yield*/, supabase
                            .from("waitlist")
                            .select("email")
                            .eq("email", userInfo.email)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        logger.error("".concat(stringifyUserInfo(userInfo), ": Select to Supabase failed: ").concat(error));
                        return [2 /*return*/, { code: 500, errorMessage: error.message }];
                    }
                    if (!(data.length === 0)) {
                        logger.warn("".concat(stringifyUserInfo(userInfo), ": Email already registered"));
                        return [2 /*return*/, { code: 409, errorMessage: "Email déjà enregistré :c" }];
                    }
                    return [2 /*return*/, {}];
            }
        });
    });
}
function insertNewUser(userInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var error, nodemailer, transporter, text, mailOptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.info("".concat(stringifyUserInfo(userInfo), ": Inserting into Supabase waitlist"));
                    return [4 /*yield*/, supabase
                            .from("waitlist")
                            .insert([{
                                name: userInfo.name,
                                email: userInfo.email,
                                paid: userInfo.donated
                            }])];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        logger.error("".concat(stringifyUserInfo(userInfo), ": CRITICAL Couldn't insert into supabase"));
                    nodemailer = require("nodemailer");
                    transporter = nodemailer.createTransport({
                        host: process.env.APP_SENDINBLUE_HOST,
                        port: process.env.APP_SENDINBLUE_PORT,
                        auth: {
                            user: process.env.APP_SENDINBLUE_USER,
                            pass: process.env.APP_SENDINBLUE_PASSWORD
                        }
                    });
                    text = error
                        // ERROR TEXT
                        ? "Bonjour ".concat(userInfo.name, ", merci d'avoir rejoint la liste d'attente Inclure.net :)\n\n        Malheureusement de notre c\u00F4t\u00E9 il y a eu comme une erreur. Ne vous en faites pas nous sommes au courant et vous serez inform\u00E9s d\u00E8s que c'est r\u00E9solu!\n\n\n        Accrochez-vous nous allons y arriver,\n\n        Inclure.net")
                        // ? `Hi there ${userInfo.name}, thanks for joining the Inclure.net waitlist :)\n
                        // Unfortunately on our end there was some kind of error. Don't worry we've been notified of this and will get back to you as soon as it has been resolved.\n\n
                        // Here are the error details if you're curious: ${JSON.stringify(error)}\n\n
                        // Sit tight!\n\n
                        // Inclure.net`
                        : userInfo.donated
                            // USER HAS DONATED TEXT
                            ? "Hi there ".concat(userInfo.name, ", thanks for joining the Inclure.net waitlist :)\n\n        Not only did you do that, but you also made the kind decision to support us with a donation. This helps us in bringing the project to life, but also gives you 3 months of Pro membership when Inclure.net launches, how cool!\n\n        We'll be sure to update you as soon as the project launches!\n\n\n        In the meantime if you have any questions you can always contact us here:\n\n        inclure.net@gmail.com\n\n\n        Have a good one,\n\n        Inclure.net")
                            // USER HAS NOT DONATED TEXT
                            : "Bonjour ".concat(userInfo.name, ", merci d'avoir rejoint la liste d'attente Inclure.net :)\n\n            Vous serez tenu\u00B7e\u00B7s au courant de la progression du projet, promis!\n\n\n            En attendant si vous avez des questions n'h\u00E9sitez pas \u00E0 nous contacter: inclure.net@gmail.com\n\n\n            Vous \u00EAtes une bonne personne,\n\n            Inclure.net");
                    mailOptions = {
                        from: 'Inclure.net <inclure.net@gmail.com>',
                        to: userInfo.email,
                        bcc: "frazic.dev@gmail.com",
                        subject: "Merci d'avoir rejoint la liste d'attente Inclure.net!",
                        text: text
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            logger.error("".concat(stringifyUserInfo(userInfo), ": Error sending email: ").concat(error));
                        }
                        else {
                            logger.info("".concat(stringifyUserInfo(userInfo), ": Email sent: ").concat(info.response));
                        }
                    });
                    if (error) {
                        if (error.code === "23505")
                            return [2 /*return*/, { code: 409, errorMessage: "Email déjà enregistré :c" }];
                        return [2 /*return*/, { code: 500, errorMessage: error.message }];
                    }
                    return [2 /*return*/, {}];
            }
        });
    });
}
function stringifyUserInfo(userInfo) {
    return JSON.stringify(userInfo).replace(/["']/g, "'");
}

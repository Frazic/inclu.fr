"use strict";
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
exports.__esModule = true;
require('dotenv').config();
var logger = require("./winston.ts");
// EXPRESS
var express = require('express');
var app = express();
app.listen(process.env.PORT, function () { logger.info("Inclure.net server running on port ".concat(process.env.PORT)); });
// CORS
var cors = require("cors");
app.use(cors({
    origin: true
}));
// SUPABASE
var supabase = require("./supabase.ts");
// OPENAI
var openai_1 = require("openai");
var configuration = new openai_1.Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY
});
var openai = new openai_1.OpenAIApi(configuration);
var _a = require('gpt-3-encoder'), encode = _a.encode, decode = _a.decode;
var countTokens = function (input) {
    var encoded = encode(input);
    return encoded.length;
};
// ENDPOINTS
app.get('/', function (req, res) {
    logger.info("Hello!");
    res.send('Hello!');
});
app.post("/transform", express.json(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var prompt, preparedPrompt, tokenCount, completion, response, id, error_1;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                prompt = req.body.prompt;
                logger.info("Received request to /transform for prompt: " + prompt);
                if (!prompt || prompt.length === 0 || prompt === "")
                    return [2 /*return*/];
                preparedPrompt = "Rend ce texte inclusif en respectant ces crit\u00E8res: Utilise soit des points m\u00E9dians (Exemple: citoyen devient citoyen⸱ne), soit des mot-valises (Exemple: acteur devient acteurice, ils devient iels), et omet compl\u00E8tement ce qui peut \u00EAtre stigmatisant comme le handicap ou la race. \"".concat(prompt, "\"");
                tokenCount = countTokens(preparedPrompt);
                _e.label = 1;
            case 1:
                _e.trys.push([1, 4, , 5]);
                return [4 /*yield*/, openai.createCompletion({
                        model: "text-davinci-003",
                        prompt: preparedPrompt,
                        max_tokens: 100 + tokenCount,
                        temperature: 0.6
                    })];
            case 2:
                completion = _e.sent();
                response = (_a = completion.data.choices[0].text) === null || _a === void 0 ? void 0 : _a.replace("\n\n", "");
                if (!response) {
                    throw new Error("Empty response received from OpenAI");
                }
                // Log and insert log into Supabase
                logger.info({ prompt: prompt, response: response, tokens_used: (_b = completion.data.usage) === null || _b === void 0 ? void 0 : _b.total_tokens });
                return [4 /*yield*/, insertNewUsageLogIntoSupabase({
                        prompt: prompt,
                        response: response,
                        tokens_used: (_c = completion.data.usage) === null || _c === void 0 ? void 0 : _c.total_tokens
                    })
                    // Send response back
                ];
            case 3:
                id = _e.sent();
                // Send response back
                res.json({
                    prompt: prompt,
                    response: response,
                    tokens_used: (_d = completion.data.usage) === null || _d === void 0 ? void 0 : _d.total_tokens,
                    database_id: id
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _e.sent();
                res.status(500);
                if (error_1.response) {
                    logger.error(error_1.response.status);
                    logger.error(error_1.response.data);
                    res.json({ error: { message: error_1.message, status: error_1.response.status, data: error_1.response.data } });
                }
                else {
                    logger.error(error_1.message);
                    res.json({ error: { message: error_1.message, status: null, data: null } });
                }
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post("/feedback", express.json(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var feedback, _a, data, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                feedback = req.body;
                logger.info("Receiving feedback", { feedback: feedback });
                if (!feedback || !feedback.id || !feedback.type)
                    return [2 /*return*/];
                return [4 /*yield*/, supabase
                        .from("usage_log")
                        .update({ feedback: feedback.type })
                        .eq("id", feedback.id)
                        .select()];
            case 1:
                _a = _b.sent(), data = _a.data, error = _a.error;
                if (error) {
                    logger.error({ error: error });
                }
                else {
                    logger.info("Updated feedback for " + feedback.id);
                }
                res.send();
                return [2 /*return*/];
        }
    });
}); });
function insertNewUsageLogIntoSupabase(usage) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabase
                        .from("usage_log")
                        .insert([{
                            prompt: usage.prompt,
                            response: usage.response,
                            tokens_used: usage.tokens_used
                        }])
                        .select()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        logger.error({ error: error });
                        return [2 /*return*/, null];
                    }
                    else {
                        logger.info("Added to DB", data[0]);
                        return [2 /*return*/, data[0].id];
                    }
                    return [2 /*return*/];
            }
        });
    });
}

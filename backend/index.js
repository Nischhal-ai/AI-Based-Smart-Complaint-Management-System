const dns = require("dns").promises;
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());


// ===========================
// MongoDB Connection
// ===========================

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(() => console.log("MongoDB Connection Failed"));


// ===========================
// Models
// ===========================

const User = require("./models/User");
const Complaint = require("./models/Complaint");


// ===========================
// Auth Middleware
// ===========================

const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                message: "Please login first"
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};


// ===========================
// AUTH APIs
// ===========================


// Register

app.post("/api/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existing = await User.findOne({ email });

        if (existing) {

            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({
            message: "Registered successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: "Unable to register user"
        });
    }
});


// Login

app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {

            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(

            {
                id: user._id,
                name: user.name
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (err) {

        res.status(500).json({
            message: "Unable to login"
        });
    }
});


// ===========================
// COMPLAINT APIs
// ===========================


// Add Complaint

app.post(
    "/api/complaints",
    authMiddleware,

    async (req, res) => {

        try {

            const {
                name,
                email,
                title,
                description,
                category,
                location
            } = req.body;

            if (
                !name ||
                !email ||
                !title ||
                !description ||
                !category ||
                !location
            ) {

                return res.status(400).json({
                    message: "Please fill all complaint details"
                });
            }

            const complaint =
                new Complaint(req.body);

            await complaint.save();

            res.json({
                message: "Complaint Registered Successfully",
                complaint
            });

        } catch (err) {

            res.status(500).json({
                message: "Unable to register complaint"
            });
        }
    }
);


// Get All Complaints

app.get(
    "/api/complaints",
    authMiddleware,

    async (req, res) => {

        try {

            const complaints =
                await Complaint.find();

            res.json(complaints);

        } catch (err) {

            res.status(500).json({
                message:
                    "Unable to fetch complaints"
            });
        }
    }
);


// Search Complaint by Location

app.get(
    "/api/complaints/search",
    authMiddleware,

    async (req, res) => {

        try {

            const { location } = req.query;

            if (!location) {

                return res.status(400).json({
                    message:
                        "Please enter location"
                });
            }

            const complaints =
                await Complaint.find({

                    location:
                        new RegExp(
                            location,
                            "i"
                        )
                });

            if (complaints.length === 0) {

                return res.status(404).json({
                    message:
                        "No complaints found"
                });
            }

            res.json(complaints);

        } catch (err) {

            res.status(500).json({
                message:
                    "Unable to search complaints"
            });
        }
    }
);


// Update Complaint Status

app.put(
    "/api/complaints/:id",
    authMiddleware,

    async (req, res) => {

        try {

            const { status } = req.body;

            const complaint =
                await Complaint.findByIdAndUpdate(

                    req.params.id,

                    { status },

                    { new: true }
                );

            res.json({
                message:
                    "Complaint status updated",
                complaint
            });

        } catch (err) {

            res.status(500).json({
                message:
                    "Unable to update complaint"
            });
        }
    }
);


// Delete Complaint

app.delete(
    "/api/complaints/:id",
    authMiddleware,

    async (req, res) => {

        try {

            const complaint =
                await Complaint.findById(
                    req.params.id
                );

            if (!complaint) {

                return res.status(404).json({
                    message:
                        "Complaint not found"
                });
            }

            await Complaint.findByIdAndDelete(
                req.params.id
            );

            res.json({
                message:
                    "Complaint Deleted Successfully"
            });

        } catch (err) {

            res.status(500).json({
                message:
                    "Unable to delete complaint"
            });
        }
    }
);


// ===========================
// AI Complaint Analyzer API
// ===========================

app.post(
    "/api/ai/analyze",
    authMiddleware,

    async (req, res) => {

        try {

            const {
                title,
                description,
                category
            } = req.body;

            if (
                !title ||
                !description ||
                !category
            ) {

                return res.status(400).json({
                    message:
                        "Incomplete complaint data"
                });
            }

            // Mock AI response if no API key

            if (!process.env.OPENROUTER_API_KEY) {

                return res.json({

                    priority:
                        category === "Electricity"
                            ? "High"
                            : "Medium",

                    department:
                        category,

                    summary:
                        description.substring(0, 80),

                    autoResponse:
                        "Your complaint has been registered successfully."
                });
            }

            // OpenRouter AI API

            const response = await axios.post(

                "https://openrouter.ai/api/v1/chat/completions",

                {
                    model:
                        "openai/gpt-3.5-turbo",

                    messages: [
                        {
                            role: "user",

                            content: `

You are an AI Complaint Management Assistant.

Analyze this complaint professionally.

Complaint Title:
${title}

Complaint Description:
${description}

Complaint Category:
${category}

Return response in this exact format:

Priority:
(High / Medium / Low)

Responsible Department:
(Department name)

Summary:
(Short 2 line summary)

Auto Response:
(A professional response to the citizen)

Recommended Action:
(What authority should do)

Avoid repeating the exact complaint text.
Give intelligent and meaningful analysis.
`
                        }
                    ]
                },

                {
                    headers: {

                        Authorization:
                            `Bearer ${process.env.OPENROUTER_API_KEY}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );

            res.json({

                analysis:
                    response.data
                        .choices[0]
                        .message.content
            });

        } catch (err) {

            console.log(
                err.response?.data ||
                err.message
            );

            res.status(500).json({
                message:
                    "Unable to analyze complaint"
            });
        }
    }
);


// ===========================
// Root API
// ===========================
// ===========================
// Root APIs
// ===========================

app.get("/", (req, res) => {

    res.send(
        "AI Smart Complaint Management API Running"
    );
});

app.get("/api", (req, res) => {

    res.send(
        "Smart Complaint Management API Running"
    );
});


// ===========================
// Server Start
// ===========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});
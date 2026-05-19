import {
    useEffect,
    useState,
    useRef
} from "react";

import API from "../api";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {

    const [complaints, setComplaints]
        = useState([]);

    const [search, setSearch]
        = useState("");

    const [analysis, setAnalysis]
        = useState("");

    const [form, setForm] = useState({

        name: "",
        email: "",
        title: "",
        description: "",
        category: "",
        location: ""
    });

    const [userName, setUserName]
        = useState("");

    const navigate = useNavigate();

    // =========================
    // Refs for smooth scrolling
    // =========================

    const formRef = useRef(null);

    const complaintRef = useRef(null);


    // =========================
    // Fetch Complaints
    // =========================

    const fetchComplaints = async () => {

        try {

            const res = await API.get(
                "/complaints"
            );

            setComplaints(res.data);

        } catch (err) {

            alert("Unauthorized");

            navigate("/");
        }
    };


    // =========================
    // Initial Load
    // =========================

    useEffect(() => {

        fetchComplaints();

        const token =
            localStorage.getItem("token");

        if (token) {

            const payload =
                JSON.parse(
                    atob(token.split(".")[1])
                );

            setUserName(payload.name);
        }

    }, []);


    // =========================
    // Add Complaint
    // =========================

    const handleSubmit = async () => {

        try {

            await API.post(
                "/complaints",
                form
            );

            alert(
                "Complaint Registered Successfully"
            );

            // Clear Form

            setForm({

                name: "",
                email: "",
                title: "",
                description: "",
                category: "",
                location: ""
            });

            fetchComplaints();

            scrollToComplaints();

        } catch (err) {

            alert(

                err.response?.data?.message
                || "Something went wrong"
            );
        }
    };


    // =========================
    // Delete Complaint
    // =========================

    const deleteComplaint = async (id) => {

        try {

            await API.delete(
                `/complaints/${id}`
            );

            fetchComplaints();

        } catch (err) {

            alert(
                "Unable to delete complaint"
            );
        }
    };


    // =========================
    // Search Complaint
    // =========================

    const searchComplaint = async () => {

        try {

            const res = await API.get(

                `/complaints/search?location=${search}`
            );

            setComplaints(res.data);

        } catch (err) {

            alert(
                "No complaints found"
            );
        }
    };


    // =========================
    // AI Analysis
    // =========================

    const getAIAnalysis = async (
        complaint
    ) => {

        try {

            const res = await API.post(
                "/ai/analyze",
                complaint
            );

            if (res.data.analysis) {

                setAnalysis(
                    res.data.analysis
                );
            }

            else {

                setAnalysis(

                    `
Priority:
${res.data.priority}

Responsible Department:
${res.data.department}

Summary:
${res.data.summary}

Auto Response:
${res.data.autoResponse}
                    `
                );
            }

        } catch (err) {

            alert("AI Error");
        }
    };


    // =========================
    // Update Complaint Status
    // =========================

    const updateStatus = async (
        id,
        status
    ) => {

        try {

            await API.put(

                `/complaints/${id}`,

                { status }
            );

            fetchComplaints();

        } catch (err) {

            alert(
                "Unable to update status"
            );
        }
    };


    // =========================
    // Scroll Functions
    // =========================

    const scrollToForm = () => {

        formRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    };

    const scrollToComplaints = () => {

        complaintRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    };


    // =========================
    // Logout
    // =========================

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        navigate("/");
    };


    return (

        <div className="dashboard">


            {/* =========================
                NAVBAR
            ========================= */}

            <div className="navbar">

                <h2>
                    Smart Complaint System
                </h2>

                <div className="nav-links">

                    <button
                        onClick={scrollToForm}
                    >
                        Register Complaint
                    </button>

                    <button
                        onClick={scrollToComplaints}
                    >
                        See All Complaints
                    </button>

                    <button
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>


            {/* =========================
                WELCOME BAR
            ========================= */}

            <div className="top-bar">

                <h1>
                    AI Smart Complaint
                    Management System
                </h1>

                <h3>
                    Welcome, {userName}
                </h3>

            </div>


            {/* =========================
                COMPLAINT FORM
            ========================= */}

            <div
                className="form-box"
                ref={formRef}
            >

                <h2>
                    Register Complaint
                </h2>

                <input
                    placeholder="Name"

                    value={form.name}

                    onChange={(e) =>
                        setForm({

                            ...form,

                            name:
                                e.target.value
                        })
                    }
                />

                <input
                    placeholder="Email"

                    value={form.email}

                    onChange={(e) =>
                        setForm({

                            ...form,

                            email:
                                e.target.value
                        })
                    }
                />

                <input
                    placeholder="Complaint Title"

                    value={form.title}

                    onChange={(e) =>
                        setForm({

                            ...form,

                            title:
                                e.target.value
                        })
                    }
                />

                <textarea
                    placeholder="Complaint Description"

                    value={form.description}

                    onChange={(e) =>
                        setForm({

                            ...form,

                            description:
                                e.target.value
                        })
                    }
                />

                <input
                    placeholder="Complaint Category"

                    value={form.category}

                    onChange={(e) =>
                        setForm({

                            ...form,

                            category:
                                e.target.value
                        })
                    }
                />

                <input
                    placeholder="Location"

                    value={form.location}

                    onChange={(e) =>
                        setForm({

                            ...form,

                            location:
                                e.target.value
                        })
                    }
                />

                <button
                    onClick={handleSubmit}
                >
                    Submit Complaint
                </button>

            </div>


            {/* =========================
                SEARCH
            ========================= */}

            <div className="search-box">

                <input
                    placeholder="Search By Location"

                    value={search}

                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

                <button
                    onClick={searchComplaint}
                >
                    Search
                </button>

                <button
                    onClick={fetchComplaints}
                >
                    Show All
                </button>

            </div>


            {/* =========================
                COMPLAINT LIST
            ========================= */}

            <div
                className="employee-list"
                ref={complaintRef}
            >

                {
                    complaints.map((c) => (

                        <div

                            className={`employee-card

${c.status === "Pending"
    ? "pending"
    : c.status === "Resolved"
    ? "resolved"
    : "progress"
}`}

                            key={c._id}
                        >

                            <h3>
                                {c.title}
                            </h3>

                            <p>
                                <strong>Name:</strong>
                                {" "}
                                {c.name}
                            </p>

                            <p>
                                <strong>Email:</strong>
                                {" "}
                                {c.email}
                            </p>

                            <p>
                                <strong>Category:</strong>
                                {" "}
                                {c.category}
                            </p>

                            <p>
                                <strong>Location:</strong>
                                {" "}
                                {c.location}
                            </p>

                            <p>
                                <strong>Status:</strong>
                                {" "}
                                {c.status}
                            </p>

                            <p>
                                <strong>Date:</strong>
                                {" "}
                                {
                                    new Date(
                                        c.createdAt
                                    ).toLocaleDateString()
                                }
                            </p>

                            <p>
                                <strong>Description:</strong>
                                {" "}
                                {c.description}
                            </p>


                            {/* STATUS UPDATE */}

                            <select

    value={c.status}

    onChange={(e) =>

        updateStatus(
            c._id,
            e.target.value
        )
    }
>

    <option value="Pending">
        Pending
    </option>

    <option value="In Progress">
        In Progress
    </option>

    <option value="Resolved">
        Resolved
    </option>

</select>


                            {/* AI BUTTON */}

                            <button
                                onClick={() =>
                                    getAIAnalysis(c)
                                }
                            >
                                AI Analysis
                            </button>


                            {/* DELETE BUTTON */}

                            <button
                                onClick={() =>
                                    deleteComplaint(
                                        c._id
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>
                    ))
                }

            </div>


            {/* =========================
                AI ANALYSIS BOX
            ========================= */}

            <div className="ai-box">

                <h2>
                    AI Analysis Result
                </h2>

                {
                    analysis ? (

                        <div
                            className="recommendation-content"
                        >

                            {
                                analysis
                                    .split("\n")
                                    .map(

                                        (
                                            line,
                                            index
                                        ) => (

                                            <p
                                                key={index}
                                            >
                                                {line}
                                            </p>
                                        )
                                    )
                            }

                        </div>

                    ) : (

                        <p>

                            Click on AI Analysis
                            button to generate
                            smart complaint insights

                        </p>
                    )
                }

            </div>

        </div>
    );
}
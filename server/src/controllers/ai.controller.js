export const planner = (req, res) => {
    const {
        destination,
        days,
        travelers,
        budget,
        interests,
        travelType
    } = req.body;

    if (
        !destination ||
        !days ||
        !travelers ||
        !budget ||
        !interests ||
        !travelType
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const tripPlan = {
            destination,
            days,
            travelers,
            budget,
            interests,
            travelType,

            itinerary: [
                {
                    day: 1,
                    title: "Arrival & Local Exploration",
                    activities: [
                        {
                            time: "10:00 AM",
                            place: "Hotel",
                            activity: "Check-in and rest"
                        },
                        {
                            time: "01:00 PM",
                            place: "Local Restaurant",
                            activity: "Lunch"
                        },
                        {
                            time: "04:00 PM",
                            place: "City Center",
                            activity: "Local sightseeing"
                        },
                        {
                            time: "07:00 PM",
                            place: "Local Market",
                            activity: "Explore the market and dinner"
                        }
                    ]
                },

                {
                    day: 2,
                    title: "Main Attractions",
                    activities: [
                        {
                            time: "09:00 AM",
                            place: "Main Tourist Attraction",
                            activity: "Sightseeing"
                        },
                        {
                            time: "01:00 PM",
                            place: "Local Restaurant",
                            activity: "Lunch"
                        },
                        {
                            time: "03:00 PM",
                            place: "Popular Tourist Spot",
                            activity: "Explore and photography"
                        },
                        {
                            time: "07:00 PM",
                            place: "Local Cafe",
                            activity: "Dinner and relaxation"
                        }
                    ]
                },

                {
                    day: 3,
                    title: "Relaxation & Shopping",
                    activities: [
                        {
                            time: "10:00 AM",
                            place: "Popular Local Place",
                            activity: "Sightseeing"
                        },
                        {
                            time: "01:00 PM",
                            place: "Local Restaurant",
                            activity: "Lunch"
                        },
                        {
                            time: "04:00 PM",
                            place: "Shopping Market",
                            activity: "Shopping"
                        },
                        {
                            time: "07:00 PM",
                            place: "Hotel",
                            activity: "Pack and relax"
                        }
                    ]
                }
            ],

            budgetBreakdown: {
                accommodation: Math.round(budget * 0.35),
                food: Math.round(budget * 0.20),
                transport: Math.round(budget * 0.20),
                activities: Math.round(budget * 0.15),
                miscellaneous: Math.round(budget * 0.10)
            },

            packingList: [
                "Comfortable clothes",
                "Comfortable shoes",
                "Phone charger",
                "Power bank",
                "ID proof",
                "Water bottle"
            ],

            tips: [
                "Start sightseeing early",
                "Keep some cash with you",
                "Keep important documents safe"
            ]
        };

        return res.status(200).json({
            success: true,
            message: "Trip plan created successfully",
            data: tripPlan
        });

    } catch (error) {
        console.error("Planner error:", error);

        return res.status(500).json({
            success: false,
            message: "Error while creating plan"
        });
    }
};
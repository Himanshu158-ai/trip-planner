export const plannerPrompt = ({
    destination,
    days,
    travelers,
    budget,
    interests,
    travelType
}) => {
    return `
You are an expert travel planner.

Create a practical and enjoyable trip plan based on the following requirements.

Destination: ${destination}
Days: ${days}
Travelers: ${travelers}
Budget: ₹${budget}
Interests: ${interests.join(", ")}
Travel Type: ${travelType}

Instructions:

1. Create an itinerary for exactly ${days} days.
2. Consider the user's interests and travel type.
3. Keep the itinerary practical and not unnecessarily hectic.
4. Group nearby places together where possible.
5. Include morning, afternoon and evening activities.
6. Include estimated duration for activities.
7. Keep the estimated expenses within the given budget.
8. Provide a budget breakdown.
9. Provide useful travel tips.
10. Do not invent exact real-time information.
11. Return ONLY valid JSON.
12. Do not use markdown or code fences.

Return the response using this structure:

{
    "destination": "${destination}",
    "duration": ${days},
    "travelers": ${travelers},
    "travelType": "${travelType}",
    "budget": {
        "total": ${budget},
        "currency": "INR",
        "breakdown": {
            "accommodation": 0,
            "food": 0,
            "transport": 0,
            "activities": 0,
            "miscellaneous": 0
        }
    },
    "itinerary": [
        {
            "day": 1,
            "title": "Day title",
            "activities": [
                {
                    "time": "09:00 AM",
                    "place": "Place name",
                    "activity": "What to do",
                    "estimatedDuration": "2 hours",
                    "estimatedCost": 0
                }
            ]
        }
    ],
    "travelTips": []
}
`;
};
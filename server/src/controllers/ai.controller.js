import { plannerService } from "../services/ai.service.js";
import {plannerPrompt} from "../prompts/planner.prompt.js";

export const planner = async (req, res) => {
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


    const prompt = plannerPrompt({
        destination,
        days,
        travelers,
        budget,
        interests,
        travelType
    })

    try {
        const response = await plannerService(prompt);
        const data = response.output_text;

        // parse JSON
        const tripPlan = JSON.parse(data);

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
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const cropDatabase: Record<string, {
  waterNeeds: string;
  nutrients: { n: string; p: string; k: string };
  commonPests: string[];
  diseases: string[];
  idealTemp: [number, number];
  idealHumidity: [number, number];
  growthStages: string[];
  soilPH: string;
}> = {
  rice: {
    waterNeeds: "high",
    nutrients: { n: "high", p: "medium", k: "medium" },
    commonPests: ["Brown Planthopper", "Stem Borer", "Leaf Folder", "Rice Blast Fungus"],
    diseases: ["Blast", "Bacterial Leaf Blight", "Sheath Blight", "False Smut"],
    idealTemp: [20, 35],
    idealHumidity: [70, 90],
    growthStages: ["Germination", "Seedling", "Tillering", "Panicle Initiation", "Flowering", "Maturity"],
    soilPH: "5.5 - 7.0",
  },
  tomato: {
    waterNeeds: "medium",
    nutrients: { n: "medium", p: "high", k: "high" },
    commonPests: ["Whitefly", "Aphids", "Tomato Fruitworm", "Spider Mites"],
    diseases: ["Early Blight", "Late Blight", "Fusarium Wilt", "Tomato Mosaic Virus"],
    idealTemp: [18, 30],
    idealHumidity: [40, 70],
    growthStages: ["Seedling", "Vegetative", "Flowering", "Fruit Set", "Ripening"],
    soilPH: "6.0 - 6.8",
  },
  maize: {
    waterNeeds: "medium",
    nutrients: { n: "high", p: "medium", k: "medium" },
    commonPests: ["Fall Armyworm", "Corn Earworm", "Aphids", "Rootworm"],
    diseases: ["Gray Leaf Spot", "Northern Corn Leaf Blight", "Common Rust", "Stalk Rot"],
    idealTemp: [18, 32],
    idealHumidity: [50, 80],
    growthStages: ["Germination", "Seedling", "Vegetative", "Tasseling", "Silking", "Maturity"],
    soilPH: "5.8 - 7.0",
  },
  wheat: {
    waterNeeds: "low",
    nutrients: { n: "high", p: "medium", k: "low" },
    commonPests: ["Aphids", "Hessian Fly", "Wheat Midge", "Sunn Pest"],
    diseases: ["Stripe Rust", "Leaf Rust", "Powdery Mildew", "Fusarium Head Blight"],
    idealTemp: [12, 25],
    idealHumidity: [40, 65],
    growthStages: ["Germination", "Tillering", "Stem Extension", "Heading", "Flowering", "Ripening"],
    soilPH: "6.0 - 7.5",
  },
  potato: {
    waterNeeds: "medium",
    nutrients: { n: "medium", p: "high", k: "high" },
    commonPests: ["Colorado Potato Beetle", "Aphids", "Wireworm", "Nematodes"],
    diseases: ["Late Blight", "Early Blight", "Common Scab", "Blackleg"],
    idealTemp: [15, 25],
    idealHumidity: [60, 80],
    growthStages: ["Sprout Development", "Vegetative Growth", "Tuber Initiation", "Tuber Bulking", "Maturation"],
    soilPH: "4.8 - 6.0",
  },
  cotton: {
    waterNeeds: "medium",
    nutrients: { n: "medium", p: "medium", k: "high" },
    commonPests: ["Bollworm", "Pink Bollworm", "Aphids", "Thrips", "Whitefly"],
    diseases: ["Bacterial Blight", "Verticillium Wilt", "Fusarium Wilt", "Boll Rot"],
    idealTemp: [22, 35],
    idealHumidity: [40, 60],
    growthStages: ["Germination", "Seedling", "Squaring", "Flowering", "Boll Development", "Maturity"],
    soilPH: "5.8 - 7.0",
  },
  soybean: {
    waterNeeds: "medium",
    nutrients: { n: "low", p: "medium", k: "medium" },
    commonPests: ["Soybean Aphid", "Bean Leaf Beetle", "Stink Bug", "White Grub"],
    diseases: ["Soybean Rust", "Phytophthora Root Rot", "Sudden Death Syndrome", "White Mold"],
    idealTemp: [20, 30],
    idealHumidity: [50, 75],
    growthStages: ["Germination", "Emergence", "Vegetative", "Flowering", "Pod Fill", "Maturity"],
    soilPH: "6.0 - 7.0",
  },
};

function generateRecommendations(cropId: string, temp: number, humidity: number, rainfall: number, soilType: string, season: string) {
  const crop = cropDatabase[cropId] || cropDatabase["maize"];
  const [minTemp, maxTemp] = crop.idealTemp;
  const [minHum, maxHum] = crop.idealHumidity;

  const tempStatus = temp < minTemp ? "cold" : temp > maxTemp ? "hot" : "optimal";
  const humStatus = humidity < minHum ? "dry" : humidity > maxHum ? "humid" : "optimal";
  const pestRisk = humidity > maxHum && temp > minTemp ? "high" : humidity > (minHum + maxHum) / 2 ? "medium" : "low";

  const irrigation = {
    frequency: rainfall > 50 ? "Every 3-4 days" : rainfall > 20 ? "Every 2-3 days" : "Daily",
    amount: crop.waterNeeds === "high" ? "40-50mm per session" : crop.waterNeeds === "medium" ? "25-35mm per session" : "15-20mm per session",
    method: soilType === "sandy" ? "Drip irrigation (sandy soil drains fast)" : soilType === "clay" ? "Furrow irrigation (avoid waterlogging)" : "Sprinkler or drip irrigation",
    tips: [
      tempStatus === "hot" ? "Water in early morning or evening to reduce evaporation." : "Water consistently to maintain soil moisture.",
      rainfall > 40 ? "Reduce irrigation frequency — recent rainfall is sufficient." : "Monitor soil moisture daily in this dry period.",
      "Ensure good drainage to prevent root rot, especially in clay soils.",
    ],
  };

  const fertilizer = {
    npkRatio: `N:${crop.nutrients.n === "high" ? "120-150" : "80-100"}kg/ha  P:${crop.nutrients.p === "high" ? "60-80" : "40-60"}kg/ha  K:${crop.nutrients.k === "high" ? "80-100" : "40-60"}kg/ha`,
    schedule: "Base dose at planting, top-dress at 30 and 60 days after sowing.",
    organicOptions: ["Compost (5-10 tons/ha)", "Well-rotted farmyard manure (FYM)", "Vermicompost (2-3 tons/ha)", "Green manure (Dhaincha/Sunhemp)"],
    tips: [
      tempStatus === "hot" ? "Apply fertilizers in cooler morning hours to prevent burning." : "Apply fertilizers when soil moisture is adequate.",
      humStatus === "humid" ? "Excess humidity can cause nutrient leaching — split applications recommended." : "Ensure soil moisture before fertilizer application.",
      `Target soil pH of ${crop.soilPH} for optimal nutrient uptake.`,
    ],
  };

  const pestControl = {
    riskLevel: pestRisk,
    currentThreats: crop.commonPests.slice(0, pestRisk === "high" ? 4 : 2),
    diseases: crop.diseases.slice(0, pestRisk === "high" ? 3 : 2),
    preventions: [
      "Scout fields every 5-7 days for early pest detection.",
      "Maintain proper plant spacing for air circulation.",
      "Remove and destroy infected plant material immediately.",
      "Use certified disease-free seeds.",
    ],
    treatments: [
      pestRisk === "high" ? "Apply approved systemic insecticide — consult local extension officer." : "Continue monitoring; consider neem-based biopesticides if pest count rises.",
      "Use fungicides preventively during high humidity periods.",
      "Introduce beneficial insects (ladybugs, parasitic wasps) where feasible.",
    ],
  };

  const generalTips = [
    `Current temperature (${temp}°C) is ${tempStatus === "optimal" ? "ideal" : tempStatus === "hot" ? "above optimal range — provide shade nets if possible" : "below optimal — consider mulching to retain warmth"} for ${cropId}.`,
    `Humidity at ${humidity}% is ${humStatus === "optimal" ? "within the ideal range" : humStatus === "humid" ? "high — increase ventilation and watch for fungal diseases" : "low — increase irrigation and consider mulching"}.`,
    season === "monsoon" ? "Monsoon season: Ensure proper field drainage and raised bed cultivation where possible." : season === "winter" ? "Winter season: Protect young plants from frost with row covers or mulch." : "Summer season: Conserve moisture with mulching and strategic irrigation timing.",
    `Soil type (${soilType}): ${soilType === "clay" ? "Improve drainage by adding organic matter or sand. Avoid tilling when wet." : soilType === "sandy" ? "Add organic matter to improve water retention. More frequent but smaller irrigations recommended." : "Good soil structure — maintain with organic matter additions each season."}`,
  ];

  return { irrigation, fertilizer, pestControl, generalTips, cropData: { ...crop } };
}

function generateAiResponse(question: string, cropId: string, temp: number, humidity: number, context: string): string {
  const q = question.toLowerCase();
  const cropName = cropId.charAt(0).toUpperCase() + cropId.slice(1);

  if (q.includes("water") || q.includes("irrigat")) {
    const rec = temp > 30 ? "Since it's quite hot right now" : "Given current conditions";
    return `${rec}, your ${cropName} crop needs consistent moisture. Water in the early morning (6-8 AM) to minimize evaporation losses. Check if the top 2-3 inches of soil feel dry before each watering — that's your best guide. Avoid overwatering as it encourages root diseases. A simple moisture meter can take the guesswork out of this entirely.`;
  }
  if (q.includes("pest") || q.includes("insect") || q.includes("bug")) {
    return `With humidity at ${humidity}%, pest pressure can be moderate to high for ${cropName}. Walk your fields every 5-7 days and check the underside of leaves — that's where most pests hide. If you find more than 5-10 pests per plant, it's time to act. Start with neem oil spray (5ml per liter) before moving to chemical pesticides. Early action saves your crop and reduces costs significantly.`;
  }
  if (q.includes("fertili") || q.includes("nutrient") || q.includes("npk")) {
    return `For ${cropName}, think of fertilizer in three phases: at planting (base dose with phosphorus and potassium), at 30 days (nitrogen top-dress for leaf growth), and at 60 days (another nitrogen boost for grain/fruit fill). Always apply after irrigation or rain when the soil is moist — never on dry soil. Organic options like compost or FYM at 5 tons/hectare are excellent base amendments that also improve soil health long-term.`;
  }
  if (q.includes("disease") || q.includes("fungus") || q.includes("blight")) {
    const riskWord = humidity > 75 ? "elevated" : "moderate";
    return `Disease risk is ${riskWord} given the current humidity of ${humidity}%. For ${cropName}, the main threats are fungal diseases that thrive in warm, humid conditions. Prevention is key: ensure good air circulation by proper spacing, avoid wetting leaves during irrigation, and remove any infected plant parts immediately. A preventive copper-based fungicide spray every 10-14 days during high-humidity periods can protect your crop effectively.`;
  }
  if (q.includes("harvest") || q.includes("yield") || q.includes("when")) {
    return `Harvest timing for ${cropName} depends on visual and physical cues more than calendar dates. Look for characteristic maturity signs — color changes, firmness, and seed development. Harvesting at the right moisture content is critical: too early reduces quality and yield, too late risks field losses. Keep detailed records of planting dates and local growing degree days to predict harvest windows more accurately each season.`;
  }
  if (q.includes("soil") || q.includes("ph") || q.includes("organic")) {
    return `Healthy soil is the foundation of good ${cropName} yields. Aim to add 2-3 tons of organic matter per hectare each season — compost, farmyard manure, or green manures all work well. Test your soil pH every 2-3 years; most crops prefer 6.0-7.0. If too acidic, lime can correct it; if alkaline, sulfur or organic matter helps. Healthy soil biology means better nutrient availability and natural disease suppression.`;
  }
  if (q.includes("weather") || q.includes("temperature") || q.includes("climate")) {
    return `Current conditions show ${temp}°C temperature and ${humidity}% humidity. For ${cropName}, ${temp > 32 ? "the heat stress risk is real — consider shade nets for seedlings and ensure adequate irrigation to keep roots cool" : temp < 15 ? "cooler temperatures will slow growth — be patient and avoid over-fertilizing" : "conditions are favorable for good growth"}. Monitor weather forecasts closely during critical growth stages like flowering and fruit/grain set, as temperature extremes during these periods can significantly impact your final yield.`;
  }

  return `Great question about your ${cropName} crop! Based on current conditions (${temp}°C, ${humidity}% humidity), here's what I'd suggest: focus on the three pillars of good crop management — consistent soil moisture, balanced nutrition, and regular scouting for pests and diseases. Each week, check your irrigation schedule against actual rainfall, assess plant color and vigor for nutrient status, and inspect 20-30 plants per field for pest or disease signs. Small, consistent actions beat reactive crisis management every time. Is there a specific challenge you're facing right now?`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace("/farming-advisor", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (req.method === "POST" && path === "/recommendations") {
      const body = await req.json();
      const { cropId, cropName, location, temperature, humidity, rainfall, windSpeed, soilType, season, sessionId } = body;

      const recommendations = generateRecommendations(cropId, temperature, humidity, rainfall, soilType, season);

      const { data: savedSession, error } = await supabase
        .from("farming_sessions")
        .insert({
          session_id: sessionId,
          crop_name: cropName,
          crop_id: cropId,
          location: location || "Unknown",
          temperature,
          humidity,
          rainfall: rainfall || 0,
          wind_speed: windSpeed || 10,
          soil_type: soilType,
          season,
        })
        .select()
        .single();

      if (error) console.error("DB insert error:", error);

      return new Response(JSON.stringify({ recommendations, sessionRecord: savedSession }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" && path === "/chat") {
      const body = await req.json();
      const { question, cropId, temperature, humidity, farmingSessionId, sessionId, context } = body;

      const answer = generateAiResponse(question, cropId, temperature, humidity, context || "");

      if (sessionId && farmingSessionId) {
        await supabase.from("chat_messages").insert([
          { session_id: sessionId, farming_session_id: farmingSessionId, role: "user", content: question },
          { session_id: sessionId, farming_session_id: farmingSessionId, role: "assistant", content: answer },
        ]);
      }

      return new Response(JSON.stringify({ answer }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET" && path === "/history") {
      const sessionId = url.searchParams.get("session_id");
      if (!sessionId) {
        return new Response(JSON.stringify({ error: "session_id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("farming_sessions")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      return new Response(JSON.stringify({ history: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

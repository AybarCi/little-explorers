import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 200,
            headers: corsHeaders,
        });
    }

    try {
        const url = new URL(req.url);
        const action = url.searchParams.get("action") || "list";
        const userId = url.searchParams.get("user_id");

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") || "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
        );

        // ACTION: List all users
        if (action === "list") {
            const page = parseInt(url.searchParams.get("page") || "1");
            const limit = parseInt(url.searchParams.get("limit") || "20");
            const searchQuery = url.searchParams.get("search");
            const ageFilter = url.searchParams.get("age");
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            let query = supabase
                .from("users")
                .select("*", { count: 'exact' })
                .order("created_at", { ascending: false });

            if (searchQuery) {
                query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
            }
            if (ageFilter && ageFilter !== 'all') {
                query = query.eq("age_group", ageFilter);
            }

            const { data: users, count, error } = await query.range(from, to);

            if (error) {
                return new Response(
                    JSON.stringify({ error: error.message }),
                    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            return new Response(
                JSON.stringify({ users, count }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // ACTION: Get dashboard stats
        if (action === "stats") {
            const { count: totalUsers } = await supabase.from("users").select("id", { count: 'exact', head: true });

            const { data: usersData, error: usersError } = await supabase
                .from("users")
                .select("diamonds, total_points, completed_games_count, created_at, updated_at")
                .order("created_at", { ascending: false });

            if (usersError) {
                return new Response(
                    JSON.stringify({ error: usersError.message }),
                    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            const totalDiamonds = usersData?.reduce((sum, u) => sum + (u.diamonds || 0), 0) || 0;
            const totalPoints = usersData?.reduce((sum, u) => sum + (u.total_points || 0), 0) || 0;
            const totalGamesPlayed = usersData?.reduce((sum, u) => sum + (u.completed_games_count || 0), 0) || 0;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const newUsersToday = usersData?.filter(u => new Date(u.created_at) >= today).length || 0;

            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const activeUsersWeek = usersData?.filter(u => new Date(u.updated_at) >= weekAgo).length || 0;

            // Fetch purchases for revenue stats
            const { data: purchases } = await supabase
                .from("diamond_purchases")
                .select("price_amount, platform");

            const totalRevenue = purchases?.reduce((sum: number, p: any) => sum + (p.price_amount || 0), 0) || 0;
            const iosPurchases = purchases?.filter((p: any) => p.platform === 'ios').length || 0;
            const androidPurchases = purchases?.filter((p: any) => p.platform === 'android').length || 0;

            // Recent users query (separate to limit fields)
            const { data: recentUsers } = await supabase
                .from("users")
                .select("id, full_name, email, age_group, total_points, diamonds, created_at")
                .order("created_at", { ascending: false })
                .limit(5);

            return new Response(
                JSON.stringify({
                    stats: {
                        totalUsers: totalUsers || 0,
                        totalDiamonds,
                        totalPoints,
                        totalGamesPlayed,
                        newUsersToday,
                        activeUsersWeek,
                        totalRevenue,
                        iosPurchases,
                        androidPurchases,
                    },
                    recentUsers: recentUsers || [],
                }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // ACTION: Get user detail
        if (action === "detail" && userId) {
            const { data: user, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .single();

            if (userError) {
                return new Response(
                    JSON.stringify({ error: userError.message }),
                    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            // Calculate regenerated energy
            const MAX_ENERGY = 5;
            const ENERGY_REGEN_TIME_MS = 2 * 60 * 60 * 1000;

            let calculatedEnergy = user.energy || 0;
            const lastEnergyUpdate = user.last_energy_update;

            if (lastEnergyUpdate && calculatedEnergy < MAX_ENERGY) {
                const now = Date.now();
                const timePassed = now - lastEnergyUpdate;
                const energyToAdd = Math.floor(timePassed / ENERGY_REGEN_TIME_MS);
                calculatedEnergy = Math.min(calculatedEnergy + energyToAdd, MAX_ENERGY);
            }

            const userWithCalculatedEnergy = {
                ...user,
                energy: calculatedEnergy,
            };

            const { data: gameProgress } = await supabase
                .from("game_progress")
                .select("*, games(*)")
                .eq("user_id", userId);

            const { data: challenges } = await supabase
                .from("challenge_claims")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            const { data: inventory } = await supabase
                .from("user_inventory")
                .select("*")
                .eq("user_id", userId)
                .order("purchased_at", { ascending: false });

            const inventoryWithDetails = await Promise.all(
                (inventory || []).map(async (item: any) => {
                    let itemDetails = null;

                    if (item.item_type === 'avatar') {
                        const { data } = await supabase.from("avatars").select("*").eq("id", item.item_id).single();
                        itemDetails = data;
                    } else if (item.item_type === 'frame') {
                        const { data } = await supabase.from("frames").select("*").eq("id", item.item_id).single();
                        itemDetails = data;
                    } else if (item.item_type === 'badge') {
                        const { data } = await supabase.from("badges").select("*").eq("id", item.item_id).single();
                        itemDetails = data;
                    }

                    return { ...item, item_details: itemDetails };
                })
            );

            const { data: diamondPurchases } = await supabase
                .from("diamond_purchases")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            return new Response(
                JSON.stringify({
                    user: userWithCalculatedEnergy,
                    gameProgress: gameProgress || [],
                    challenges: challenges || [],
                    inventory: inventoryWithDetails,
                    diamondPurchases: diamondPurchases || [],
                }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // ACTION: Get leaderboard
        if (action === "leaderboard") {
            const type = url.searchParams.get("type") || "points"; // 'points' or 'score'
            const page = parseInt(url.searchParams.get("page") || "1");
            const limit = parseInt(url.searchParams.get("limit") || "10");
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            if (type === "points") {
                const { data: pointsUsers, count, error: pointsError } = await supabase
                    .from("users")
                    .select("id, full_name, email, total_points", { count: 'exact' })
                    .order("total_points", { ascending: false })
                    .range(from, to);

                if (pointsError) {
                    return new Response(
                        JSON.stringify({ error: pointsError.message }),
                        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                    );
                }

                return new Response(
                    JSON.stringify({
                        data: pointsUsers,
                        count: count || 0
                    }),
                    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            } else {
                // Score leaderboard (fallback to manual aggregation + slice)
                const { data: progressData, error: progressError } = await supabase
                    .from("game_progress")
                    .select("user_id, score");

                if (progressError) {
                    return new Response(
                        JSON.stringify({ error: progressError.message }),
                        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                    );
                }

                const scoreMap: Record<string, number> = {};
                progressData?.forEach((p: any) => {
                    scoreMap[p.user_id] = (scoreMap[p.user_id] || 0) + (p.score || 0);
                });

                const scoreUsers = Object.keys(scoreMap).map(userId => ({
                    id: userId,
                    total_score: scoreMap[userId]
                })).sort((a, b) => b.total_score - a.total_score);

                const totalCount = scoreUsers.length;
                const paginatedScores = scoreUsers.slice(from, to + 1);

                // Fetch user details for the sliced result
                const userIds = paginatedScores.map(u => u.id);
                let filledUsers: any[] = [];

                if (userIds.length > 0) {
                    const { data: usersData } = await supabase
                        .from("users")
                        .select("id, full_name, email")
                        .in("id", userIds);

                    filledUsers = paginatedScores.map(u => {
                        const userDetail = usersData?.find(d => d.id === u.id);
                        return {
                            ...u,
                            full_name: userDetail?.full_name,
                            email: userDetail?.email
                        };
                    });
                }

                return new Response(
                    JSON.stringify({
                        data: filledUsers,
                        count: totalCount
                    }),
                    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }
        }

        // ACTION: Get games
        if (action === "games") {
            const { data: games, error: gamesError } = await supabase
                .from("games")
                .select("*")
                .order("category");

            if (gamesError) {
                return new Response(
                    JSON.stringify({ error: gamesError.message }),
                    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            const { data: progressData } = await supabase
                .from("game_progress")
                .select("game_id, score");

            const statsMap: Record<string, { plays: number; totalScore: number }> = {};
            progressData?.forEach((p: any) => {
                if (!statsMap[p.game_id]) {
                    statsMap[p.game_id] = { plays: 0, totalScore: 0 };
                }
                statsMap[p.game_id].plays++;
                statsMap[p.game_id].totalScore += p.score || 0;
            });

            const gamesWithStats = (games || []).map((g: any) => ({
                ...g,
                play_count: statsMap[g.id]?.plays || 0,
                avg_score: statsMap[g.id]?.plays
                    ? Math.round(statsMap[g.id].totalScore / statsMap[g.id].plays)
                    : 0,
            }));

            return new Response(
                JSON.stringify({ games: gamesWithStats }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // ACTION: Get all purchases
        if (action === "purchases") {
            const platform = url.searchParams.get("platform");
            const startDate = url.searchParams.get("start_date");
            const endDate = url.searchParams.get("end_date");
            const page = parseInt(url.searchParams.get("page") || "1");
            const limit = parseInt(url.searchParams.get("limit") || "10");
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            // 1. Get stats
            let statsQuery = supabase
                .from("diamond_purchases")
                .select("price_amount, diamond_amount, platform");

            if (platform) statsQuery = statsQuery.eq("platform", platform);
            if (startDate) statsQuery = statsQuery.gte("created_at", startDate);
            if (endDate) statsQuery = statsQuery.lte("created_at", endDate);

            const { data: statsData } = await statsQuery;

            const totalDiamonds = (statsData || []).reduce((sum: number, p: any) => sum + (p.diamond_amount || 0), 0);
            const totalRevenue = (statsData || []).reduce((sum: number, p: any) => sum + (p.price_amount || 0), 0);
            const iosPurchases = (statsData || []).filter((p: any) => p.platform === 'ios').length;
            const androidPurchases = (statsData || []).filter((p: any) => p.platform === 'android').length;

            // 2. Get Paginated Data
            let query = supabase
                .from("diamond_purchases")
                .select("*, user:users(id, full_name, email)", { count: 'exact' })
                .order("created_at", { ascending: false });

            if (platform) query = query.eq("platform", platform);
            if (startDate) query = query.gte("created_at", startDate);
            if (endDate) query = query.lte("created_at", endDate);

            const { data: purchases, count, error: purchasesError } = await query.range(from, to);

            if (purchasesError) {
                return new Response(
                    JSON.stringify({ error: purchasesError.message }),
                    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            return new Response(
                JSON.stringify({
                    purchases: purchases || [],
                    count: count || 0,
                    stats: {
                        total: statsData?.length || 0,
                        totalDiamonds,
                        totalRevenue,
                        iosPurchases,
                        androidPurchases,
                    }
                }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ error: "Invalid action" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});

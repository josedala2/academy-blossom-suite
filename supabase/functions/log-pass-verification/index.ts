import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationLogRequest {
  passId: string;
  passNumber: string | null;
  personName: string | null;
  personType: "estudante" | "professor" | "funcionario" | null;
  verificationStatus: "valid" | "expired" | "invalid" | "error";
  verificationCode: string;
  locationLatitude?: number | null;
  locationLongitude?: number | null;
  locationName?: string | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received pass verification log request");

    // Get client info
    const ipAddress = req.headers.get("x-forwarded-for") || 
                      req.headers.get("x-real-ip") || 
                      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Parse request body
    const body: VerificationLogRequest = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.passId || !body.verificationCode || !body.verificationStatus) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields: passId, verificationCode, verificationStatus" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Validate verification status
    const validStatuses = ["valid", "expired", "invalid", "error"];
    if (!validStatuses.includes(body.verificationStatus)) {
      console.error("Invalid verification status:", body.verificationStatus);
      return new Response(
        JSON.stringify({ error: "Invalid verification status" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert verification log
    const { data, error } = await supabase
      .from("pass_verification_logs")
      .insert({
        pass_id: body.passId,
        pass_number: body.passNumber,
        person_name: body.personName,
        person_type: body.personType,
        verification_status: body.verificationStatus,
        verification_code: body.verificationCode,
        ip_address: ipAddress,
        user_agent: userAgent,
        location_latitude: body.locationLatitude,
        location_longitude: body.locationLongitude,
        location_name: body.locationName,
        verified_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to log verification", details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Verification logged successfully:", data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        logId: data.id,
        message: "Verification logged successfully" 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Unexpected error:", errorMessage);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

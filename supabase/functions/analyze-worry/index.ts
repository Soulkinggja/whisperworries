import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { worry, useCase = 'venting', conversationHistory = [], attachmentUrl } = await req.json();
    
    if (!worry || typeof worry !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Worry text is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Customize the system prompt based on use case
    const useCasePrompts: Record<string, string> = {
      'venting': 'You are a compassionate listener. The user needs to vent and feel heard. Validate their feelings warmly, show empathy, and provide gentle encouragement. Keep your response supportive and understanding.',
      'journaling': 'You are a thoughtful journaling companion. Help the user reflect on their thoughts and feelings. Ask gentle questions that encourage deeper self-exploration and provide insights that help them understand themselves better.',
      'problem-solving': 'You are a practical problem-solving assistant. Help the user break down their concern into manageable steps. Provide clear, actionable advice and structured solutions they can implement.',
      'emotional-support': 'You are a caring emotional support companion. Provide warmth, comfort, and reassurance. Help the user feel less alone and remind them of their strength and resilience.',
      'self-reflection': 'You are a mindful reflection guide. Help the user gain perspective on their situation. Encourage them to consider different viewpoints and find meaningful insights about themselves and their circumstances.'
    };

    const systemPrompt = useCasePrompts[useCase] || useCasePrompts['venting'];

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing worry:', worry);
    console.log('Conversation history length:', conversationHistory.length);
    if (attachmentUrl) {
      console.log('Processing attachment:', attachmentUrl);
    }

    // Build user message content
    const userContent: any[] = [{ type: 'text', text: worry }];
    
    // Add image if attachment URL is provided
    if (attachmentUrl) {
      userContent.push({
        type: 'image_url',
        image_url: {
          url: attachmentUrl
        }
      });
    }

    // Build messages array with conversation history
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userContent
      }
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service requires payment. Please check your account.' }),
          { 
            status: 402, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content;

    if (!suggestion) {
      throw new Error('No suggestion received from AI');
    }

    console.log('Generated suggestion:', suggestion);

    return new Response(
      JSON.stringify({ suggestion }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in analyze-worry function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

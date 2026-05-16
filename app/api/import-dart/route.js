import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { dart_code } = await req.json();

    // Send the raw code to your Python Parser Engine
    const response = await fetch('https://appforge-parser-engine.onrender.com/parser-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dart_code }),
    });

    if (!response.ok) throw new Error(`Python API error: ${response.status}`);

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error connecting to Parser Engine:", error);
    return NextResponse.json(
      { success: false, error: "Failed to connect to AppForge Parser Engine." },
      { status: 500 }
    );
  }
}